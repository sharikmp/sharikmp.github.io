# Plan: Glyph Rush — Symbol Cipher Word Game

## Game Name
**Coder Breaker** — folder: `js-games/coder-breaker/`

## TL;DR
A session-persistent substitution cipher game. A random symbol→letter map is generated once per session (26 animal emojis → A–Z). Players decode hidden words by tapping symbols from a persistent reference panel and placing them into letter slots. They can guess the full word anytime via 4 multiple-choice options. Scoring rewards early guessing. Pure tap interaction, no drag-and-drop.

---

## Files
- `index.html` — single source of truth layout + audio tags
- `style.css` — all visual styling, animations, responsive layout
- `script.js` — all game logic (constants, state, UI, scoring)
- `correct.mp3` — reuse from traffic-jam or inline beep
- `incorrect.mp3` — reuse from traffic-jam or inline beep

---

## Symbol Set (26 Animals — consistent cross-platform emojis)
🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵🐔🐧🦆🦉🦇🐝🦋🐌🐢🐬🦀

Each maps to A–Z — shuffled fresh each session.

---

## Screens & UI Flow

```
Start Screen → Mode Select → Sprint Config → Game Play → Result → (Leaderboard)
```

### 1. Start Screen
- Game title + subtitle
- "PLAY" button → Mode Select
- "LEADERBOARD" button

### 2. Mode Select (4 cards)
| Mode   | Word Length   | Word Timer | Questions |
|--------|---------------|------------|-----------|
| Easy   | 4–6 letters   | 10s fixed  | 5         |
| Medium | 5–8 letters   | 12s fixed  | 5         |
| Hard   | 8–10 letters  | 15s fixed  | 5         |
| Pro    | 10–12 letters | 20s fixed  | 5         |

> Max word length is **12 letters** across all modes. Sprint is always **5 words** — no config step needed.

### 4. Game Play Screen Layout (top to bottom)
```
[Header: Mode · Word N/5 · ⏱ word timer]
[Cipher Reference Panel — compact 4-column grid, 26 entries, always visible]
[Word Timer Bar — animated progress bar, colored orange→red as it depletes]
[Letter Slots — always 12 boxes wide; active word's length filled, rest faded/disabled]
[Hint Text — word meaning, italic, faded, appears when ≥50% slots filled]
[4 Multiple Choice Buttons — A | B | C | D]
```

> **Slot sizing rule:** The slots container spans the full playfield width. It is always divided into **12 equal columns** (`width / 12` each). Only the slots for the current word's letters are active; extra slots are visually dimmed/hidden. This keeps layout stable across all word lengths.

### 5. Result Screen
- Score breakdown (words solved, avg efficiency, total time)
- Animated count-up stats
- "PLAY AGAIN" / "MENU" / "LEADERBOARD"

---

## Core Mechanics

### Cipher Map Generation (once per session)
```
generateCipherMap() → shuffles 26 animal symbols, maps symbol[i] → ALPHA[i]
Stored in: cipherMap = { symbol: letter } and reverseCipher = { letter: symbol }
```

### Word Bank (embedded in script.js)
- ~200 words per difficulty tier, all uppercase
- Categorized by word length: WORDS_EASY, WORDS_MEDIUM, WORDS_HARD, WORDS_PRO
- Track used words per session to prevent repeats

### Tap-Select + Tap-Place (NOT drag-and-drop)
1. Player taps a symbol in the cipher reference panel → it becomes "selected" (highlighted ring)
2. Player taps an empty letter slot → symbol is placed; slot reveals if correct letter for that position
   - Correct: slot glows green, letter revealed, symbol in slot
   - Wrong: slot flashes red briefly, symbol returns to unselected state (NO point penalty)
3. Tapping another symbol while one is selected: swaps selection
4. Tapping a filled slot: clears it back to empty

### Word Timers
- Master clock: 120s, counts down globally
- Word timer: `wordTimeLimit = 8 + word.length` seconds
- Word timer bar: CSS width transition from 100%→0%
- Timer expiry: word skipped, 0 pts, next word loaded

### Scoring Per Word (max 100 pts)
```
revealed = number of slots correctly filled when multiple-choice is tapped
total = word.length
efficiency = (total - revealed) / total   // 0.0 to 1.0
baseScore = 100
wordScore = Math.round(baseScore * efficiency)
```
- Wrong multiple-choice guess: -20 pts (flowing "-20" animation), buttons locked 1.5s
- Word skipped (timer): 0 pts
- No per-drop penalty

### 50% Hint
- When `revealed / total >= 0.5`: show word definition in italic below slots
- Word definitions embedded inline (curated for Easy/Medium; optional for Hard/Pro)

### Multiple Choice Generation
- 1 correct option
- 3 distractors: same length ± 1, from same difficulty pool, never repeated in session

---

## Key Functions (script.js)

| Function | Purpose |
|---|---|
| `generateCipherMap()` | Shuffle animals → A-Z, store cipherMap + reverseCipher |
| `buildReferencePanel()` | Render 26 symbol→letter pairs in compact grid |
| `startSprint(mode, qty)` | Init master timer, pick word list, call `loadWord()` |
| `loadWord()` | Pick next word, compute slots, start word timer, build slot UI |
| `handleSymbolTap(symbol)` | Toggle selection state on reference panel item |
| `handleSlotTap(index)` | Place selected symbol into slot; validate; reveal or flash |
| `handleGuess(option)` | Validate MC choice; apply score/penalty; call `loadWord()` or end |
| `computeScore(word, revealed)` | Efficiency-based score formula |
| `buildMultipleChoice(word)` | Pick 3 distractors + correct option, shuffle |
| `animateFloatingText(el, text)` | Floating "+N" / "-20" score animation |
| `startWordTimer(seconds)` | RAF-based word timer bar animation |
| `endSprint()` | Stop timers, build result screen, show leaderboard prompt |
| `showLeaderboard()` | Per-mode localStorage scores, max 10 entries |

---

## Scoring State Variables
```js
let cipherMap = {};           // symbol → letter
let reverseCipher = {};       // letter → symbol
let currentMode = null;       // { id, name, minLen, maxLen }
let sprintQty = 5;            // 5 or 10
let wordList = [];            // shuffled words for this sprint
let wordIndex = 0;
let totalScore = 0;
let currentWord = '';
let revealedSlots = [];       // boolean[] per slot
let selectedSymbol = null;    // currently tapped symbol or null
let masterTimerInterval = null;
let wordTimerRAF = null;
let wordTimerStart = 0;
let wordTimerLimit = 0;
```

---

## CSS Highlights
- Dark theme (#0a0a0f background), neon accent (#00e5ff)
- Reference panel: `display:grid; grid-template-columns: repeat(4, 1fr)`; compact cells ~60px
- Selected symbol: pulsing ring animation (keyframe scale 1→1.08→1)
- Slot states: `.empty`, `.filled-correct` (green glow), `.flash-wrong` (red flash, CSS keyframe)
- Word timer bar: CSS transition width + color shift via JS class toggle
- Floating score text: `position:absolute`, `animation: floatUp 0.8s ease-out forwards`
- MC buttons: 4-column grid, lock state `.locked` (opacity 0.4, pointer-events none)

---

## Leaderboard
- localStorage keys: `glyphRushLB_easy`, `glyphRushLB_medium`, `glyphRushLB_hard`, `glyphRushLB_pro`
- Sort by score desc, tie-break by time asc
- Max 10 per mode

---

## Verification Steps
1. Open index.html in browser → Start screen shows correctly
2. Play Easy 5-word: cipher map generates, reference panel shows all 26 pairs
3. Tap a symbol → highlighted; tap a correct slot → reveals letter with green glow
4. Tap wrong symbol into slot → red flash, no score deduction
5. Let word timer expire → 0 pts, next word loads
6. Tap wrong MC option → -20 animation, buttons lock 1.5s
7. Guess word at 0 revealed → score = 100, at all revealed → score ≈ 0
8. At 50% slots filled → word definition appears below slots
9. Complete sprint → result screen shows; leaderboard saves
10. Reload page → same session = new cipher map (cipher is session-only, not persisted)
11. Test on mobile: no drag, pure tap works with touch events

---

## Decisions
- **No drag-and-drop**: tap-select + tap-place only
- **No per-drop penalty**: wrong placement = visual feedback only
- **Animals as symbols**: 26 distinct, universally supported, no fruit theming
- **Session cipher**: map regenerates on page load; not localStorage-persisted
- **Single HTML+CSS+JS**: same pattern as traffic-jam game
- **Word definitions**: embedded for Easy & Medium for the 50% hint; hard/pro show "—" 
- **No external dependencies**: pure vanilla JS, no libraries
