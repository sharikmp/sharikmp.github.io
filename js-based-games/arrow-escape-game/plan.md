# Bus Escape — Feature Implementation Plan

## Global Config Constants (top of <script>)
| Constant              | Default | Notes                                    |
|-----------------------|---------|------------------------------------------|
| STAGES_PER_LEVEL      | 3       | Stages in each level                     |
| STAGE_BUS_INCREMENT   | 5       | Extra buses added per stage              |
| LEADERBOARD_SIZE      | 10      | Max scores stored per level              |

## Level Definitions (LEVELS array)
| Level  | ID     | Time | Grid  | Base Buses | Stage 1 | Stage 2 | Stage 3 |
|--------|--------|------|-------|-----------|---------|---------|---------|
| Easy   | easy   | 30s  | 10×10 | 50        | 50      | 55      | 60      |
| Medium | medium | 45s  | 13×13 | 100       | 100     | 105     | 110     |
| Hard   | hard   | 60s  | 15×15 | 150       | 150     | 155     | 160     |
| Pro    | pro    | 60s  | 17×17 | 200       | 200     | 205     | 210     |

Stage N bus count = `level.buses + N * STAGE_BUS_INCREMENT` (N is 0-based)

## UI Flow
Start → Level Select (4 cards) → Stage 1 → [win] → Stage 2 → [win] → Stage 3 → [win] → Level Complete + Leaderboard
                                           → [lose] → Result Screen (animated stats) → Retry / Menu

## Result Screen Stats (animated)
- Buses Cleared:    X  (count-up from 0)
- Buses Remaining:  Y  (count-up from 0)
- % Cleared:        Z% (count-up from 0)
- Optional video placeholder: #result-video div (hidden by default, add <iframe> src to activate)

## CSS Theme
- Background: #000 (pure black)
- Grid: gap:0, no cell background/border (no grid lines)
- UI overlays: rgba(0,0,0,0.97)

## Header Format
`[Level Name]  ·  Stage N/3  ·  ⏱ XX.Xs`

## Leaderboard
- Per-level localStorage keys: busEscapeLB_easy, busEscapeLB_medium, busEscapeLB_hard, busEscapeLB_pro
- Max LEADERBOARD_SIZE entries each

## Implementation Scope
- Single file: bus.html
- No external JS/CSS dependencies
- All numbers adjustable via constants only

## Key Functions

| Function                         | Purpose                                           |
|----------------------------------|---------------------------------------------------|
| `buildLevelCards()`              | Renders 4 level-select cards from `LEVELS`        |
| `startGame(levelIndex)`          | Sets `currentLevel`, resets stage to 0            |
| `startStage()`                   | Computes bus count, generates puzzle, starts timer |
| `generateSolvablePuzzle(c,r,n)`  | Fills grid with `n` solvable buses                |
| `handleTap(x,y,wrapper,bus)`     | Releases a bus if path is clear                   |
| `handleStageWin()`               | Stops timer, shows result modal (win)             |
| `handleLose()`                   | Stops timer, shows result modal (lose)            |
| `showResultModal(isWin, isLast)` | Builds result UI + fires animated counters        |
| `animateCounter(el,from,to,dur)` | RAF-based ease-out counter animation              |
| `animatePctRing(pct)`            | Animates SVG arc via `strokeDashoffset`           |
| `submitScore()`                  | Saves to per-level leaderboard                    |
| `showLeaderboardModal()`         | Shows leaderboard with level tabs                 |

## Video Slot (Result Screen)

`#result-video` div is hidden by default.  
To activate: remove `hidden` class and set `src` on the inner `<iframe>`:

```html
<div id="result-video">
  <iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen height="180"></iframe>
</div>
```

## Future Ideas

- Sound effects on bus release / time-up
- Difficulty scaling within Pro (more stages)
- Combo multiplier for consecutive fast taps
- All numbers adjustable via constants only