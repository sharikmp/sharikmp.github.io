# SortVisualizer

A browser-based sorting algorithm visualizer built with vanilla HTML, CSS, and JavaScript. No frameworks, no dependencies - just open the file and it works.

---

## What it does

SortVisualizer lets you watch sorting algorithms run step by step on a bar chart. Each bar represents a number, and its height represents its value. As the algorithm runs, bars change color to show what's happening at that exact moment - which elements are being compared, which ones are being swapped, and which ones are already in their final sorted position.

It also tracks comparisons, writes/swaps, and actual JavaScript execution time so you can see how different algorithms behave on the same data.

---

## Algorithms included

- Bubble Sort
- Selection Sort
- Insertion Sort
- Merge Sort
- Quick Sort

---

## Getting started

There's no build step or server required. Just open `index.html` in any modern browser (Chrome, Firefox, Edge, Safari) and you're ready to go.

If you want to serve it locally - for example, through VS Code's Live Server extension - that works fine too, but it isn't necessary.

---

## How to use it

**Generating an array**

When the page loads, it automatically generates a random array. You can generate a new one at any time by clicking "New Array". The Size slider controls how many elements are in the array.

**Choosing an algorithm**

Use the algorithm dropdown to pick which sort you want to visualize. Switching the algorithm automatically recalculates everything for the current array - you don't need to regenerate.

**Sort order**

You can sort either ascending or descending using the order dropdown.

**Running the visualization**

Click "Start" to begin playing the animation. Click it again to pause. While paused, you can use the left and right arrow buttons on either side of the canvas to step through frames one at a time, forward or backward. This is useful when you want to study a specific moment in the algorithm closely.

Click "Resume" to continue playing from where you left off.

**Speed**

The Speed slider goes from 1 (slow) to 5 (near-instant). Use a slow speed to understand what's happening at each step, and crank it up when you just want to see the end result quickly.

---

## Reading the visualization

**Bar colors**

- Grey - unsorted, not currently being touched
- Red - elements being compared right now
- Orange - elements being written or swapped
- Green - element is in its final sorted position
- Purple - the pivot element (Quick Sort only)

**Merge Sort depth layers**

Merge Sort is the most visually complex one. When it divides the array, bars physically drop down into depth layers below the main canvas. Each layer represents a recursive level. When merging happens, bars fly back up to their correct positions. Numbered labels on the left mark each depth level so you can follow along.

**Insertion Sort lift**

During Insertion Sort, the element being inserted gets lifted above the bar chart as a visual indicator that it's "in hand" and looking for its correct slot.

---

## Metrics panel

The three cards on the right of the controls show:

- Comparisons - how many times two elements were compared so far
- Writes / Swaps - how many times an element was moved or written
- Run Time (ms) - how long JavaScript took to pre-compute all frames (not the animation time)

Each metric has a small "i" button that opens a modal with a plain-English explanation of what it means.

---

## Complexity Curve

The chart in the bottom-right shows how the number of operations scales with array size for the current algorithm. The gold line is an average profile computed in the background across several array sizes. The red dot is your current array - its position relative to the curve shows whether your particular array happened to be a best-case or worst-case scenario for that algorithm.

Hover over any point on the curve to see exact values.

---

## Project structure

```
SortVisualizer/
  index.html   - markup only, no inline styles or scripts
  style.css    - all visual styling and theme variables
  script.js    - all algorithm logic, animation engine, and UI code
  README.md    - this file
```

---

## Notes

- Merge Sort on mobile is capped at a smaller array size (5-10 elements) because the depth-map layout needs horizontal space to render clearly.
- On desktop, Merge Sort supports up to 16 elements.
- All other algorithms support up to 100 elements.
