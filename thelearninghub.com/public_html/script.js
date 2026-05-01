
// ==========================================================================
// JS Logic - Step-Recording Architecture
// ==========================================================================

// --- State Variables ---
let array = [];           // current bar values (source of truth for recordings)
let bars = [];            // DOM bar references
let delay = 1000;         // ms between auto-play ticks

// Step-recording state
let steps = [];           // pre-computed snapshots
let stepIndex = 0;        // current position within steps
let appState = 'idle';    // 'idle' | 'playing' | 'paused' | 'done'
let playTimer = null;     // setTimeout handle for auto-play

// --- DOM Elements ---
const container = document.getElementById('array-container');
const sizeSlider = document.getElementById('size-slider');
const speedSlider = document.getElementById('speed-slider');
const orderSelect = document.getElementById('order-select');
const generateBtn = document.getElementById('generate-btn');
const sortBtn = document.getElementById('sort-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const algorithmSelect = document.getElementById('algorithm-select');
const body = document.documentElement;

// Stats & UI
const statsComp = document.getElementById('stats-comparisons');
const statsSwaps = document.getElementById('stats-swaps');
const statsRuntime = document.getElementById('stats-runtime');
const sizeLabel = document.getElementById('size-label');
const speedLabel = document.getElementById('speed-label');
const logContainer = document.getElementById('operation-log-container');

// ==========================================================================
// Initialization
// ==========================================================================
function init() {
    updateDelay();
    generateArray();
    updateLegend();
}

// ==========================================================================
// Log Helpers
// ==========================================================================
function clearLog() {
    logContainer.innerHTML = '';
}

function appendLogEntry(opName, details) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-highlight">${opName}:</span> ${details}`;
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// ==========================================================================
// Bar Render Helpers (DOM)
// ==========================================================================
function setBarColor(index, colorClass) {
    if (bars[index]) bars[index].bar.className = `array-bar ${colorClass}`;
}

function setBarValue(index, height) {
    if (bars[index]) {
        bars[index].bar.style.height = `${height}%`;
        bars[index].valSpan.innerText = height;
    }
}

function updateStatsUI(comp, sw) {
    statsComp.innerText = comp;
    statsSwaps.innerText = sw;
}

function updateDelay() {
    const speed = parseInt(speedSlider.value);
    speedLabel.innerText = speed;
    delay = speed === 100 ? 2 : 1000 / Math.pow(speed, 1.2);
}

// ==========================================================================
// Array Generation (builds DOM bars + triggers step recording)
// ==========================================================================
function generateArray() {
    // Stop any running auto-play
    clearTimeout(playTimer);
    appState = 'idle';

    const size = parseInt(sizeSlider.value);
    sizeLabel.innerText = size;
    array = [];
    bars = [];
    container.innerHTML = '';

    for (let i = 0; i < size; i++) {
        const value = Math.floor(Math.random() * 96) + 5;
        array.push(value);

        const wrapper = document.createElement('div');
        wrapper.className = 'bar-wrapper';

        const bar = document.createElement('div');
        bar.className = 'array-bar bar-default';
        bar.style.height = `${value}%`;

        const valSpan = document.createElement('span');
        valSpan.className = 'bar-value';
        valSpan.innerText = value;
        bar.appendChild(valSpan);

        const idxSpan = document.createElement('span');
        idxSpan.className = 'bar-index';
        idxSpan.innerText = i;

        wrapper.appendChild(bar);
        wrapper.appendChild(idxSpan);
        container.appendChild(wrapper);

        bars.push({ bar, valSpan });
    }

    reRecordSteps();
}

// ==========================================================================
// Step Recording - pre-computes ALL visual states synchronously
// ==========================================================================

/**
 * Records one visual frame into the steps array.
 * @param {object} R - recorder state { arr, clrs, comp, sw }
 * @param {object|null} log - { opName, details } or null
 * @param {Array} steps - destination array
 */
function snap(R, log, steps) {
    steps.push({
        values: [...R.arr],
        colors: [...R.clrs],
        comparisons: R.comp,
        swaps: R.sw,
        log: log
    });
}

// ---- Bubble Sort Recorder ----
function _recBubble(R, steps, isDesc) {
    const n = R.arr.length;
    snap(R, { opName: 'Start', details: `Bubble Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})` }, steps);
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            // Highlight comparing
            R.clrs[j] = 'bar-comparing';
            R.clrs[j + 1] = 'bar-comparing';
            snap(R, { opName: 'Compare', details: `Index [${j}] (${R.arr[j]}) with Index [${j + 1}] (${R.arr[j + 1]})` }, steps);

            R.comp++;

            if (isDesc ? R.arr[j] < R.arr[j + 1] : R.arr[j] > R.arr[j + 1]) {
                let tmp = R.arr[j]; R.arr[j] = R.arr[j + 1]; R.arr[j + 1] = tmp;
                R.clrs[j] = 'bar-swapping';
                R.clrs[j + 1] = 'bar-swapping';
                R.sw++;
                snap(R, { opName: 'Swap', details: `Index [${j}] and Index [${j + 1}]` }, steps);
                swapped = true;
            }

            R.clrs[j] = 'bar-default';
            R.clrs[j + 1] = 'bar-default';
        }
        R.clrs[n - i - 1] = 'bar-sorted';
        if (!swapped) {
            for (let k = 0; k < n - i - 1; k++) R.clrs[k] = 'bar-sorted';
            break;
        }
    }
    R.clrs[0] = 'bar-sorted';
    snap(R, { opName: 'Complete', details: 'Bubble Sort finished successfully.' }, steps);
}

// ---- Selection Sort Recorder ----
function _recSelection(R, steps, isDesc) {
    const n = R.arr.length;
    snap(R, { opName: 'Start', details: `Selection Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})` }, steps);
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        R.clrs[i] = 'bar-swapping';
        snap(R, { opName: 'Pass', details: `Iteration ${i}, assumed target at [${i}] (value: ${R.arr[i]})` }, steps);
        for (let j = i + 1; j < n; j++) {
            R.clrs[j] = 'bar-comparing';
            snap(R, null, steps);
            R.comp++;
            if (isDesc ? R.arr[j] > R.arr[minIdx] : R.arr[j] < R.arr[minIdx]) {
                if (minIdx !== i) R.clrs[minIdx] = 'bar-default';
                minIdx = j;
                R.clrs[minIdx] = 'bar-swapping';
                snap(R, { opName: 'New Target', details: `Found at index [${j}] (value: ${R.arr[j]})` }, steps);
            } else {
                R.clrs[j] = 'bar-default';
            }
        }
        if (minIdx !== i) {
            let tmp = R.arr[minIdx]; R.arr[minIdx] = R.arr[i]; R.arr[i] = tmp;
            R.sw++;
            snap(R, { opName: 'Swap', details: `Starting element [${i}] with target element [${minIdx}]` }, steps);
        }
        R.clrs[minIdx] = 'bar-default';
        R.clrs[i] = 'bar-sorted';
    }
    R.clrs[n - 1] = 'bar-sorted';
    snap(R, { opName: 'Complete', details: 'Selection Sort finished successfully.' }, steps);
}

// ---- Insertion Sort Recorder ----
function _recInsertion(R, steps, isDesc) {
    const n = R.arr.length;
    snap(R, { opName: 'Start', details: `Insertion Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})` }, steps);
    R.clrs[0] = 'bar-sorted';
    for (let i = 1; i < n; i++) {
        let key = R.arr[i];
        let j = i - 1;
        R.clrs[i] = 'bar-swapping';
        snap(R, { opName: 'Select', details: `Index [${i}] (value: ${key}) to insert into sorted sub-array` }, steps);
        while (j >= 0) {
            R.clrs[j] = 'bar-comparing';
            snap(R, null, steps);
            R.comp++;
            if (isDesc ? R.arr[j] < key : R.arr[j] > key) {
                R.arr[j + 1] = R.arr[j];
                R.sw++;
                R.clrs[j + 1] = 'bar-swapping';
                snap(R, { opName: 'Shift', details: `Moving index [${j}] (value: ${R.arr[j]}) to [${j + 1}]` }, steps);
                R.clrs[j + 1] = 'bar-sorted';
                j--;
            } else {
                R.clrs[j] = 'bar-sorted';
                break;
            }
        }
        R.arr[j + 1] = key;
        R.clrs[j + 1] = 'bar-sorted';
        for (let k = 0; k <= i; k++) R.clrs[k] = 'bar-sorted';
        snap(R, { opName: 'Insert', details: `Key (${key}) placed at index [${j + 1}]` }, steps);
    }
    snap(R, { opName: 'Complete', details: 'Insertion Sort finished successfully.' }, steps);
}

// ---- Merge Sort Recorder ----
function _recMergeStep(R, l, m, r, steps, isDesc, totalLen) {
    const L = R.arr.slice(l, m + 1);
    const Rv = R.arr.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;
    snap(R, { opName: 'Merge Phase', details: `Subarrays Left [${l}-${m}] & Right [${m + 1}-${r}]` }, steps);
    while (i < L.length && j < Rv.length) {
        R.clrs[l + i] = 'bar-comparing';
        R.clrs[m + 1 + j] = 'bar-comparing';
        snap(R, null, steps);
        R.comp++;
        const takeLeft = isDesc ? L[i] >= Rv[j] : L[i] <= Rv[j];
        if (takeLeft) { R.arr[k] = L[i]; i++; } else { R.arr[k] = Rv[j]; j++; }
        R.sw++;
        R.clrs[k] = 'bar-swapping';
        snap(R, { opName: 'Write', details: `Value ${R.arr[k]} into index [${k}]` }, steps);
        R.clrs[k] = (r - l === totalLen - 1) ? 'bar-sorted' : 'bar-default';
        if (l + i < totalLen) R.clrs[l + i] = 'bar-default';
        if (m + 1 + j < totalLen) R.clrs[m + 1 + j] = 'bar-default';
        k++;
    }
    while (i < L.length) {
        R.arr[k] = L[i];
        R.clrs[k] = 'bar-swapping';
        R.sw++;
        snap(R, { opName: 'Copy', details: `Remaining Left element ${R.arr[k]} to [${k}]` }, steps);
        R.clrs[k] = (r - l === totalLen - 1) ? 'bar-sorted' : 'bar-default';
        i++; k++;
    }
    while (j < Rv.length) {
        R.arr[k] = Rv[j];
        R.clrs[k] = 'bar-swapping';
        R.sw++;
        snap(R, { opName: 'Copy', details: `Remaining Right element ${R.arr[k]} to [${k}]` }, steps);
        R.clrs[k] = (r - l === totalLen - 1) ? 'bar-sorted' : 'bar-default';
        j++; k++;
    }
}

function _recMergeHelper(R, l, r, steps, isDesc, totalLen) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);
    _recMergeHelper(R, l, m, steps, isDesc, totalLen);
    _recMergeHelper(R, m + 1, r, steps, isDesc, totalLen);
    _recMergeStep(R, l, m, r, steps, isDesc, totalLen);
}

function _recMerge(R, steps, isDesc) {
    snap(R, { opName: 'Start', details: `Merge Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})` }, steps);
    _recMergeHelper(R, 0, R.arr.length - 1, steps, isDesc, R.arr.length);
    // Mark all sorted at end
    for (let i = 0; i < R.arr.length; i++) R.clrs[i] = 'bar-sorted';
    snap(R, { opName: 'Complete', details: 'Merge Sort finished successfully.' }, steps);
}

// ---- Quick Sort Recorder ----
function _recQuickPartition(R, low, high, steps, isDesc) {
    const pivot = R.arr[high];
    R.clrs[high] = 'bar-pivot';
    snap(R, { opName: 'Partition', details: `Array [${low}-${high}], Pivot at [${high}] (value: ${pivot})` }, steps);
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        R.clrs[j] = 'bar-comparing';
        snap(R, null, steps);
        R.comp++;
        if (isDesc ? R.arr[j] > pivot : R.arr[j] < pivot) {
            i++;
            let tmp = R.arr[i]; R.arr[i] = R.arr[j]; R.arr[j] = tmp;
            R.clrs[i] = 'bar-swapping';
            R.clrs[j] = 'bar-swapping';
            R.sw++;
            snap(R, { opName: 'Swap', details: `Value ${R.arr[j]} ${isDesc ? '>' : '<'} pivot. Swapping [${i}] & [${j}]` }, steps);
            R.clrs[i] = 'bar-default';
        }
        R.clrs[j] = 'bar-default';
    }
    let tmp = R.arr[i + 1]; R.arr[i + 1] = R.arr[high]; R.arr[high] = tmp;
    R.clrs[i + 1] = 'bar-sorted';
    R.clrs[high] = 'bar-default';
    R.sw++;
    snap(R, { opName: 'Place Pivot', details: `Pivot (${pivot}) moved to correct position [${i + 1}]` }, steps);
    return i + 1;
}

function _recQuickHelper(R, low, high, steps, isDesc) {
    if (low < high) {
        const pi = _recQuickPartition(R, low, high, steps, isDesc);
        _recQuickHelper(R, low, pi - 1, steps, isDesc);
        _recQuickHelper(R, pi + 1, high, steps, isDesc);
    } else if (low >= 0 && low < R.arr.length) {
        R.clrs[low] = 'bar-sorted';
    }
}

function _recQuick(R, steps, isDesc) {
    snap(R, { opName: 'Start', details: `Quick Sort Initiated (${isDesc ? 'Descending' : 'Ascending'})` }, steps);
    _recQuickHelper(R, 0, R.arr.length - 1, steps, isDesc);
    for (let i = 0; i < R.arr.length; i++) R.clrs[i] = 'bar-sorted';
    snap(R, { opName: 'Complete', details: 'Quick Sort finished successfully.' }, steps);
}

// ---- Main Recorder Entry Point ----
function recordAlgorithmSteps(algo, sourceArray, isDesc) {
    const R = {
        arr: [...sourceArray],
        clrs: new Array(sourceArray.length).fill('bar-default'),
        comp: 0,
        sw: 0
    };
    const result = [];
    // Snap initial state (step 0, before any operation)
    snap(R, { opName: 'Ready', details: `Array of size ${sourceArray.length} loaded. Press Start or use ‹ › to step.` }, result);
    const _t0 = performance.now();
    switch (algo) {
        case 'bubble': _recBubble(R, result, isDesc); break;
        case 'selection': _recSelection(R, result, isDesc); break;
        case 'insertion': _recInsertion(R, result, isDesc); break;
        case 'merge': _recMerge(R, result, isDesc); break;
        case 'quick': _recQuick(R, result, isDesc); break;
    }
    result.runTimeMs = Math.round((performance.now() - _t0) * 100) / 100;
    return result;
}

// ==========================================================================
// Step Navigation & Rendering
// ==========================================================================

/** Re-computes steps for the current array/algo/order. Resets to step 0. */
function reRecordSteps() {
    const algo = algorithmSelect.value;
    const isDesc = orderSelect.value === 'desc';
    steps = recordAlgorithmSteps(algo, array, isDesc);
    statsRuntime.innerText = steps.runTimeMs;
    stepIndex = 0;
    renderStep(0);
    updateButtonStates();
}

/** Applies snapshot at idx to the DOM and log. */
function renderStep(idx) {
    const step = steps[idx];
    if (!step) return;

    // Apply bar heights & colors
    for (let i = 0; i < bars.length; i++) {
        setBarValue(i, step.values[i]);
        setBarColor(i, step.colors[i]);
    }

    // Update stats
    updateStatsUI(step.comparisons, step.swaps);

    // Update log: replay from scratch (handles backward navigation correctly)
    clearLog();
    for (let i = 0; i <= idx; i++) {
        if (steps[i].log) appendLogEntry(steps[i].log.opName, steps[i].log.details);
    }

    stepIndex = idx;
}

/** Single source of truth for button states and labels. */
function updateButtonStates() {
    const last = steps.length - 1;
    const atStart = stepIndex === 0;
    const atEnd = stepIndex === last;

    if (appState === 'playing') {
        sortBtn.innerText = 'Pause';
        sortBtn.disabled = false;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    } else if (appState === 'done') {
        sortBtn.innerText = 'Start';
        sortBtn.disabled = false;
        prevBtn.disabled = atStart;
        nextBtn.disabled = true; // already at last step
    } else {
        // idle or paused
        sortBtn.innerText = appState === 'paused' ? 'Resume' : 'Start';
        sortBtn.disabled = false;
        prevBtn.disabled = atStart;
        nextBtn.disabled = atEnd;
    }
}

// ==========================================================================
// Auto-play Engine
// ==========================================================================
function playAuto() {
    appState = 'playing';
    updateButtonStates();

    function tick() {
        if (appState !== 'playing') return;
        const next = stepIndex + 1;
        if (next >= steps.length) {
            // Reached the end
            appState = 'done';
            updateButtonStates();
            return;
        }
        renderStep(next);
        if (next === steps.length - 1) {
            appState = 'done';
            updateButtonStates();
        } else {
            playTimer = setTimeout(tick, delay);
        }
    }

    playTimer = setTimeout(tick, delay);
}

function pauseAuto() {
    clearTimeout(playTimer);
    appState = 'paused';
    updateButtonStates();
}

function togglePlay() {
    if (appState === 'playing') {
        pauseAuto();
    } else if (appState === 'paused') {
        playAuto();
    } else {
        // idle or done - restart from step 0 if done, else play from current
        if (appState === 'done') renderStep(0);
        playAuto();
    }
}

// ==========================================================================
// Event Listeners
// ==========================================================================
generateBtn.addEventListener('click', generateArray);

sizeSlider.addEventListener('input', () => {
    sizeLabel.innerText = sizeSlider.value;
    if (appState !== 'playing') generateArray();
});

speedSlider.addEventListener('input', updateDelay);

/** Sets which legend items are visible for the current algorithm. */
const algoLegendKeys = {
    bubble: ['unsorted', 'comparing', 'swapping', 'sorted'],
    selection: ['unsorted', 'comparing', 'swapping', 'sorted'],
    insertion: ['unsorted', 'comparing', 'swapping', 'sorted'],
    merge: ['unsorted', 'comparing', 'swapping', 'sorted'],
    quick: ['unsorted', 'comparing', 'swapping', 'pivot', 'sorted'],
};

function updateLegend() {
    const active = new Set(algoLegendKeys[algorithmSelect.value] || []);
    document.querySelectorAll('#legend .legend-item').forEach(item => {
        item.classList.toggle('hidden', !active.has(item.dataset.legend));
    });
}

algorithmSelect.addEventListener('change', () => {
    updateLegend();
    if (appState !== 'playing') {
        // Regenerate array for new algorithm (existing behaviour)
        generateArray();
    }
});

orderSelect.addEventListener('change', () => {
    if (appState !== 'playing') {
        // Re-record steps for same array but flipped order
        reRecordSteps();
    }
});

sortBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
    if (stepIndex > 0) {
        renderStep(stepIndex - 1);
        updateButtonStates();
    }
});

nextBtn.addEventListener('click', () => {
    if (stepIndex < steps.length - 1) {
        renderStep(stepIndex + 1);
        updateButtonStates();
    }
});

// ==========================================================================
// Metric Info Modal
// ==========================================================================
const metricInfoData = {
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
        body: 'The actual wall-clock time in milliseconds taken by the JavaScript engine to pre-compute all sorting steps synchronously. This excludes visual step rendering and the playback delay set by the speed slider - it reflects raw algorithmic performance of this sort in your browser\'s JS runtime.'
    }
};

const metricModalBackdrop = document.getElementById('metric-modal-backdrop');
const metricModalBox = document.getElementById('metric-modal-box');
const metricModalTitle = document.getElementById('metric-modal-title');
const metricModalBody = document.getElementById('metric-modal-body');
const metricModalClose = document.getElementById('metric-modal-close');

function openMetricModal(key) {
    const d = metricInfoData[key];
    if (!d) return;
    metricModalTitle.innerText = d.title;
    metricModalBody.innerText = d.body;
    metricModalBackdrop.classList.remove('hidden');
    metricModalBox.classList.remove('hidden');
}

function closeMetricModal() {
    metricModalBackdrop.classList.add('hidden');
    metricModalBox.classList.add('hidden');
}

document.querySelectorAll('.info-icon').forEach(icon => {
    icon.addEventListener('click', () => openMetricModal(icon.dataset.infoKey));
});
metricModalClose.addEventListener('click', closeMetricModal);
metricModalBackdrop.addEventListener('click', closeMetricModal);
document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !metricModalBackdrop.classList.contains('hidden')) closeMetricModal();
});

// Run setup on load
window.onload = init;