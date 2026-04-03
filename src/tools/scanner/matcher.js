/**
 * Stats Scanner — Fuzzy Player Name Matching
 *
 * Pure functions for matching OCR-extracted player names against a roster.
 * No external dependencies.
 */

/**
 * Normalize a string for comparison: lowercase, strip special chars, collapse whitespace.
 */
export function normalize(s) {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * Bigram similarity score between two strings (Dice coefficient). Returns 0–1.
 */
export function similarity(a, b) {
  a = normalize(a);
  b = normalize(b);
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const bigrams = (s) => {
    const bg = new Set();
    for (let i = 0; i < s.length - 1; i++) bg.add(s.slice(i, i + 2));
    return bg;
  };
  const aB = bigrams(a), bB = bigrams(b);
  let inter = 0;
  for (const bg of aB) if (bB.has(bg)) inter++;
  return (2 * inter) / (aB.size + bB.size);
}

/**
 * Score how well an OCR-extracted name matches a known player name.
 * Handles initials ("J. Smith"), surname-only, and substring matches.
 * Returns 0–1.
 */
export function playerMatchScore(ocrName, playerName) {
  const sim = similarity(ocrName, playerName);
  const na = normalize(ocrName), nb = normalize(playerName);
  if (na === nb) return 1;
  if (na.includes(nb) || nb.includes(na)) return Math.max(sim, 0.85);
  const aParts = na.split(" "), bParts = nb.split(" ");
  const aSurname = aParts[aParts.length - 1], bSurname = bParts[bParts.length - 1];
  if (aSurname.length > 2 && aSurname === bSurname) return Math.max(sim, 0.8);
  if (aParts.length >= 2 && bParts.length >= 2) {
    if (aParts[0].length <= 2 && bParts[0].startsWith(aParts[0].replace(".", "")) && aSurname === bSurname)
      return Math.max(sim, 0.85);
    if (bParts[0].length <= 2 && aParts[0].startsWith(bParts[0].replace(".", "")) && aSurname === bSurname)
      return Math.max(sim, 0.85);
  }
  return sim;
}

/**
 * Find the best matching player from a roster for a given name string.
 *
 * @param {string} text - OCR-extracted player name
 * @param {Array<{id, name, pos?}>} roster - Squad/roster to match against
 * @param {number} [threshold=0.45] - Minimum score to consider a match
 * @returns {{ player: object, score: number } | null}
 */
export function bestPlayerMatch(text, roster, threshold = 0.45) {
  let best = null, bestScore = 0;
  for (const p of roster) {
    const score = playerMatchScore(text, p.name);
    if (score > bestScore) { bestScore = score; best = p; }
  }
  return bestScore >= threshold ? { player: best, score: bestScore } : null;
}

/**
 * Match all parsed stat rows against a roster.
 *
 * @param {Array<{nameText: string}>} rows - Parsed stat rows from parser
 * @param {Array<{id, name, pos?}>} roster - Squad to match against
 * @returns {Array} rows with .match and .matched fields attached
 */
export function matchAll(rows, roster) {
  return rows.map(row => {
    const match = bestPlayerMatch(row.nameText, roster);
    return {
      ...row,
      match,
      matched: !!match,
    };
  });
}
