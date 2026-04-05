# Transfer Analysis — Design Spec
**Date:** 2026-04-05
**Status:** Approved

---

## Overview

Transfer Analysis is a signing decision tool that helps FM managers answer: **"Is this transfer worth making?"**

The manager scans two players — their current squad player and a transfer target — enters financial and contract details for both, and receives a structured verdict covering quality, cost, age value, and likelihood to play.

---

## User Flow

1. **Scan current player** — upload screenshot via existing Vision AI scanner
2. **Select position** — auto-populated from `parsed.details.positions[0]`, user can change via dropdown
3. **Set squad role** — Starter / Backup / Rotation / Squad Depth
4. **Enter current player financials** — weekly wage, contract length remaining
5. **Scan transfer target** — upload screenshot
6. **Select position** — same auto-populate + dropdown pattern
7. **Set target squad role** — where would this player fit?
8. **Enter target financials** — asking fee (optional — 0 for free transfers), weekly wage, contract length offered
9. **View Transfer Analysis** — comparison + verdict

The Analyse button is disabled until both players are scanned and all required fields (wage, contract years) are filled. Fee defaults to 0 if left blank.

If a user wants to re-scan either player, a **Replace** button on each scan panel clears that side and returns it to the upload state without affecting the other side.

---

## Prerequisite: Extract Shared Helpers

Before implementation, extract these two functions from `PlayerAnalyserTool.jsx` into a new shared module `src/data/playerHelpers.js` with named exports:

- `getAgeProfile(age)` — age bracket + physical decline notes
- `rolePhysicalDemand(roleWeights)` — ratio of speed attributes to total weight

Both `PlayerAnalyserTool.jsx` and the new `TransferAnalysisTool.jsx` import from this shared module. No behaviour changes.

---

## Comparison Dimensions

### 1. Role Fit (Quality Gap)

- Auto-detect shared roles by finding roles available for both players' selected positions using `getRolesForPosition(posKey)`
- Run `calcRoleScore` for both players across shared roles, display with `starsDisplay`
- Show top 5 shared roles side by side with star ratings
- Label each role: **Upgrade ↑ / Lateral → / Downgrade ↓** (target vs current)
  - Upgrade: target score > current by ≥0.5
  - Lateral: within 0.5
  - Downgrade: target score < current by ≥0.5
- **No shared roles fallback**: if positions have no overlapping roles (e.g. GK vs ST), show a warning: "These players play different positions — role comparison is not available" and skip the Role Fit dimension in the verdict. Overall verdict still runs on the remaining three dimensions.
- Overall quality label: derived from the top shared role result

### 2. Age & Contract Value

- Show age bracket (from `getAgeProfile`) for both players
- **Total wage commitment** = weekly wage × 52 × contract years
- **Age risk rules:**
  - Bracket `veteran` (32–34) or `declining` (35+) on contract ≥ 3 years → **Risky**
  - Bracket `prime` (28–31) on contract ≥ 4 years → **Risky**
  - Bracket `developing` (≤20) on contract ≥ 2 years → **Good Value** (development upside)
  - Everything else → **Acceptable**
- Physical decline warning for high-demand roles reuses `rolePhysicalDemand` threshold >0.35

### 3. Cost Analysis

**Fee sub-verdict** (based on target's annual wage as a comparator):
- Annual wage = weekly wage × 52
- Fee ≤ 1× annual wage → **Affordable**
- Fee 1–3× annual wage → **Stretched**
- Fee >3× annual wage → **Overpriced**
- Fee = 0 (free transfer) → **Free Transfer** (always green)

**Wage delta** — display target wage minus current player wage:
- Same or lower → cost-neutral or saving
- Higher → show the weekly and annual increase

**Total commitment** = fee + (target wage × 52 × contract years)

### 4. Likelihood to Play

Squad role tags and expected minutes (FM 38-game season, simplified):

| Tag | Expected Games |
|-----|---------------|
| Starter | 30+ |
| Backup | 20–29 |
| Rotation | 10–19 |
| Squad Depth | <10 |

No overlap. Cross-reference with quality gap:
- Target is **Downgrade** but tagged **Starter** → warning: "Signing a weaker player into a starting role"
- Target is **Upgrade** but tagged **Backup/Rotation** → flag: "Risk of player unrest — upgrade quality deserves starter minutes"
- Target is **Lateral/Upgrade** and squad role matches expected usage → **Right Role**
- Mismatched cases → **Mismatched**

---

## Verdict System

Each dimension produces a sub-verdict with an explicit colour score:

| Dimension | Green (+1) | Amber (0) | Red (-1) | Excluded |
|-----------|-----------|-----------|----------|----------|
| Role Fit | Upgrade | Lateral | Downgrade | N/A (different positions — excluded from score, not counted as 0) |
| Age Value | Good Value | Acceptable | Risky | — |
| Cost | Free Transfer / Affordable | Stretched | Overpriced | — |
| Squad Fit | Right Role | Mismatched | — | — |

**Overall verdict** scoring (sum of included dimensions only):
- Score ≥ 2 → **Sign Him**
- Score 0–1 → **Proceed with Caution**
- Score ≤ -1 → **Avoid**

If Role Fit is excluded (N/A), the max possible score is 3 and thresholds shift: ≥ 2 → Sign Him, 0–1 → Caution, ≤ -1 → Avoid (same thresholds, fewer dimensions).

---

## Data Model

```js
// Stored in localStorage: fmc_transfer_analyses (max 10, oldest dropped first)
{
  id: timestamp,
  createdAt: ISOString,
  currentPlayer: {
    parsed: { attributes, details },   // from Vision AI scanner
    selectedPosition: 'ST',            // posKey, user-confirmed
    squadRole: 'starter' | 'backup' | 'rotation' | 'depth',
    wage: Number,        // weekly £
    contractYears: Number
  },
  transferTarget: {
    parsed: { attributes, details },
    selectedPosition: 'ST',
    squadRole: 'starter' | 'backup' | 'rotation' | 'depth',
    fee: Number,         // asking price, 0 = free transfer
    wage: Number,        // weekly £
    contractYears: Number
  }
}
```

Currency is not formatted — stored and displayed as raw numbers. Users enter values in whatever currency their FM save uses. No conversion.

---

## Architecture

### New File
- `src/tools/TransferAnalysisTool.jsx` — main tool, self-contained

### New Shared File (prerequisite)
- `src/data/playerHelpers.js` — exports `getAgeProfile`, `rolePhysicalDemand`

### Reused
- Vision AI scanner + OCR pipeline (`src/tools/scanner/`)
- `calcRoleScore`, `getRolesForPosition`, `getTopRolesForPosition`, `starsDisplay`, `scoreToStars` from `src/data/roleWeights.js`
- Attribute flatten utilities

### New Components (within TransferAnalysisTool.jsx, all state lifted to parent)
- `PlayerScanPanel` — scan + position select + squad role + financials entry for one side
- `ComparisonPanel` — side-by-side role scores, attributes, financials
- `VerdictPanel` — sub-verdicts + overall sign/caution/avoid verdict

All state lives in `TransferAnalysisTool` and is passed down as props (consistent with PlayerComparisonTool pattern).

### Routing & Tools Hub
- New route: `/tools/transfer-analysis`
- **Replaces** the existing "Transfer Tracker" Coming Soon card in the Tools hub — update its `href` to `/tools/transfer-analysis`, label to **Transfer Analysis**, and remove the Coming Soon badge
- Nav label: **Transfer Analysis**

### Storage
- `localStorage` key: `fmc_transfer_analyses`
- Max 10 saved analyses (oldest dropped when limit exceeded)
- Session list shown below the tool for loading previous analyses

### Export
- CSV export: both players side by side, all attributes, role scores for top 5 shared roles, financials, sub-verdicts, overall verdict
- Filename: `fmc-transfer-[target-name]-[date].csv`

---

## UI Layout

```
[Transfer Analysis]

┌─────────────────────┬─────────────────────┐
│   YOUR PLAYER       │   TRANSFER TARGET   │
│  [Scan / Loaded]    │  [Scan / Loaded]    │
│  Position: [ST ▾]   │  Position: [ST ▾]   │
│  Squad Role: [▾]    │  Squad Role: [▾]    │
│  Wage: [___/wk]     │  Fee: [___ (0=free)]│
│  Contract: [_ yrs]  │  Wage: [___/wk]     │
│  [Replace]          │  Contract: [_ yrs]  │
│                     │  [Replace]          │
└─────────────────────┴─────────────────────┘

[ANALYSE ▶]  (disabled until both scanned + fields filled)

┌─────────────────────────────────────────────┐
│  ROLE FIT           ★★★★☆  vs  ★★★☆☆       │
│  Poacher            ↑ Upgrade               │
│  Target Forward     → Lateral               │
├─────────────────────────────────────────────┤
│  AGE & VALUE        24 Peak  vs  31 Prime   │
│  Contract Cost      £2.4M    vs  £8.2M      │
│  Age Risk                        ⚠ Prime    │
├─────────────────────────────────────────────┤
│  COST               +£15k/wk wage increase  │
│                     £3M fee (Affordable)    │
│  Total Commitment   £11.2M over 3 years     │
├─────────────────────────────────────────────┤
│  SQUAD FIT          Backup → Starter        │
│                     ✓ Upgrade justifies role│
└─────────────────────────────────────────────┘

         ┌─────────────────────┐
         │  ⚠ PROCEED WITH     │
         │    CAUTION          │
         └─────────────────────┘

[Export CSV]   [Save Analysis]
```

---

## Out of Scope (v1)
- Real transfer market data / valuations
- Integration with Squad Builder roster
- Multi-target shortlist comparison (more than 2 players)
- Wage budget tracking across multiple signings
- Currency conversion or formatting
