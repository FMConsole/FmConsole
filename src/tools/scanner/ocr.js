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

const EXTRACTION_PROMPT = `You are analyzing a Football Manager player screenshot. Extract ALL player attributes you can see and return them as JSON.

Return ONLY valid JSON with this exact structure (omit any fields you can't find):
{
  "playerName": "string",
  "age": number,
  "nationality": "string",
  "currentClub": "string",
  "positions": ["string"],
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

All attribute values should be integers between 1 and 20. Return ONLY the JSON, no markdown fences or explanation.`;

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
  const { onProgress, onStatus } = options;

  if (!ANTHROPIC_API_KEY) {
    throw new Error("Anthropic API key not configured. Set VITE_ANTHROPIC_API_KEY in .env");
  }

  // Check rate limit
  if (isRateLimited()) {
    throw new Error(`Daily scan limit reached (${DAILY_SCAN_LIMIT}/day). Resets at midnight.`);
  }

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
              text: EXTRACTION_PROMPT,
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
export { getRemainingScans };
