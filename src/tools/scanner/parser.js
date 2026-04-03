/**
 * Stats Scanner — FM26 Season Stats Parser
 *
 * Parses OCR text from Football Manager's squad stats overview screen
 * into structured player stat rows.
 *
 * Handles formats like:
 *   "J. Smith        28    5    3   7.2   -"
 *   "Marcus Johnson  32   12    8   7.80  0"
 *   "T. Williams GK  30    0    0   6.9  14"
 *   "1  Player Name  28  5  3  7.2"
 *   "Player Name     28   5   4.52  3   7.2  0"   (with xG)
 *
 * No external dependencies.
 */

const POS_SET = new Set([
  "GK", "CB", "RB", "LB", "CDM", "CM", "CAM",
  "LW", "RW", "ST", "LM", "RM", "DM", "AM",
  "CF", "SW", "WB", "RWB", "LWB",
  // FM sometimes shows these compound positions
  "DR", "DL", "DC", "MR", "ML", "MC",
  "AMR", "AML", "AMC", "STC",
]);

/**
 * Clean an OCR line: strip junk characters, collapse whitespace.
 */
function cleanLine(line) {
  let c = line;
  // Strip common OCR artifacts
  c = c.replace(/[®©™@#§¶¥£€$&*|\\{}[\]<>~`^]/g, "");
  // Strip ordinals like "1st", "2nd"
  c = c.replace(/\b\d{1,2}(?:st|nd|rd|th)\b/gi, "");
  // Normalize whitespace
  c = c.replace(/\s+/g, " ").trim();
  return c;
}

/**
 * Try to detect if a line is a header row (contains column label words).
 */
function isHeaderLine(line) {
  const lower = line.toLowerCase();
  const headerWords = ["name", "apps", "gls", "goals", "ast", "assists", "avg", "avr",
    "rating", "cs", "clean", "sheets", "player", "pos", "position",
    "appearances", "mins", "minutes", "mom", "motm", "yel", "red"];
  let hits = 0;
  for (const w of headerWords) {
    if (lower.includes(w)) hits++;
  }
  return hits >= 2;
}

/**
 * Find all decimal values in the token list.
 * Returns array of { value, index }.
 */
function findDecimals(tokens) {
  const results = [];
  for (let i = 0; i < tokens.length; i++) {
    const m = tokens[i].match(/^(\d{1,2}\.\d{1,2})$/);
    if (m) results.push({ value: parseFloat(m[1]), index: i });
  }
  return results;
}

/**
 * Extract a decimal rating (like 6.50, 7.2, 10.0) from a list of tokens.
 * Returns { rating, index } or null.
 */
function findRating(tokens) {
  // Scan from right — the rating is typically the rightmost decimal in the 1–10 range
  for (let i = tokens.length - 1; i >= 0; i--) {
    const m = tokens[i].match(/^(\d{1,2}\.\d{1,2})$/);
    if (m) {
      const val = parseFloat(m[1]);
      if (val >= 1.0 && val <= 10.0) return { rating: val, index: i };
    }
  }
  return null;
}

/**
 * Parse OCR text from FM26 season stats screen into structured rows.
 *
 * @param {string} text - Raw OCR text
 * @returns {Array<{ nameText: string, apps: number, goals: number, xg: number, assists: number, avgRating: number, cleanSheets: number, raw: string }>}
 */
export function parseStatsLines(text) {
  const lines = text.split("\n").map(cleanLine).filter(l => l.length > 3);
  const results = [];

  for (const line of lines) {
    // Skip header rows
    if (isHeaderLine(line)) continue;

    const tokens = line.split(/\s+/);
    if (tokens.length < 3) continue; // need at least name + some numbers

    // Find trailing numeric tokens
    // FM stats lines end with a sequence of numbers (apps, gls, ast, rating, cs, etc.)
    // We scan from the right to find the numeric cluster
    let numericStart = tokens.length;
    for (let i = tokens.length - 1; i >= 0; i--) {
      const t = tokens[i];
      // Matches: integers, decimals, "-" (dash for zero/N-A)
      if (/^-?\d+$/.test(t) || /^\d{1,2}\.\d{1,2}$/.test(t) || t === "-" || t === "—" || t === "–") {
        numericStart = i;
      } else {
        break;
      }
    }

    // Need at least 2 trailing numbers to be a stats row
    const numCount = tokens.length - numericStart;
    if (numCount < 2) continue;

    const numTokens = tokens.slice(numericStart);
    const nameTokens = tokens.slice(0, numericStart);

    // Strip leading jersey number or rank from name
    if (nameTokens.length > 1 && /^\d{1,2}\.?$/.test(nameTokens[0])) {
      nameTokens.shift();
    }

    // Strip position token from end of name if present
    let detectedPos = "";
    if (nameTokens.length > 1) {
      const lastNameToken = nameTokens[nameTokens.length - 1].toUpperCase();
      // Check single positions and compound FM positions
      if (POS_SET.has(lastNameToken)) {
        detectedPos = lastNameToken;
        nameTokens.pop();
      }
      // Also check slash-separated positions like "AM/MC"
      else if (/^[A-Z]{1,3}\/[A-Z]{1,3}$/.test(lastNameToken)) {
        detectedPos = lastNameToken;
        nameTokens.pop();
      }
    }

    const nameText = nameTokens.join(" ").trim();
    if (!nameText || nameText.length < 2) continue;

    // Parse the numeric tokens into stats
    // FM26 typical column order: Apps, Gls, Ast, AvR, CS (but can vary)
    // Strategy: find the decimal (rating), then assign surrounding integers
    const nums = numTokens.map(t => {
      if (t === "-" || t === "—" || t === "–") return 0;
      const v = parseFloat(t);
      return isNaN(v) ? 0 : v;
    });

    // Find the rating (decimal value between 1-10) and xG (decimal, typically 0-30)
    let apps = 0, goals = 0, assists = 0, xg = 0, avgRating = 0, cleanSheets = 0;

    const decimals = findDecimals(numTokens);
    const ratingResult = findRating(numTokens);

    if (ratingResult) {
      const ri = ratingResult.index;
      avgRating = ratingResult.rating;

      // Check for xG: another decimal before the rating (not the rating itself)
      const xgCandidate = decimals.find(d => d.index < ri && d.value >= 0 && d.value <= 50);

      // Numbers before the rating (excluding xG if found)
      const beforeRating = nums.slice(0, ri);

      if (xgCandidate) {
        // xG found — integers before xG are Apps, Gls; xG sits between them and rating
        const beforeXg = nums.slice(0, xgCandidate.index);
        xg = xgCandidate.value;
        // After xG but before rating = assists (if present)
        const betweenXgAndRating = nums.slice(xgCandidate.index + 1, ri);

        if (beforeXg.length >= 2) {
          apps = Math.round(beforeXg[0]);
          goals = Math.round(beforeXg[1]);
        } else if (beforeXg.length === 1) {
          apps = Math.round(beforeXg[0]);
        }
        if (betweenXgAndRating.length >= 1) {
          assists = Math.round(betweenXgAndRating[0]);
        }
      } else {
        // No xG — standard: Apps, Gls, Ast before rating
        if (beforeRating.length >= 3) {
          apps = Math.round(beforeRating[0]);
          goals = Math.round(beforeRating[1]);
          assists = Math.round(beforeRating[2]);
        } else if (beforeRating.length === 2) {
          apps = Math.round(beforeRating[0]);
          goals = Math.round(beforeRating[1]);
        } else if (beforeRating.length === 1) {
          apps = Math.round(beforeRating[0]);
        }
      }

      // Numbers after the rating: typically CS, then maybe others
      const afterRating = nums.slice(ri + 1);
      if (afterRating.length >= 1) {
        cleanSheets = Math.round(afterRating[0]);
      }
    } else {
      // No decimal rating found — assign sequentially: Apps, Gls, Ast, CS
      if (nums.length >= 1) apps = Math.round(nums[0]);
      if (nums.length >= 2) goals = Math.round(nums[1]);
      if (nums.length >= 3) assists = Math.round(nums[2]);
      if (nums.length >= 4) cleanSheets = Math.round(nums[3]);
    }

    // Sanity checks — skip rows that don't look like player stats
    if (apps > 200 || goals > 150 || assists > 150) continue;
    if (avgRating > 10 || avgRating < 0) avgRating = 0;
    if (xg > 50 || xg < 0) xg = 0;

    results.push({
      raw: line,
      nameText,
      pos: detectedPos,
      apps,
      goals,
      xg,
      assists,
      avgRating,
      cleanSheets,
    });
  }

  return results;
}
