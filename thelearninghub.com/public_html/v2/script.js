// ==========================================================================
// SECTION 1: LOGIC LAYER — Algorithm Generators
// ==========================================================================

/**
 * Creates one immutable visual frame snapshot.
 * Pure function — no side effects.
 */
function mkFrame(arr, clrs, comp, sw, log, animMeta) {
    return {
        values:      [...arr],
        colors:      [...clrs],
        comparisons: comp,
        swaps:       sw,
        log:         log,
        animMeta:    animMeta || null
    };
}

// --------------------------------------------------------------------------
// Bubble Sort Generator
// --------------------------------------------------------------------------
function* bubbleSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    let comp = 0, sw = 0;

    yield mkFrame(arr, clrs, comp, sw, {
        opName: 'Start',
        details: `Bubble Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})`
    });

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            clrs[j] = 'bar-comparing';
            clrs[j + 1] = 'bar-comparing';
            yield mkFrame(arr, clrs, comp, sw, {
                opName: 'Compare',
                details: `Index [${j}] (${arr[j]}) with Index [${j + 1}] (${arr[j + 1]})`
            });
            comp++;

            if (isDesc ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                clrs[j] = 'bar-swapping';
                clrs[j + 1] = 'bar-swapping';
                sw++;
                yield mkFrame(arr, clrs, comp, sw, {
                    opName: 'Swap',
                    details: `Index [${j}] and Index [${j + 1}]`
                }, { animType: 'swap', swapIndices: [j, j + 1] });
                swapped = true;
            }

            clrs[j] = 'bar-default';
            clrs[j + 1] = 'bar-default';
        }
        clrs[n - i - 1] = 'bar-sorted';
        if (!swapped) {
            for (let k = 0; k < n - i - 1; k++) clrs[k] = 'bar-sorted';
            break;
        }
    }
    clrs[0] = 'bar-sorted';
    yield mkFrame(arr, clrs, comp, sw, {
        opName: 'Complete',
        details: 'Bubble Sort finished successfully.'
    });
}

// --------------------------------------------------------------------------
// Selection Sort Generator
// --------------------------------------------------------------------------
function* selectionSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    let comp = 0, sw = 0;

    yield mkFrame(arr, clrs, comp, sw, {
        opName: 'Start',
        details: `Selection Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})`
    });

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        clrs[i] = 'bar-swapping';
        yield mkFrame(arr, clrs, comp, sw, {
            opName: 'Pass',
            details: `Iteration ${i}, assumed target at [${i}] (value: ${arr[i]})`
        });

        for (let j = i + 1; j < n; j++) {
            clrs[j] = 'bar-comparing';
            yield mkFrame(arr, clrs, comp, sw, null);
            comp++;

            if (isDesc ? arr[j] > arr[minIdx] : arr[j] < arr[minIdx]) {
                if (minIdx !== i) clrs[minIdx] = 'bar-default';
                minIdx = j;
                clrs[minIdx] = 'bar-swapping';
                yield mkFrame(arr, clrs, comp, sw, {
                    opName: 'New Target',
                    details: `Found at index [${j}] (value: ${arr[j]})`
                });
            } else {
                clrs[j] = 'bar-default';
            }
        }

        if (minIdx !== i) {
            [arr[minIdx], arr[i]] = [arr[i], arr[minIdx]];
            sw++;
            yield mkFrame(arr, clrs, comp, sw, {
                opName: 'Swap',
                details: `Starting element [${i}] with target element [${minIdx}]`
            }, { animType: 'swap', swapIndices: [i, minIdx] });
        }
        clrs[minIdx] = 'bar-default';
        clrs[i] = 'bar-sorted';
    }
    clrs[n - 1] = 'bar-sorted';
    yield mkFrame(arr, clrs, comp, sw, {
        opName: 'Complete',
        details: 'Selection Sort finished successfully.'
    });
}

// --------------------------------------------------------------------------
// Insertion Sort Generator
// --------------------------------------------------------------------------
function* insertionSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    let comp = 0, sw = 0;

    yield mkFrame(arr, clrs, comp, sw, {
        opName: 'Start',
        details: `Insertion Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})`
    });
    clrs[0] = 'bar-sorted';

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        clrs[i] = 'bar-swapping';
        yield mkFrame(arr, clrs, comp, sw, {
            opName: 'Select',
            details: `Index [${i}] (value: ${key}) to insert into sorted sub-array`
        });

        while (j >= 0) {
            clrs[j] = 'bar-comparing';
            yield mkFrame(arr, clrs, comp, sw, null);
            comp++;

            if (isDesc ? arr[j] < key : arr[j] > key) {
                arr[j + 1] = arr[j];
                sw++;
                clrs[j + 1] = 'bar-swapping';
                yield mkFrame(arr, clrs, comp, sw, {
                    opName: 'Shift',
                    details: `Moving index [${j}] (value: ${arr[j]}) to [${j + 1}]`
                });
                clrs[j + 1] = 'bar-sorted';
                j--;
            } else {
                clrs[j] = 'bar-sorted';
                break;
            }
        }

        arr[j + 1] = key;
        clrs[j + 1] = 'bar-sorted';
        for (let k = 0; k <= i; k++) clrs[k] = 'bar-sorted';
        yield mkFrame(arr, clrs, comp, sw, {
            opName: 'Insert',
            details: `Key (${key}) placed at index [${j + 1}]`
        });
    }
    yield mkFrame(arr, clrs, comp, sw, {
        opName: 'Complete',
        details: 'Insertion Sort finished successfully.'
    });
}

// --------------------------------------------------------------------------
// Merge Sort Generators
// --------------------------------------------------------------------------
function* _mergeStepGen(arr, l, m, r, clrs, stats, isDesc, totalLen) {
    const L = arr.slice(l, m + 1);
    const Rv = arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Merge Phase',
        details: `Subarrays Left [${l}-${m}] & Right [${m + 1}-${r}]`
    });

    while (i < L.length && j < Rv.length) {
        clrs[l + i] = 'bar-comparing';
        clrs[m + 1 + j] = 'bar-comparing';
        yield mkFrame(arr, clrs, stats.comp, stats.sw, null);
        stats.comp++;

        const takeLeft = isDesc ? L[i] >= Rv[j] : L[i] <= Rv[j];
        if (takeLeft) { arr[k] = L[i]; i++; } else { arr[k] = Rv[j]; j++; }
        stats.sw++;
        clrs[k] = 'bar-swapping';
        yield mkFrame(arr, clrs, stats.comp, stats.sw, {
            opName: 'Write',
            details: `Value ${arr[k]} into index [${k}]`
        });
        clrs[k] = (r - l === totalLen - 1) ? 'bar-sorted' : 'bar-default';
        if (l + i < totalLen) clrs[l + i] = 'bar-default';
        if (m + 1 + j < totalLen) clrs[m + 1 + j] = 'bar-default';
        k++;
    }

    while (i < L.length) {
        arr[k] = L[i];
        clrs[k] = 'bar-swapping';
        stats.sw++;
        yield mkFrame(arr, clrs, stats.comp, stats.sw, {
            opName: 'Copy',
            details: `Remaining Left element ${arr[k]} to [${k}]`
        });
        clrs[k] = (r - l === totalLen - 1) ? 'bar-sorted' : 'bar-default';
        i++; k++;
    }

    while (j < Rv.length) {
        arr[k] = Rv[j];
        clrs[k] = 'bar-swapping';
        stats.sw++;
        yield mkFrame(arr, clrs, stats.comp, stats.sw, {
            opName: 'Copy',
            details: `Remaining Right element ${arr[k]} to [${k}]`
        });
        clrs[k] = (r - l === totalLen - 1) ? 'bar-sorted' : 'bar-default';
        j++; k++;
    }
}

function* _mergeHelperGen(arr, l, r, clrs, stats, isDesc, totalLen) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    yield* _mergeHelperGen(arr, l, m, clrs, stats, isDesc, totalLen);
    yield* _mergeHelperGen(arr, m + 1, r, clrs, stats, isDesc, totalLen);
    yield* _mergeStepGen(arr, l, m, r, clrs, stats, isDesc, totalLen);
}

function* mergeSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    const stats = { comp: 0, sw: 0 };

    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Start',
        details: `Merge Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})`
    });
    yield* _mergeHelperGen(arr, 0, n - 1, clrs, stats, isDesc, n);
    for (let i = 0; i < n; i++) clrs[i] = 'bar-sorted';
    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Complete',
        details: 'Merge Sort finished successfully.'
    });
}

// --------------------------------------------------------------------------
// Quick Sort Generators
// --------------------------------------------------------------------------
function* _quickPartitionGen(arr, low, high, clrs, stats, isDesc) {
    const pivot = arr[high];
    clrs[high] = 'bar-pivot';
    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Partition',
        details: `Array [${low}-${high}], Pivot at [${high}] (value: ${pivot})`
    });

    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        clrs[j] = 'bar-comparing';
        yield mkFrame(arr, clrs, stats.comp, stats.sw, null);
        stats.comp++;

        if (isDesc ? arr[j] > pivot : arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            clrs[i] = 'bar-swapping';
            clrs[j] = 'bar-swapping';
            stats.sw++;
            yield mkFrame(arr, clrs, stats.comp, stats.sw, {
                opName: 'Swap',
                details: `Value ${arr[j]} ${isDesc ? '>' : '<'} pivot. Swapping [${i}] & [${j}]`
            }, { animType: 'swap', swapIndices: [i, j] });
            clrs[i] = 'bar-default';
        }
        clrs[j] = 'bar-default';
    }

    const pivotFinalIdx = i + 1;
    [arr[pivotFinalIdx], arr[high]] = [arr[high], arr[pivotFinalIdx]];
    clrs[pivotFinalIdx] = 'bar-sorted';
    clrs[high] = 'bar-default';
    stats.sw++;
    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Place Pivot',
        details: `Pivot (${pivot}) moved to correct position [${pivotFinalIdx}]`
    }, { animType: 'swap', swapIndices: [pivotFinalIdx, high] });
    return pivotFinalIdx;
}

function* _quickHelperGen(arr, low, high, clrs, stats, isDesc) {
    if (low < high) {
        const pi = yield* _quickPartitionGen(arr, low, high, clrs, stats, isDesc);
        yield* _quickHelperGen(arr, low, pi - 1, clrs, stats, isDesc);
        yield* _quickHelperGen(arr, pi + 1, high, clrs, stats, isDesc);
    } else if (low >= 0 && low < arr.length) {
        clrs[low] = 'bar-sorted';
    }
}

function* quickSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    const stats = { comp: 0, sw: 0 };

    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Start',
        details: `Quick Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})`
    });
    yield* _quickHelperGen(arr, 0, n - 1, clrs, stats, isDesc);
    for (let i = 0; i < arr.length; i++) clrs[i] = 'bar-sorted';
    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Complete',
        details: 'Quick Sort finished successfully.'
    });
}

// --------------------------------------------------------------------------
// Main Dispatcher
// --------------------------------------------------------------------------
function* sortGenerator(algo, arr, isDesc) {
    const copy = [...arr];
    switch (algo) {
        case 'bubble': yield* bubbleSortGen(copy, isDesc); break;
        case 'selection': yield* selectionSortGen(copy, isDesc); break;
        case 'insertion': yield* insertionSortGen(copy, isDesc); break;
        case 'merge': yield* mergeSortGen(copy, isDesc); break;
        case 'quick': yield* quickSortGen(copy, isDesc); break;
    }
}


// ==========================================================================
// SECTION 2: ANIMATION ENGINE
// ==========================================================================

let array = [];      // source of truth: current bar values
let frames = [];      // pre-collected frame snapshots (drained from generator)
let frameIndex = 0;       // current render position within frames[]
let animState = 'idle';  // 'idle' | 'playing' | 'paused' | 'done'
let delay = 1000;    // ms between auto-play ticks
let playTimer = null;    // setTimeout handle

/**
 * Drains the generator for the given algo/array/order into a frames array.
 * Frame 0 is a "Ready" state (before any algorithm operation).
 * frames.runTimeMs stores the measured generator-drain time.
 */
function collectFrames(algo, sourceArray, isDesc) {
    const result = [];

    // Frame 0: initial state — all bars default color, zero stats
    result.push({
        values: [...sourceArray],
        colors: new Array(sourceArray.length).fill('bar-default'),
        comparisons: 0,
        swaps: 0,
        log: {
            opName: 'Ready',
            details: `Array of size ${sourceArray.length} loaded. Press Start or use ‹ › to step.`
        }
    });

    const gen = sortGenerator(algo, sourceArray, isDesc);
    const t0 = performance.now();
    for (const frame of gen) result.push(frame);
    result.runTimeMs = Math.round((performance.now() - t0) * 100) / 100;

    return result;
}

// ==========================================================================
// SECTION 2a: ANIMATION HELPERS (Phase 2)
// ==========================================================================

/**
 * Returns a Promise that resolves on the element's next transitionend event.
 * Falls back to resolving after timeoutMs if transitionend never fires
 * (e.g. dx === 0, element hidden, browser skips transition).
 */
function waitForTransition(el, timeoutMs) {
    return new Promise(resolve => {
        const fallback = setTimeout(resolve, timeoutMs);
        el.addEventListener('transitionend', () => {
            clearTimeout(fallback);
            resolve();
        }, { once: true });
    });
}

/** Clamps a CSS transition duration so it never exceeds the frame delay or is too short. */
function clampDur(ms) {
    return Math.max(80, Math.min(ms, 500));
}

/**
 * Slides bars at idxA and idxB across each other on the X-axis, then snaps
 * them back to their correct DOM positions with the final frame state applied.
 */
async function animateSwap(idxA, idxB, frame) {
    const barA = ui.bars[idxA].bar;
    const barB = ui.bars[idxB].bar;
    const rectA = barA.getBoundingClientRect();
    const rectB = barB.getBoundingClientRect();
    const dx  = rectB.left - rectA.left;
    const dur = clampDur(delay * 0.6);

    barA.style.transition = `transform ${dur}ms ease`;
    barB.style.transition = `transform ${dur}ms ease`;
    barA.style.transform  = `translateX(${dx}px)`;
    barB.style.transform  = `translateX(${-dx}px)`;

    await waitForTransition(barA, dur + 50);

    // Snap: disable all transitions momentarily so height/colour snap is instant
    barA.style.transition = 'none';
    barB.style.transition = 'none';
    barA.style.transform  = '';
    barB.style.transform  = '';
    ui.setBarHeight(idxA, frame.values[idxA]);
    ui.setBarHeight(idxB, frame.values[idxB]);
    ui.setBarColor(idxA,  frame.colors[idxA]);
    ui.setBarColor(idxB,  frame.colors[idxB]);
    // Force reflow so the snap is committed before transitions are re-enabled
    barA.offsetHeight; // eslint-disable-line no-unused-expressions
    barA.style.transition = '';
    barB.style.transition = '';
}

/** Applies the frame at idx to DOM bars, stats and log. */
async function renderFrame(idx) {
    const frame = frames[idx];
    if (!frame) return;

    if (frame.animMeta?.animType === 'swap') {
        const [idxA, idxB] = frame.animMeta.swapIndices;
        // Run the sliding animation; it applies final heights/colours for idxA & idxB
        await animateSwap(idxA, idxB, frame);
        // Apply remaining bars (those not involved in the swap)
        for (let i = 0; i < ui.bars.length; i++) {
            if (i === idxA || i === idxB) continue;
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i,  frame.colors[i]);
        }
    } else {
        for (let i = 0; i < ui.bars.length; i++) {
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i,  frame.colors[i]);
        }
    }

    ui.updateStats(frame.comparisons, frame.swaps);

    // Replay log from frame 0 → idx so backward navigation works correctly
    ui.clearLog();
    for (let i = 0; i <= idx; i++) {
        if (frames[i].log) ui.appendLogEntry(frames[i].log.opName, frames[i].log.details);
    }

    frameIndex = idx;
}

/** Single source of truth for button enabled/label state. */
function updateButtonStates() {
    const atStart = frameIndex === 0;
    const atEnd = frameIndex === frames.length - 1;

    if (animState === 'playing') {
        ui.sortBtn.innerText = 'Pause';
        ui.sortBtn.disabled = false;
        ui.prevBtn.disabled = true;
        ui.nextBtn.disabled = true;
    } else if (animState === 'done') {
        ui.sortBtn.innerText = 'Start';
        ui.sortBtn.disabled = false;
        ui.prevBtn.disabled = atStart;
        ui.nextBtn.disabled = true;  // already at last frame
    } else {
        // idle or paused
        ui.sortBtn.innerText = animState === 'paused' ? 'Resume' : 'Start';
        ui.sortBtn.disabled = false;
        ui.prevBtn.disabled = atStart;
        ui.nextBtn.disabled = atEnd;
    }
}

function playAuto() {
    animState = 'playing';
    updateButtonStates();

    async function tick() {
        if (animState !== 'playing') return;
        const next = frameIndex + 1;
        if (next >= frames.length) {
            animState = 'done';
            updateButtonStates();
            return;
        }
        await renderFrame(next);
        // Re-check state after async animation (user may have paused during swap)
        if (animState !== 'playing') return;
        if (next === frames.length - 1) {
            animState = 'done';
            updateButtonStates();
        } else {
            playTimer = setTimeout(tick, delay);
        }
    }

    playTimer = setTimeout(tick, delay);
}

function pauseAuto() {
    clearTimeout(playTimer);
    animState = 'paused';
    updateButtonStates();
}

function togglePlay() {
    if (animState === 'playing') {
        pauseAuto();
    } else if (animState === 'paused') {
        playAuto();
    } else {
        // idle or done — if done, restart from frame 0 first
        if (animState === 'done') renderFrame(0);
        playAuto();
    }
}

function updateDelay() {
    const speed = parseInt(ui.speedSlider.value);
    ui.speedLabel.innerText = speed;
    delay = speed === 100 ? 2 : 1000 / Math.pow(speed, 1.2);
}

/** Re-collects frames for same array with new algo/order. Resets to frame 0. */
function reCollectFrames() {
    clearTimeout(playTimer);
    animState = 'idle';
    const algo = ui.algorithmSelect.value;
    const isDesc = ui.orderSelect.value === 'desc';
    frames = collectFrames(algo, array, isDesc);
    ui.statsRuntime.innerText = frames.runTimeMs;
    frameIndex = 0;
    renderFrame(0);
    updateButtonStates();
}

/** Generates a fresh random array, rebuilds DOM bars, re-collects frames. */
function generateArray() {
    clearTimeout(playTimer);
    animState = 'idle';

    const size = parseInt(ui.sizeSlider.value);
    ui.sizeLabel.innerText = size;

    array = [];
    ui.buildBars(size);

    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 96) + 5;
        array.push(value);
        ui.setBarHeight(i, value);
        ui.setBarColor(i, 'bar-default');
    }

    reCollectFrames();
}


// ==========================================================================
// SECTION 3: UI LAYER
// ==========================================================================

const ui = {

    // ---- DOM References ----
    container: document.getElementById('array-container'),
    sizeSlider: document.getElementById('size-slider'),
    speedSlider: document.getElementById('speed-slider'),
    algorithmSelect: document.getElementById('algorithm-select'),
    orderSelect: document.getElementById('order-select'),
    generateBtn: document.getElementById('generate-btn'),
    sortBtn: document.getElementById('sort-btn'),
    prevBtn: document.getElementById('prev-btn'),
    nextBtn: document.getElementById('next-btn'),
    sizeLabel: document.getElementById('size-label'),
    speedLabel: document.getElementById('speed-label'),
    statsComp: document.getElementById('stats-comparisons'),
    statsSwaps: document.getElementById('stats-swaps'),
    statsRuntime: document.getElementById('stats-runtime'),
    logContainer: document.getElementById('operation-log-container'),
    legend: document.getElementById('legend'),

    // Metric modal
    metricModalBackdrop: document.getElementById('metric-modal-backdrop'),
    metricModalBox: document.getElementById('metric-modal-box'),
    metricModalTitle: document.getElementById('metric-modal-title'),
    metricModalBody: document.getElementById('metric-modal-body'),
    metricModalClose: document.getElementById('metric-modal-close'),

    // ---- Bar State ----
    bars: [],   // array of { bar: HTMLElement, valSpan: HTMLElement }

    // ---- Bar DOM Methods ----
    buildBars(size) {
        this.container.innerHTML = '';
        this.bars = [];
        for (let i = 0; i < size; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'bar-wrapper';

            const bar = document.createElement('div');
            bar.className = 'array-bar bar-default';
            bar.style.height = '0%';

            const valSpan = document.createElement('span');
            valSpan.className = 'bar-value';
            bar.appendChild(valSpan);

            const idxSpan = document.createElement('span');
            idxSpan.className = 'bar-index';
            idxSpan.innerText = i;

            wrapper.appendChild(bar);
            wrapper.appendChild(idxSpan);
            this.container.appendChild(wrapper);
            this.bars.push({ bar, valSpan });
        }
    },

    setBarHeight(i, value) {
        if (!this.bars[i]) return;
        this.bars[i].bar.style.height = `${value}%`;
        this.bars[i].valSpan.innerText = value;
    },

    setBarColor(i, colorClass) {
        if (!this.bars[i]) return;
        this.bars[i].bar.className = `array-bar ${colorClass}`;
    },

    // ---- Stats ----
    updateStats(comp, sw) {
        this.statsComp.innerText = comp;
        this.statsSwaps.innerText = sw;
    },

    // ---- Log ----
    clearLog() {
        this.logContainer.innerHTML = '';
    },

    appendLogEntry(opName, details) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="log-highlight">${opName}:</span> ${details}`;
        this.logContainer.appendChild(entry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    },

    // ---- Legend ----
    algoLegendKeys: {
        bubble: ['unsorted', 'comparing', 'swapping', 'sorted'],
        selection: ['unsorted', 'comparing', 'swapping', 'sorted'],
        insertion: ['unsorted', 'comparing', 'swapping', 'sorted'],
        merge: ['unsorted', 'comparing', 'swapping', 'sorted'],
        quick: ['unsorted', 'comparing', 'swapping', 'pivot', 'sorted'],
    },

    updateLegend(algo) {
        const active = new Set(this.algoLegendKeys[algo] || []);
        this.legend.querySelectorAll('.legend-item').forEach(item => {
            item.classList.toggle('hidden', !active.has(item.dataset.legend));
        });
    },

    // ---- Metric Info Modal ----
    metricInfoData: {
        comparisons: {
            title: 'Comparisons',
            body: 'The total number of times the algorithm compared two elements side-by-side to determine their order. A higher count reflects more work done. This maps directly to the algorithm\'s time complexity - Bubble Sort repeats many redundant comparisons, while Merge Sort is disciplined and consistent across all inputs.'
        },
        swaps: {
            title: 'Writes / Swaps',
            body: 'The total number of times an element was moved, shifted, or exchanged in the array. Selection Sort minimises writes (at most n-1 swaps total) making it ideal when write cost is high. Insertion Sort shifts elements rather than full swaps. Write count reflects how much the algorithm disturbs the array.'
        },
        runtime: {
            title: 'Run Time (ms)',
            body: 'The actual wall-clock time in milliseconds taken to drain the sort generator and pre-collect all frames. This excludes visual rendering and playback delay — it reflects raw algorithmic performance of this sort in your browser\'s JS runtime.'
        }
    },

    openMetricModal(key) {
        const d = this.metricInfoData[key];
        if (!d) return;
        this.metricModalTitle.innerText = d.title;
        this.metricModalBody.innerText = d.body;
        this.metricModalBackdrop.classList.remove('hidden');
        this.metricModalBox.classList.remove('hidden');
    },

    closeMetricModal() {
        this.metricModalBackdrop.classList.add('hidden');
        this.metricModalBox.classList.add('hidden');
    },

    // ---- Event Binding ----
    bindEvents() {
        this.generateBtn.addEventListener('click', generateArray);

        this.sizeSlider.addEventListener('input', () => {
            this.sizeLabel.innerText = this.sizeSlider.value;
            if (animState !== 'playing') generateArray();
        });

        this.speedSlider.addEventListener('input', updateDelay);

        this.algorithmSelect.addEventListener('change', () => {
            this.updateLegend(this.algorithmSelect.value);
            if (animState !== 'playing') generateArray();
        });

        this.orderSelect.addEventListener('change', () => {
            if (animState !== 'playing') reCollectFrames();
        });

        this.sortBtn.addEventListener('click', togglePlay);

        this.prevBtn.addEventListener('click', async () => {
            if (frameIndex > 0) {
                await renderFrame(frameIndex - 1);
                updateButtonStates();
            }
        });

        this.nextBtn.addEventListener('click', async () => {
            if (frameIndex < frames.length - 1) {
                await renderFrame(frameIndex + 1);
                updateButtonStates();
            }
        });

        // Metric info modal
        document.querySelectorAll('.info-icon').forEach(icon => {
            icon.addEventListener('click', () => this.openMetricModal(icon.dataset.infoKey));
        });
        this.metricModalClose.addEventListener('click', () => this.closeMetricModal());
        this.metricModalBackdrop.addEventListener('click', () => this.closeMetricModal());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && !this.metricModalBackdrop.classList.contains('hidden')) {
                this.closeMetricModal();
            }
        });
    }
};


// ==========================================================================
// SECTION 4: INIT
// ==========================================================================

function init() {
    ui.bindEvents();
    updateDelay();
    ui.updateLegend(ui.algorithmSelect.value);
    generateArray();
}

window.onload = init;
