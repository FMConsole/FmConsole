/**
 * Stats Scanner — AI Vision Module
 *
 * Uses Claude Vision API to extract structured player attributes
 * directly from FM screenshots. No OCR parsing needed — the AI
 * understands the screenshot layout and returns clean JSON.
 */

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

/* ── Rate limiting & caching ──────────────────────────────────────────── */

const DAILY_SCAN_LIMIT = 20;
const RATE_LIMIT_KEY = "fmc_vision_scans";
const CACHE_KEY_PREFIX = "fmc_vision_cache_";

function getDailyUsage() {
  try {
    const data = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || "{}");
    const today = new Date().toISOString().slice(0, 10);
    if (data.date !== today) return { date: today, count: 0 };
    return data;
  } catch {
    return { date: new Date().toISOString().slice(0, 10), count: 0 };
  }
}

function incrementUsage() {
  const usage = getDailyUsage();
  usage.count++;
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(usage));
}

function isRateLimited() {
  return getDailyUsage().count >= DAILY_SCAN_LIMIT;
}

function getRemainingScans() {
  return Math.max(0, DAILY_SCAN_LIMIT - getDailyUsage().count);
}

/**
 * Simple hash of image data for caching.
 * Uses a fast DJB2 hash on the first 10KB of base64 data.
 */
function hashImage(base64) {
  const sample = base64.substring(0, 10000);
  let hash = 5381;
  for (let i = 0; i < sample.length; i++) {
    hash = ((hash << 5) + hash + sample.charCodeAt(i)) & 0x7fffffff;
  }
  return hash.toString(36);
}

function getCachedResult(imageHash) {
  try {
    const cached = localStorage.getItem(CACHE_KEY_PREFIX + imageHash);
    if (!cached) return null;
    const data = JSON.parse(cached);
    // Cache expires after 24 hours
    if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(CACHE_KEY_PREFIX + imageHash);
      return null;
    }
    return data.result;
  } catch {
    return null;
  }
}

function setCachedResult(imageHash, result) {
  try {
    localStorage.setItem(CACHE_KEY_PREFIX + imageHash, JSON.stringify({
      timestamp: Date.now(),
      result,
    }));
  } catch {
    // localStorage full — silently fail
  }
}

const EXTRACTION_PROMPT = `You are analyzing a Football Manager (FM) player profile screenshot. Your task is to extract the player's information and ALL attribute values with perfect accuracy.

IMPORTANT READING INSTRUCTIONS:
- Each attribute row has the attribute NAME on the LEFT and the NUMBER VALUE on the RIGHT
- The number is always an integer between 1 and 20
- Some attributes have colored backgrounds (yellow, green, blue) — IGNORE the background colors and read ONLY the number value
- The "Technical" section includes both the main attributes AND "Set Pieces" below them (Corners, Free Kick Taking, Long Throws, Penalty Taking)
- Read the player name from the header area at the top of the profile
- Read positions from the "Positions" section (e.g. "WB/M/AM (R)" means Wing-Back, Midfielder, Attacking Midfielder Right)
- Read height, personality, reputation from the "Info" panel if visible
- Read preferred foot information if visible (e.g. Left Foot: Weak, Right Foot: Very Strong)

DOUBLE-CHECK each number carefully. Common mistakes to avoid:
- Do not confuse 6 and 8, or 1 and 7
- Do not skip attributes — there are exactly 14 Technical (including 4 Set Pieces), 14 Mental, and 8 Physical attributes
- If an attribute value is partially obscured by a highlight color, look carefully at the number — it is still readable

Return ONLY valid JSON with this exact structure (omit any fields you cannot find):
{
  "playerName": "string",
  "age": number,
  "nationality": "string",
  "currentClub": "string",
  "positions": ["string"],
  "height": "string (e.g. 6'0)",
  "personality": "string",
  "reputation": "string (e.g. Regional, National, Continental)",
  "preferredFoot": "string (e.g. Right, Left, Either)",
  "technicalAttributes": {
    "crossing": number,
    "dribbling": number,
    "finishing": number,
    "firstTouch": number,
    "heading": number,
    "longShots": number,
    "marking": number,
    "passing": number,
    "tackling": number,
    "technique": number,
    "corners": number,
    "freeKickTaking": number,
    "longThrows": number,
    "penaltyTaking": number
  },
  "mentalAttributes": {
    "aggression": number,
    "anticipation": number,
    "bravery": number,
    "composure": number,
    "concentration": number,
    "decisions": number,
    "determination": number,
    "flair": number,
    "leadership": number,
    "offTheBall": number,
    "positioning": number,
    "teamwork": number,
    "vision": number,
    "workRate": number
  },
  "physicalAttributes": {
    "acceleration": number,
    "agility": number,
    "balance": number,
    "jumpingReach": number,
    "naturalFitness": number,
    "pace": number,
    "stamina": number,
    "strength": number
  }
}

All attribute values MUST be integers between 1 and 20. Return ONLY the JSON, no markdown fences or explanation.`;

const SQUAD_EXTRACTION_PROMPT = `You are analyzing a Football Manager squad list screenshot. Extract ALL players visible and return them as JSON.

Return ONLY valid JSON with this exact structure:
{
  "clubName": "string",
  "players": [
    {
      "playerName": "Full name of player",
      "position": "Position abbreviation as shown (e.g. GK, D (C), D (LC), DM, M (C), AM (RLC), ST (C))",
      "transferValue": "Value range as shown (e.g. £2.9M - £8.6M)",
      "age": number,
      "ability": "Star rating or description if visible",
      "potential": "Star rating or description if visible",
      "playingTime": "Role description (e.g. Star Player, Regular Starter, Squad Player, Backup, etc.)",
      "nationality": "Country code (e.g. ENG, FRA, BRA)",
      "wage": "Wage as shown (e.g. £24K - £35K)",
      "contractExpiry": "Date in YYYY-MM-DD format if visible",
      "status": ["Any status flags like Loa, Inj, Sus"]
    }
  ]
}

Extract EVERY player row visible in the screenshot. Return ONLY the JSON, no markdown fences or explanation.`;

/**
 * Convert a File/Blob to a base64 string (without the data URL prefix).
 */
function toBase64Raw(source) {
  return new Promise((resolve, reject) => {
    if (typeof source === "string") {
      // Strip data URL prefix if present
      const base64 = source.replace(/^data:image\/[^;]+;base64,/, "");
      resolve(base64);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.replace(/^data:image\/[^;]+;base64,/, "");
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(source);
  });
}

/**
 * Get the media type of a file.
 */
function getMediaType(source) {
  if (source instanceof File) {
    const type = source.type;
    if (type === "image/png") return "image/png";
    if (type === "image/webp") return "image/webp";
    if (type === "image/gif") return "image/gif";
    return "image/jpeg";
  }
  return "image/png";
}

/**
 * Extract player attributes from an FM screenshot using Claude Vision.
 *
 * @param {File|Blob|string} source - Image file, blob, or data URL
 * @param {object} [options]
 * @param {function(number): void} [options.onProgress] - Progress callback (0-100)
 * @param {function(string): void} [options.onStatus] - Status message callback
 * @returns {Promise<{text: string, visionData: object|null}>}
 */
export async function extractText(source, options = {}) {
  const { onProgress, onStatus, prompt: customPrompt } = options;

  if (!ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured. Set VITE_ANTHROPIC_API_KEY in .env");
  }

  // Rate limiting disabled — monitor usage via Anthropic dashboard

  if (onStatus) onStatus("Analyzing screenshot with AI...");
  if (onProgress) onProgress(10);

  const base64 = await toBase64Raw(source);
  const mediaType = getMediaType(source);

  // Check cache
  const imageHash = hashImage(base64);
  const cached = getCachedResult(imageHash);
  if (cached) {
    if (onProgress) onProgress(100);
    if (onStatus) onStatus("Loaded from cache!");
    return cached;
  }

  if (onProgress) onProgress(20);

  const response = await fetch(ANTHROPIC_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: base64,
              },
            },
            {
              type: "text",
              text: customPrompt || EXTRACTION_PROMPT,
            },
          ],
        },
      ],
    }),
  });

  if (onProgress) onProgress(80);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error ${response.status}: ${errorText}`);
  }

  const result = await response.json();
  const content = result.content?.[0]?.text || "";

  if (onProgress) onProgress(100);
  if (onStatus) onStatus("Done!");

  // Parse the JSON response
  let visionData = null;
  try {
    // Strip any markdown fences if present
    const cleaned = content.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
    visionData = JSON.parse(cleaned);
  } catch {
    console.warn("Failed to parse Claude Vision response as JSON:", content);
  }

  const scanResult = { text: content, overlay: null, visionData };

  // Cache result and count usage
  setCachedResult(imageHash, scanResult);
  incrementUsage();

  return scanResult;
}

/**
 * Check if AI Vision is available.
 */
export function isOCRAvailable() {
  return !!ANTHROPIC_API_KEY;
}

/**
 * Get remaining free scans for today.
 */
export { getRemainingScans, SQUAD_EXTRACTION_PROMPT };
