# Animation Enhancements — Sort Visualizer v2

## Overview

Five incremental phases to evolve the visualizer from colour-only state changes to
fully physical, movement-based animations. Each phase is independently testable and
builds directly on the architecture already in place (generator frames → `renderFrame`
→ DOM bars).

**Core principle**: every phase adds `animType` metadata to generator frames and
makes `renderFrame` progressively more animation-aware. The step-through (‹ ›) mode
always falls back to instant frame application so it is never broken by animation
changes.

---

## Phase 1 — CSS Keyframe Animations ✅ IMPLEMENTED
> Pure CSS, zero JS changes. `style.css` only.

### What was implemented

| Bar State | CSS Animation | Detail |
|-----------|---------------|--------|
| `bar-comparing` | `bar-pulse` | Bar scales to 1.06× and back over 0.3 s |
| `bar-swapping` | `bar-flash` | Brightness burst to 1.7× then settles, 0.25 s |
| `bar-sorted` | `bar-sorted-lock` | Scale-up + brightness ripple then snap, 0.4 s |
| `bar-pivot` | `bar-glow-pulse` | Continuous drop-shadow throb while class is present |
| `.array-bar` | transition | Extended to include `transform 0.15s ease` + `will-change: transform` |

### Testing Checklist
- [ ] Bubble Sort @ speed 20 — comparing bars visibly pulse red
- [ ] Quick Sort — pivot bar throbs purple continuously while active
- [ ] Step through with ‹ › — animation fires on each step
- [ ] Sorted bars show green lock-in ripple one by one

---

## Phase 2 — Horizontal Swap Slide (`translateX`)
> Bubble, Selection, Quick Sort swaps physically cross paths along the X-axis.

### Architecture changes

#### 1. Generator frames — add `animMeta`
`mkFrame` gains optional 6th `animMeta` param. Swap frames get:
```js
animMeta: { animType: 'swap', swapIndices: [i, j] }
```
Generators to update: `bubbleSortGen`, `selectionSortGen`, `_quickPartitionGen`.

#### 2. `renderFrame` → async
```js
async function renderFrame(idx) {
    const frame = frames[idx];
    if (frame.animMeta?.animType === 'swap') {
        await animateSwap(frame.animMeta.swapIndices[0], frame.animMeta.swapIndices[1]);
    }
    // ... apply heights, colours, stats, log as before
}
```

#### 3. New helpers
```js
function waitForTransition(el) {
    return new Promise(resolve =>
        el.addEventListener('transitionend', resolve, { once: true })
    );
}

async function animateSwap(idxA, idxB) {
    const rectA = ui.bars[idxA].bar.getBoundingClientRect();
    const rectB = ui.bars[idxB].bar.getBoundingClientRect();
    const dx    = rectB.left - rectA.left;
    const dur   = clampDur(delay * 0.6);
    ui.bars[idxA].bar.style.transition = `transform ${dur}ms ease`;
    ui.bars[idxB].bar.style.transition = `transform ${dur}ms ease`;
    ui.bars[idxA].bar.style.transform  = `translateX(${dx}px)`;
    ui.bars[idxB].bar.style.transform  = `translateX(${-dx}px)`;
    await waitForTransition(ui.bars[idxA].bar);
    ui.bars[idxA].bar.style.transition = '';
    ui.bars[idxB].bar.style.transition = '';
    ui.bars[idxA].bar.style.transform  = '';
    ui.bars[idxB].bar.style.transform  = '';
}

function clampDur(ms) { return Math.max(80, Math.min(ms, 500)); }
```

#### 4. `playAuto` tick → async
```js
async function tick() {
    if (animState !== 'playing') return;
    const next = frameIndex + 1;
    if (next >= frames.length) { animState = 'done'; updateButtonStates(); return; }
    await renderFrame(next);
    if (next === frames.length - 1) { animState = 'done'; updateButtonStates(); }
    else { playTimer = setTimeout(tick, delay); }
}
```

#### 5. Step-through buttons
‹ › call `renderFrame` directly — they will also animate. If instant-only stepping
is preferred for step mode, replace with a separate `applyFrameInstant(idx)` that
skips `animateSwap`.

### Files changed
- `script.js` — `mkFrame`, swap-yielding generators, `renderFrame`, new helpers, `playAuto` tick
- `style.css` — confirm `.array-bar` has `will-change: transform` (already added in Phase 1)

### Testing Checklist
- [ ] Bubble Sort @ speed 30 — adjacent bars visually cross the X-axis
- [ ] Selection Sort — long-distance swap bars fly across the array
- [ ] Quick Sort swap with pivot — bars cross paths cleanly
- [ ] Step through one swap frame with › — crossing animation fires once
- [ ] Pause mid-sort → Resume — no broken transform state

---

## Phase 3 — Insertion Sort: Lift → Shift → Drop
> Depends on Phase 2 (async `renderFrame` already in place).

### Architecture changes

#### 1. New `animType` values in `insertionSortGen`

| Frame | `animType` | `animMeta` fields |
|-------|------------|-------------------|
| Key selected | `'lift'` | `keyIndex: i` |
| Each shift step | `'shift'` | `shiftIndex: j`, `direction: 'right'` |
| Key inserted | `'drop'` | `keyIndex`, `targetIndex: j+1` |

#### 2. Three animation functions

**`animateLift(keyIdx)`**
- `translateY(-60px) scale(1.05)` on `ui.bars[keyIdx].bar`, 200 ms
- Adds `.bar-lifted` class (gold border + shadow) while in flight

**`animateShift(shiftIdx)`**
- Bars from sorted boundary to key's original position shift right by `(barWidth + gap)px`
- `Promise.all(transitionPromises)` awaits all bars simultaneously

**`animateDrop(keyIdx, targetIdx)`**
- Compound transition: move to target X + `translateY(0)` in 200 ms
- On `transitionend`: snap all transforms to zero, apply final heights/colours

#### 3. New CSS
```css
.bar-lifted {
    box-shadow: 0 8px 24px rgba(201, 162, 39, 0.5);
    border: 2px solid var(--accent-color);
    z-index: 20;
}
@keyframes drop-settle {
    0%   { transform: translateY(0) scale(1.05); }
    60%  { transform: translateY(4px) scale(0.98); }
    100% { transform: translateY(0) scale(1); }
}
```

### Files changed
- `script.js` — `insertionSortGen` gains new animTypes; 3 new animation functions; `renderFrame` dispatch
- `style.css` — `.bar-lifted`, `@keyframes drop-settle`

### Testing Checklist
- [ ] Insertion Sort @ speed 20, 15 bars — key bar noticeably lifts upward
- [ ] Sorted bars shift right simultaneously, visible gap appears
- [ ] Key bar drops cleanly into the gap
- [ ] Run @ speed 80 — timing still clean (transitions clamped to ≥80 ms)
- [ ] Step through — lift, shift, drop each play on individual ‹ ›

---

## Phase 4 — Selection Sort Scanner + Quick Sort Pointer Arrows
> Parallel with Phase 3 — no shared dependency.

### A. Selection Sort — Scanner Sweep

**New DOM element** inside `.canvas-container`:
```html
<div id="scanner-line"></div>
```
```css
#scanner-line {
    position: absolute;
    top: 0; bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, transparent, var(--accent-gold), transparent);
    pointer-events: none;
    display: none;
    transition: left 0.12s linear;
    z-index: 5;
}
```

**New `animType: 'scan'`** frames in `selectionSortGen` inner scan loop:
```js
animMeta: { animType: 'scan', scanToIdx: j }
```

**`animateScanner(toIdx)`** — moves `#scanner-line` `left` value to bar's X position.

**`.bar-pinned`** applied when `opName === 'New Target'`:
```css
.bar-pinned {
    box-shadow: 0 0 0 3px var(--accent-color);
    transform: scaleY(1.04);
}
```

### B. Quick Sort — `i` and `j` Pointer Arrows

**New DOM elements** inside `.canvas-container`:
```html
<div id="ptr-i" class="sort-pointer">i</div>
<div id="ptr-j" class="sort-pointer">j</div>
```
```css
.sort-pointer {
    position: absolute;
    bottom: -32px;
    font-size: 0.65rem;
    color: var(--accent-gold);
    font-family: var(--font-mono);
    transition: left 0.1s ease;
    display: none;
    pointer-events: none;
}
```

**New `animType: 'pointer'`** frames in `_quickPartitionGen`:
```js
animMeta: { animType: 'pointer', ptrI: i, ptrJ: j }
```

**`animatePointers(ptrI, ptrJ)`** — moves `#ptr-i` and `#ptr-j` to bar X positions.

### C. Quick Sort — Pivot Isolate

`.bar-pivot-isolated` applied on partition start frame:
```css
.bar-pivot-isolated {
    transform: translateY(-20px);
    z-index: 15;
}
```
Removed on `opName === 'Place Pivot'`.

### Files changed
- `index.html` — `#scanner-line`, `#ptr-i`, `#ptr-j` inside `.canvas-container`
- `style.css` — scanner, pointer, `.bar-pinned`, `.bar-pivot-isolated` styles
- `script.js` — `selectionSortGen` + `_quickPartitionGen` emit new animTypes; new overlay helpers; `generateArray` hides overlays on reset

### Testing Checklist
- [ ] Selection Sort — scanner sweeps across unsorted region each pass
- [ ] Selection Sort — pinned minimum has gold border glow
- [ ] Quick Sort — i/j arrows visible below bars; squeeze inward during partition
- [ ] Pivot bar jumps up on partition start, snaps back when placed
- [ ] Switch to Bubble Sort — scanner and pointer overlays are hidden
- [ ] Size slider change — overlays reposition correctly on next `generateArray`

---

## Phase 5 — Merge Sort: Split / Auxiliary Array / Merge Up
> Depends on Phase 1 (sorted-lock animation) + Phase 2 (async engine).

### Architecture changes

#### 1. DOM — Auxiliary Row
```html
<div class="canvas-container">
    <div id="array-container"></div>
    <div id="aux-container"></div>   <!-- hidden except during Merge Sort -->
</div>
```
```css
#aux-container {
    height: 30vh;
    min-height: 200px;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding-bottom: 20px;
    width: max-content;
    min-width: 100%;
    justify-content: center;
    margin: 0 auto;
    visibility: hidden;
    margin-top: 8px;
    border-top: 1px dashed var(--border-color);
}
```
`ui.buildBars` extended to also build `ui.auxBars[]` in `#aux-container`.

#### 2. New frame fields for Merge Sort

| Field | Type | Purpose |
|-------|------|---------|
| `auxValues` | `number[]` | Auxiliary bar heights |
| `auxColors` | `string[]` | Auxiliary bar colour classes |
| `splitGroups` | `[number, number][]` | Current `[start, end]` sub-array boundaries for gap rendering |
| `animType` | string | `'divide'` \| `'copy-to-aux'` \| `'merge-up'` |
| `animMeta` | object | Indices and positions for animated bars |

#### 3. Four animation functions

**`animateDivide(groups)`**
- Adds CSS `margin-right` gap (0 → 12 px) between last bar of each group and the next
- CSS transition 200 ms

**`animateCopyToAux(srcIndices)`**
- `#aux-container` made visible
- Bars at `srcIndices` animate `translateY(auxRowOffset)` to fly down
- Main row bars faded (`opacity: 0`); aux row bars shown at correct heights

**`animateMergeUp(auxIdx, mainIdx)`**
- Single aux bar flies up: compound `translateY(-offset) translateX(dx)` in 250 ms
- Main row bar fades in at final height as aux fades out

**`animateSplitCollapse()`**
- Removes all gap margins
- Fires Phase 1 `bar-sorted-lock` staggered across all bars (20 ms apart)

#### 4. Generator changes
`mergeSortGen`, `_mergeHelperGen`, `_mergeStepGen` gain `splitGroups` accumulator.
Each recursive split emits a `'divide'` frame; each temp-copy step emits
`'copy-to-aux'`; each merge position emits `'merge-up'`.

### Files changed
- `index.html` — `#aux-container`
- `style.css` — `#aux-container`, `.bar-in-aux`, gap utilities, `@keyframes merge-up`
- `script.js` — `buildBars` builds aux row; all merge generators emit new frames; 4 new animation helpers; `renderFrame` dispatch; `generateArray` resets aux visibility

### Testing Checklist
- [ ] Merge Sort @ speed 15 — array visibly cracks into halves then quarters
- [ ] Temp L/R bars fly down into auxiliary row beneath main array
- [ ] Bars fly back up one-by-one into correct sorted positions
- [ ] On completion, gaps close and sorted wave fires (Phase 1 `bar-sorted-lock`)
- [ ] Switch to any other algorithm — aux container hidden, main array normal
- [ ] Step-through: each ‹ › step shows correct split/aux state instantly

---

## Implementation Order & Dependencies

```
Phase 1 (CSS only)  ← DONE ✅
    └── Phase 2 (async renderFrame + swap slide)
            ├── Phase 3 (lift/shift/drop — Insertion Sort)
            ├── Phase 4 (overlays — Selection + Quick Sort)
            └── Phase 5 (aux row — Merge Sort)
                    also needs Phase 1 sorted-lock animation
```

Phases 3 and 4 can be worked in parallel after Phase 2 is stable and tested.

---

## Shared Utilities (add once in Phase 2)

| Helper | Purpose |
|--------|---------|
| `waitForTransition(el)` | `Promise` resolving on `transitionend` |
| `waitForAnimation(el)` | `Promise` resolving on `animationend` |
| `getBarMidX(idx)` | Bar centre X in viewport px via `getBoundingClientRect` |
| `getBarTopY(idx)` | Bar top Y in viewport px |
| `clampDur(ms)` | `Math.max(80, Math.min(ms, 500))` — keeps transitions proportional to playback speed |

### Key design decisions
- **Step-through (‹ ›)**: plays animations in Phase 2+. If instant-only is preferred, add `applyFrameInstant(idx)` that bypasses `animateSwap` etc.
- **`clampDur`**: at high speed (`delay < 100 ms`), CSS transitions auto-shorten so they complete before the next frame fires.
- **No external libraries**: all CSS transitions + `@keyframes` + native Promises.
- **Out of scope**: audio, mobile touch events, dark/light theme toggle, learn module.
