// ==========================================================================
// SECTION 1: GLOBAL CONFIGURATION
// ==========================================================================
const MAX_BAR_HEIGHT_PX = 100; // Fixed maximum height of a bar in pixels
const DEPTH_STEP_PX = 150;     // Total vertical space allocated per depth layer (100px bar + 50px buffer)

// ==========================================================================
// SECTION 2: LOGIC LAYER — Algorithm Generators
// ==========================================================================

/**
 * Creates one immutable visual frame snapshot.
 * Supports elevs (Y movement) and xOffsets (X separation).
 */
function mkFrame(arr, clrs, comp, sw, log, animMeta, elevs = null, xOffsets = null) {
    const frame = {
        values: [...arr],
        colors: [...clrs],
        comparisons: comp,
        swaps: sw,
        log: log,
        animMeta: animMeta || null,
        elevations: elevs ? [...elevs] : new Array(arr.length).fill(0),
        xOffsets: xOffsets ? [...xOffsets] : new Array(arr.length).fill(0)
    };
    if (xOffsets && xOffsets._mergeTargets) {
        frame.xOffsets._mergeTargets = { ...xOffsets._mergeTargets };
    }
    return frame;
}

// --------------------------------------------------------------------------
// Bubble, Selection, Quick, Insertion
// --------------------------------------------------------------------------
function* bubbleSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    let comp = 0, sw = 0;

    yield mkFrame(arr, clrs, comp, sw, { opName: 'Start', details: `Bubble Sort Initiated` });

    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - i - 1; j++) {
            clrs[j] = 'bar-comparing';
            clrs[j + 1] = 'bar-comparing';
            yield mkFrame(arr, clrs, comp, sw, { opName: 'Compare', details: `Index [${j}] (${arr[j]}) with Index [${j + 1}] (${arr[j + 1]})` });
            comp++;

            if (isDesc ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                clrs[j] = 'bar-swapping'; clrs[j + 1] = 'bar-swapping';
                sw++;
                yield mkFrame(arr, clrs, comp, sw, { opName: 'Swap', details: `Index [${j}] and Index [${j + 1}]` }, { animType: 'swap', swapIndices: [j, j + 1] });
                swapped = true;
            }
            clrs[j] = 'bar-default'; clrs[j + 1] = 'bar-default';
        }
        clrs[n - i - 1] = 'bar-sorted';
        if (!swapped) {
            for (let k = 0; k < n - i - 1; k++) clrs[k] = 'bar-sorted';
            break;
        }
    }
    clrs[0] = 'bar-sorted';
    yield mkFrame(arr, clrs, comp, sw, { opName: 'Complete', details: 'Bubble Sort finished successfully.' });
}

function* selectionSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    let comp = 0, sw = 0;

    yield mkFrame(arr, clrs, comp, sw, { opName: 'Start', details: `Selection Sort Initiated` });

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        clrs[i] = 'bar-swapping';
        yield mkFrame(arr, clrs, comp, sw, { opName: 'Pass', details: `Iteration ${i}, assumed target at [${i}] (value: ${arr[i]})` });

        for (let j = i + 1; j < n; j++) {
            clrs[j] = 'bar-comparing';
            yield mkFrame(arr, clrs, comp, sw, null);
            comp++;

            if (isDesc ? arr[j] > arr[minIdx] : arr[j] < arr[minIdx]) {
                if (minIdx !== i) clrs[minIdx] = 'bar-default';
                minIdx = j;
                clrs[minIdx] = 'bar-swapping';
                yield mkFrame(arr, clrs, comp, sw, { opName: 'New Target', details: `Found at index [${j}] (value: ${arr[j]})` });
            } else clrs[j] = 'bar-default';
        }

        if (minIdx !== i) {
            [arr[minIdx], arr[i]] = [arr[i], arr[minIdx]];
            sw++;
            yield mkFrame(arr, clrs, comp, sw, { opName: 'Swap', details: `Starting element [${i}] with target element [${minIdx}]` }, { animType: 'swap', swapIndices: [i, minIdx] });
        }
        clrs[minIdx] = 'bar-default';
        clrs[i] = 'bar-sorted';
    }
    clrs[n - 1] = 'bar-sorted';
    yield mkFrame(arr, clrs, comp, sw, { opName: 'Complete', details: 'Selection Sort finished successfully.' });
}

function* insertionSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    const elevs = new Array(n).fill(0);
    let comp = 0, sw = 0;

    yield mkFrame(arr, clrs, comp, sw, { opName: 'Start', details: `Insertion Sort Initiated` }, null, elevs);
    clrs[0] = 'bar-sorted';

    for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        clrs[i] = 'bar-swapping';

        elevs[i] = -45;
        yield mkFrame(arr, clrs, comp, sw, { opName: 'Select & Lift', details: `Index [${i}] (value: ${key}) lifted` }, { animType: 'elevate', indices: [i] }, elevs);

        while (j >= 0) {
            clrs[j] = 'bar-comparing';
            yield mkFrame(arr, clrs, comp, sw, null, null, elevs);
            comp++;

            if (isDesc ? arr[j] < key : arr[j] > key) {
                [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]];
                [elevs[j + 1], elevs[j]] = [elevs[j], elevs[j + 1]];
                sw++;
                clrs[j + 1] = 'bar-swapping'; clrs[j] = 'bar-swapping';
                yield mkFrame(arr, clrs, comp, sw, { opName: 'Shift & Swap', details: `Grounded [${j}] moved right, Lifted key moved left` }, { animType: 'swap', swapIndices: [j, j + 1] }, elevs);
                clrs[j + 1] = 'bar-sorted';
                j--;
            } else {
                clrs[j] = 'bar-sorted';
                break;
            }
        }
        elevs[j + 1] = 0;
        clrs[j + 1] = 'bar-sorted';
        for (let k = 0; k <= i; k++) clrs[k] = 'bar-sorted';
        yield mkFrame(arr, clrs, comp, sw, { opName: 'Drop', details: `Key (${key}) dropped into correct position [${j + 1}]` }, { animType: 'elevate', indices: [j + 1] }, elevs);
    }
    yield mkFrame(arr, clrs, comp, sw, { opName: 'Complete', details: 'Insertion Sort finished successfully.' }, null, elevs);
}

function* _quickPartitionGen(arr, low, high, clrs, stats, isDesc) {
    const pivot = arr[high];
    clrs[high] = 'bar-pivot';
    yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Partition', details: `Array [${low}-${high}], Pivot at [${high}] (value: ${pivot})` });

    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        clrs[j] = 'bar-comparing';
        yield mkFrame(arr, clrs, stats.comp, stats.sw, null);
        stats.comp++;

        if (isDesc ? arr[j] > pivot : arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            clrs[i] = 'bar-swapping'; clrs[j] = 'bar-swapping';
            stats.sw++;
            yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Swap', details: `Swapping [${i}] & [${j}]` }, { animType: 'swap', swapIndices: [i, j] });
            clrs[i] = 'bar-default';
        }
        clrs[j] = 'bar-default';
    }
    const pivotFinalIdx = i + 1;
    [arr[pivotFinalIdx], arr[high]] = [arr[high], arr[pivotFinalIdx]];
    clrs[pivotFinalIdx] = 'bar-sorted'; clrs[high] = 'bar-default';
    stats.sw++;
    yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Place Pivot', details: `Pivot (${pivot}) moved to [${pivotFinalIdx}]` }, { animType: 'swap', swapIndices: [pivotFinalIdx, high] });
    return pivotFinalIdx;
}

function* _quickHelperGen(arr, low, high, clrs, stats, isDesc) {
    if (low < high) {
        const pi = yield* _quickPartitionGen(arr, low, high, clrs, stats, isDesc);
        yield* _quickHelperGen(arr, low, pi - 1, clrs, stats, isDesc);
        yield* _quickHelperGen(arr, pi + 1, high, clrs, stats, isDesc);
    } else if (low >= 0 && low < arr.length) clrs[low] = 'bar-sorted';
}

function* quickSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    const stats = { comp: 0, sw: 0 };
    yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Start', details: `Quick Sort Initiated` });
    yield* _quickHelperGen(arr, 0, n - 1, clrs, stats, isDesc);
    for (let i = 0; i < arr.length; i++) clrs[i] = 'bar-sorted';
    yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Complete', details: 'Quick Sort finished.' });
}

// --------------------------------------------------------------------------
// Merge Sort Generators (Depth Map / Orthogonal Routing)
// --------------------------------------------------------------------------
function* _mergeStepGen(arr, l, m, r, clrs, stats, isDesc, elevs, xOffsets, depth, parentOffset) {
    const L = arr.slice(l, m + 1).map((val, idx) => ({ val, srcIdx: l + idx }));
    const Rv = arr.slice(m + 1, r + 1).map((val, idx) => ({ val, srcIdx: m + 1 + idx }));

    if (!xOffsets._mergeTargets) xOffsets._mergeTargets = {};

    let i = 0, j = 0, k = l;
    const mergedArr = [...arr];

    while (i < L.length && j < Rv.length) {
        const leftItem = L[i];
        const rightItem = Rv[j];

        clrs[leftItem.srcIdx] = 'bar-comparing';
        clrs[rightItem.srcIdx] = 'bar-comparing';
        yield mkFrame(arr, clrs, stats.comp, stats.sw, null, null, elevs, xOffsets);
        stats.comp++;

        const takeLeft = isDesc ? leftItem.val >= rightItem.val : leftItem.val <= rightItem.val;
        let winner = takeLeft ? leftItem : rightItem;

        clrs[leftItem.srcIdx] = 'bar-default';
        clrs[rightItem.srcIdx] = 'bar-default';

        if (takeLeft) i++; else j++;

        mergedArr[k] = winner.val;
        stats.sw++;

        elevs[winner.srcIdx] = depth * DEPTH_STEP_PX;
        clrs[winner.srcIdx] = 'bar-swapping';
        xOffsets._mergeTargets[winner.srcIdx] = { target: k, offset: parentOffset };

        yield mkFrame(arr, clrs, stats.comp, stats.sw, {
            opName: 'Conquer',
            details: `Value ${winner.val} aligns and flies up to index [${k}]`
        }, {
            animType: 'merge-fly',
            sourceIdx: winner.srcIdx,
            targetIdx: k
        }, elevs, xOffsets);

        clrs[winner.srcIdx] = (depth === 0) ? 'bar-sorted' : 'bar-default';
        k++;
    }

    while (i < L.length) {
        const winner = L[i];
        mergedArr[k] = winner.val;
        stats.sw++;
        elevs[winner.srcIdx] = depth * DEPTH_STEP_PX;
        clrs[winner.srcIdx] = 'bar-swapping';
        xOffsets._mergeTargets[winner.srcIdx] = { target: k, offset: parentOffset };

        yield mkFrame(arr, clrs, stats.comp, stats.sw, {
            opName: 'Sweep',
            details: `Remaining Left value ${winner.val} flies up to [${k}]`
        }, { animType: 'merge-fly', sourceIdx: winner.srcIdx, targetIdx: k }, elevs, xOffsets);

        clrs[winner.srcIdx] = (depth === 0) ? 'bar-sorted' : 'bar-default';
        i++; k++;
    }

    while (j < Rv.length) {
        const winner = Rv[j];
        mergedArr[k] = winner.val;
        stats.sw++;
        elevs[winner.srcIdx] = depth * DEPTH_STEP_PX;
        clrs[winner.srcIdx] = 'bar-swapping';
        xOffsets._mergeTargets[winner.srcIdx] = { target: k, offset: parentOffset };

        yield mkFrame(arr, clrs, stats.comp, stats.sw, {
            opName: 'Sweep',
            details: `Remaining Right value ${winner.val} flies up to [${k}]`
        }, { animType: 'merge-fly', sourceIdx: winner.srcIdx, targetIdx: k }, elevs, xOffsets);

        clrs[winner.srcIdx] = (depth === 0) ? 'bar-sorted' : 'bar-default';
        j++; k++;
    }

    for (let x = l; x <= r; x++) {
        arr[x] = mergedArr[x];
        elevs[x] = depth * DEPTH_STEP_PX;
        xOffsets[x] = parentOffset;
        clrs[x] = (depth === 0) ? 'bar-sorted' : 'bar-default';
    }

    if (xOffsets._mergeTargets) {
        for (let x = l; x <= r; x++) delete xOffsets._mergeTargets[x];
    }

    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Block Merged',
        details: `Merge complete for block [${l}-${r}] at depth ${depth}`
    }, { animType: 'merge-rebind' }, elevs, xOffsets);
}

function* _mergeHelperGen(arr, l, r, clrs, stats, isDesc, elevs, xOffsets, depth, parentOffset) {
    if (l >= r) return;
    const m = l + Math.floor((r - l) / 2);

    const shiftAmt = Math.max(5, (4 - depth) * 5);
    const leftOffset = parentOffset - shiftAmt;
    const rightOffset = parentOffset + shiftAmt;

    const dropRange = [];
    for (let i = l; i <= m; i++) {
        elevs[i] = (depth + 1) * DEPTH_STEP_PX;
        xOffsets[i] = leftOffset;
        dropRange.push(i);
    }
    for (let i = m + 1; i <= r; i++) {
        elevs[i] = (depth + 1) * DEPTH_STEP_PX;
        xOffsets[i] = rightOffset;
        dropRange.push(i);
    }

    yield mkFrame(arr, clrs, stats.comp, stats.sw, {
        opName: 'Divide',
        details: `Split [${l}-${r}] dropped to depth ${depth + 1}`
    }, { animType: 'orthogonal-divide', indices: dropRange, depth: depth + 1 }, elevs, xOffsets);

    yield* _mergeHelperGen(arr, l, m, clrs, stats, isDesc, elevs, xOffsets, depth + 1, leftOffset);
    yield* _mergeHelperGen(arr, m + 1, r, clrs, stats, isDesc, elevs, xOffsets, depth + 1, rightOffset);

    yield* _mergeStepGen(arr, l, m, r, clrs, stats, isDesc, elevs, xOffsets, depth, parentOffset);
}

function* mergeSortGen(arr, isDesc) {
    const n = arr.length;
    const clrs = new Array(n).fill('bar-default');
    const elevs = new Array(n).fill(0);
    const xOffsets = new Array(n).fill(0);
    const stats = { comp: 0, sw: 0 };

    yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Start', details: `Merge Sort Initiated` }, null, elevs, xOffsets);

    yield* _mergeHelperGen(arr, 0, n - 1, clrs, stats, isDesc, elevs, xOffsets, 0, 0);

    for (let i = 0; i < n; i++) clrs[i] = 'bar-sorted';
    yield mkFrame(arr, clrs, stats.comp, stats.sw, { opName: 'Complete', details: 'Merge Sort finished successfully.' }, null, elevs, xOffsets);
}

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
// SECTION 2B: HEADLESS PROFILER (For Complexity Curve)
// ==========================================================================

const profiler = {
    cache: {},
    // Array sizes to sample mathematically for the smooth profile curve
    sizes: Array.from({ length: 11 }, (_, i) => i * 10),
    samples: 3, // Samples per array size to ensure averages out outliers

    getProfile(algo, isDesc) {
        const key = `${algo}-${isDesc}`;
        if (this.cache[key]) return this.cache[key];

        const results = [];
        for (const n of this.sizes) {
            let totalOps = 0;
            for (let s = 0; s < this.samples; s++) {
                const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 96) + 5);
                totalOps += this.runHeadless(algo, arr, isDesc);
            }
            results.push({ n, ops: totalOps / this.samples });
        }
        this.cache[key] = results;
        return results;
    },

    // Mirrors the exact operation count (swaps + comps) of generators, silently and instantly.
    runHeadless(algo, arr, isDesc) {
        let comp = 0, sw = 0;
        let n = arr.length;

        switch (algo) {
            case 'bubble':
                for (let i = 0; i < n - 1; i++) {
                    let swapped = false;
                    for (let j = 0; j < n - i - 1; j++) {
                        comp++;
                        if (isDesc ? arr[j] < arr[j + 1] : arr[j] > arr[j + 1]) {
                            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                            sw++;
                            swapped = true;
                        }
                    }
                    if (!swapped) break;
                }
                break;
            case 'selection':
                for (let i = 0; i < n - 1; i++) {
                    let minIdx = i;
                    for (let j = i + 1; j < n; j++) {
                        comp++;
                        if (isDesc ? arr[j] > arr[minIdx] : arr[j] < arr[minIdx]) minIdx = j;
                    }
                    if (minIdx !== i) {
                        [arr[minIdx], arr[i]] = [arr[i], arr[minIdx]];
                        sw++;
                    }
                }
                break;
            case 'insertion':
                for (let i = 1; i < n; i++) {
                    let key = arr[i];
                    let j = i - 1;
                    while (j >= 0) {
                        comp++;
                        if (isDesc ? arr[j] < key : arr[j] > key) {
                            arr[j + 1] = arr[j];
                            sw++;
                            j--;
                        } else break;
                    }
                }
                break;
            case 'merge':
                const mStep = (l, m, r) => {
                    const L = arr.slice(l, m + 1);
                    const Rv = arr.slice(m + 1, r + 1);
                    let i = 0, j = 0, k = l;
                    while (i < L.length && j < Rv.length) {
                        comp++;
                        if (isDesc ? L[i] >= Rv[j] : L[i] <= Rv[j]) { arr[k++] = L[i++]; }
                        else { arr[k++] = Rv[j++]; }
                        sw++;
                    }
                    while (i < L.length) { arr[k++] = L[i++]; sw++; }
                    while (j < Rv.length) { arr[k++] = Rv[j++]; sw++; }
                };
                const mSort = (l, r) => {
                    if (l >= r) return;
                    let m = l + Math.floor((r - l) / 2);
                    mSort(l, m); mSort(m + 1, r); mStep(l, m, r);
                };
                mSort(0, n - 1);
                break;
            case 'quick':
                const partition = (low, high) => {
                    let pivot = arr[high];
                    let i = low - 1;
                    for (let j = low; j <= high - 1; j++) {
                        comp++;
                        if (isDesc ? arr[j] > pivot : arr[j] < pivot) {
                            i++;
                            [arr[i], arr[j]] = [arr[j], arr[i]];
                            sw++;
                        }
                    }
                    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
                    sw++;
                    return i + 1;
                };
                const qSort = (low, high) => {
                    if (low < high) {
                        let pi = partition(low, high);
                        qSort(low, pi - 1); qSort(pi + 1, high);
                    }
                };
                qSort(0, n - 1);
                break;
        }
        return comp + sw;
    }
};

// ==========================================================================
// SECTION 3: ANIMATION ENGINE
// ==========================================================================

let array = [];
let frames = [];
let frameIndex = 0;
let animState = 'idle';
let delay = 1000;
let playTimer = null;

function collectFrames(algo, sourceArray, isDesc) {
    const result = [];
    result.push({
        values: [...sourceArray],
        colors: new Array(sourceArray.length).fill('bar-default'),
        comparisons: 0,
        swaps: 0,
        elevations: new Array(sourceArray.length).fill(0),
        xOffsets: new Array(sourceArray.length).fill(0),
        log: { opName: 'Ready', details: `Array of size ${sourceArray.length} loaded.` }
    });

    const gen = sortGenerator(algo, sourceArray, isDesc);
    const t0 = performance.now();
    for (const frame of gen) result.push(frame);
    result.runTimeMs = Math.round((performance.now() - t0) * 100) / 100;
    return result;
}

function waitForTransition(el, timeoutMs) {
    return new Promise(resolve => {
        const fallback = setTimeout(resolve, timeoutMs);
        el.addEventListener('transitionend', () => {
            clearTimeout(fallback);
            resolve();
        }, { once: true });
    });
}

function clampDur(ms) {
    return Math.max(80, Math.min(ms, 500));
}

async function animateSwap(idxA, idxB, frame) {
    const barA = ui.bars[idxA].bar;
    const barB = ui.bars[idxB].bar;

    const elevA = parseInt(barA.dataset.elev || '0', 10);
    const elevB = parseInt(barB.dataset.elev || '0', 10);
    const xoffA = parseFloat(barA.dataset.xoff || '0');
    const xoffB = parseFloat(barB.dataset.xoff || '0');

    const rectA = barA.getBoundingClientRect();
    const rectB = barB.getBoundingClientRect();
    const dx = rectB.left - rectA.left;
    const dur = clampDur(delay * 0.6);

    barA.style.transition = `transform ${dur}ms ease`;
    barB.style.transition = `transform ${dur}ms ease`;

    barA.style.transform = `translateX(${xoffA + dx}px) translateY(${elevA}px)`;
    barB.style.transform = `translateX(${xoffB - dx}px) translateY(${elevB}px)`;

    await waitForTransition(barA, dur + 50);

    barA.style.transition = 'none';
    barB.style.transition = 'none';
    barA.style.transform = '';
    barB.style.transform = '';
}

async function renderFrame(idx) {
    const frame = frames[idx];
    if (!frame) return;

    // Step 1: Calculate union of current and previous depths to PREVENT premature shrinking
    const activeDepths = new Set();
    frame.elevations.forEach(elev => {
        if (elev > 0) activeDepths.add(Math.round(elev / DEPTH_STEP_PX));
    });

    const prevFrame = frames[idx - 1];
    if (prevFrame) {
        prevFrame.elevations.forEach(elev => {
            if (elev > 0) activeDepths.add(Math.round(elev / DEPTH_STEP_PX));
        });
    }

    // Expand or hold the container size before animation starts
    ui.syncDepthLabels(activeDepths);

    if (frame.animMeta?.animType === 'swap') {
        const [idxA, idxB] = frame.animMeta.swapIndices;
        await animateSwap(idxA, idxB, frame);

        for (let i = 0; i < ui.bars.length; i++) {
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i, frame.colors[i]);
            ui.setBarTransform(i, frame);
        }
    }
    else if (frame.animMeta?.animType === 'elevate') {
        const targetIndices = frame.animMeta.indices ? frame.animMeta.indices : [frame.animMeta.index];
        const dur = clampDur(delay * 0.4);

        for (let i = 0; i < ui.bars.length; i++) {
            if (targetIndices.includes(i)) continue;
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i, frame.colors[i]);
            ui.setBarTransform(i, frame);
        }

        const promises = [];
        for (const targetIdx of targetIndices) {
            const bar = ui.bars[targetIdx].bar;
            ui.setBarHeight(targetIdx, frame.values[targetIdx]);
            ui.setBarColor(targetIdx, frame.colors[targetIdx]);
            bar.style.transition = `transform ${dur}ms ease`;
            ui.setBarTransform(targetIdx, frame);
            promises.push(waitForTransition(bar, dur + 50));
        }

        await Promise.all(promises);
        for (const targetIdx of targetIndices) ui.bars[targetIdx].bar.style.transition = 'none';
    }
    else if (frame.animMeta?.animType === 'orthogonal-divide') {
        const meta = frame.animMeta;
        const dur = clampDur(delay * 0.4);

        for (let i = 0; i < ui.bars.length; i++) {
            if (meta.indices.includes(i)) continue;
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i, frame.colors[i]);
            ui.setBarTransform(i, frame);
        }

        const promisesY = [];
        for (const targetIdx of meta.indices) {
            const bar = ui.bars[targetIdx].bar;
            ui.setBarHeight(targetIdx, frame.values[targetIdx]);
            ui.setBarColor(targetIdx, frame.colors[targetIdx]);
            bar.style.transition = `transform ${dur}ms ease`;
            const oldX = parseFloat(bar.dataset.xoff || '0');
            bar.style.transform = `translateX(${oldX}px) translateY(${frame.elevations[targetIdx]}px)`;
            promisesY.push(waitForTransition(bar, dur + 50));
        }
        await Promise.all(promisesY);

        const promisesX = [];
        for (const targetIdx of meta.indices) {
            const bar = ui.bars[targetIdx].bar;
            bar.style.transition = `transform ${dur}ms ease`;
            ui.setBarTransform(targetIdx, frame);
            promisesX.push(waitForTransition(bar, dur + 50));
        }
        await Promise.all(promisesX);
        for (const targetIdx of meta.indices) ui.bars[targetIdx].bar.style.transition = 'none';

    }
    else if (frame.animMeta?.animType === 'merge-fly') {
        const meta = frame.animMeta;
        const dur = clampDur(delay * 0.4);
        const k = meta.targetIdx;
        const srcIdx = meta.sourceIdx;
        const barSrc = ui.bars[srcIdx].bar;

        for (let i = 0; i < ui.bars.length; i++) {
            if (i === srcIdx) continue;
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i, frame.colors[i]);
            ui.setBarTransform(i, frame);
        }

        ui.setBarHeight(srcIdx, frame.values[srcIdx]);
        ui.setBarColor(srcIdx, frame.colors[srcIdx]);

        const prevFrame = frames[frameIndex];
        const startTranslateX = prevFrame ? prevFrame.xOffsets[srcIdx] : 0;
        const startTranslateY = prevFrame ? prevFrame.elevations[srcIdx] : 0;

        const targetObj = frame.xOffsets._mergeTargets[srcIdx];
        const targetBar = ui.bars[targetObj.target].bar;

        const oldT = targetBar.style.transform;
        const oldS = barSrc.style.transform;
        targetBar.style.transform = 'none';
        barSrc.style.transform = 'none';

        const targetXPos = targetBar.getBoundingClientRect().left;
        const sourceXPos = barSrc.getBoundingClientRect().left;

        targetBar.style.transform = oldT;
        barSrc.style.transform = oldS;

        const endTranslateX = targetXPos - sourceXPos + targetObj.offset;
        const endTranslateY = frame.elevations[srcIdx];

        barSrc.style.transition = 'none';
        barSrc.style.transform = `translateX(${startTranslateX}px) translateY(${startTranslateY}px)`;
        void barSrc.offsetWidth;

        barSrc.style.transition = `transform ${dur}ms ease`;
        barSrc.style.transform = `translateX(${endTranslateX}px) translateY(${startTranslateY}px)`;
        await waitForTransition(barSrc, dur + 50);

        barSrc.style.transform = `translateX(${endTranslateX}px) translateY(${endTranslateY}px)`;
        await waitForTransition(barSrc, dur + 50);

        barSrc.style.transition = 'none';
        ui.setBarTransform(srcIdx, frame);
    }
    else if (frame.animMeta?.animType === 'merge-rebind') {
        for (let i = 0; i < ui.bars.length; i++) {
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i, frame.colors[i]);
            ui.setBarTransform(i, frame);
        }
    }
    else {
        for (let i = 0; i < ui.bars.length; i++) {
            ui.setBarHeight(i, frame.values[i]);
            ui.setBarColor(i, frame.colors[i]);
            ui.setBarTransform(i, frame);
        }
    }

    // Step 2: After animations complete, sync strictly to current depths to allow safe shrinking
    const finalDepths = new Set();
    frame.elevations.forEach(elev => {
        if (elev > 0) finalDepths.add(Math.round(elev / DEPTH_STEP_PX));
    });
    ui.syncDepthLabels(finalDepths);

    ui.updateStats(frame.comparisons, frame.swaps);
    ui.clearLog();
    for (let i = 0; i <= idx; i++) {
        if (frames[i].log) ui.appendLogEntry(frames[i].log.opName, frames[i].log.details);
    }

    frameIndex = idx;
}

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
        ui.nextBtn.disabled = true;
    } else {
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
    if (animState === 'playing') pauseAuto();
    else if (animState === 'paused') playAuto();
    else {
        if (animState === 'done') renderFrame(0);
        playAuto();
    }
}

function updateDelay() {
    const speed = parseInt(ui.speedSlider.value);
    ui.speedLabel.innerText = speed;
    delay = speed === 5 ? 2 : 1000 / Math.pow(speed, 0.85);
}

function reCollectFrames() {
    clearTimeout(playTimer);
    animState = 'idle';
    const algo = ui.algorithmSelect.value;
    const isDesc = ui.orderSelect.value === 'desc';

    // Reset base styles
    ui.setCanvasExpansion(true);

    frames = collectFrames(algo, array, isDesc);
    ui.statsRuntime.innerText = frames.runTimeMs;

    // Plot the Complexity Curve
    const currentN = array.length;
    const lastFrame = frames[frames.length - 1];
    const currentOps = lastFrame.comparisons + lastFrame.swaps;
    const profileData = profiler.getProfile(algo, isDesc);
    ui.drawCurve(profileData, currentN, currentOps);

    frameIndex = 0;
    renderFrame(0);
    updateButtonStates();
}

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
// SECTION 4: UI LAYER
// ==========================================================================

const ui = {
    canvasWrapper: document.getElementById('canvas-container'),
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

    curveContainer: document.getElementById('curve-container'),
    curveSvg: document.getElementById('complexity-svg'),
    curveTooltip: document.getElementById('curve-tooltip'),
    lastCurveData: { profileData: null, currentN: 0, currentOps: 0 },

    metricModalBackdrop: document.getElementById('metric-modal-backdrop'),
    metricModalBox: document.getElementById('metric-modal-box'),
    metricModalTitle: document.getElementById('metric-modal-title'),
    metricModalBody: document.getElementById('metric-modal-body'),
    metricModalClose: document.getElementById('metric-modal-close'),

    bars: [],
    depthLabels: {},

    setCanvasExpansion(isExpanded) {
        if (isExpanded) {
            this.container.style.paddingBottom = '20px'; // Reverts to base
            this.canvasWrapper.style.maxHeight = 'none';
            this.canvasWrapper.style.overflowY = 'visible';
        } else {
            this.container.style.paddingBottom = '20px';
            this.canvasWrapper.style.maxHeight = '50vh';
            this.canvasWrapper.style.overflowY = 'hidden';
            this.syncDepthLabels(new Set()); // Instant clear
        }
    },

    syncDepthLabels(activeDepthsSet) {
        let maxDepth = 0;

        // Remove labels no longer in use
        for (const d of Object.keys(this.depthLabels)) {
            if (!activeDepthsSet.has(parseInt(d))) {
                this.depthLabels[d].remove();
                delete this.depthLabels[d];
            }
        }

        // Add new labels instantly dynamically
        for (const d of activeDepthsSet) {
            if (d > maxDepth) maxDepth = d;
            if (d === 0) continue;
            if (!this.depthLabels[d]) {
                const label = document.createElement('div');
                label.className = 'depth-label';
                label.innerText = `(${d})`;
                label.style.transform = `translateY(${d * DEPTH_STEP_PX}px)`;
                this.container.appendChild(label);
                this.depthLabels[d] = label;
            }
        }

        if (this.algorithmSelect.value === 'merge') {
            const requiredPadding = Math.max(20, maxDepth * DEPTH_STEP_PX + 40);
            this.container.style.paddingBottom = `${requiredPadding}px`;
        }
    },

    adjustConstraints(forceMobileMergeDefault = false) {
        const algo = this.algorithmSelect.value;
        const isMobile = window.innerWidth <= 768;
        let changed = false;

        if (algo === 'merge' && isMobile) {
            this.sizeSlider.max = 10;
            this.sizeSlider.min = 5;
            if (parseInt(this.sizeSlider.value) > 10 || forceMobileMergeDefault) {
                this.sizeSlider.value = 5;
                changed = true;
            }
        }
        else if (algo === 'merge' && !isMobile) {
            this.sizeSlider.max = 16;
            this.sizeSlider.min = 5;
        }
        else {
            this.sizeSlider.max = 100;
            this.sizeSlider.min = 10;
        }
        this.sizeLabel.innerText = this.sizeSlider.value;
        return changed;
    },

    buildBars(size) {
        this.container.innerHTML = '';
        this.bars = [];
        this.syncDepthLabels(new Set());

        const algo = this.algorithmSelect.value;
        const isMobile = window.innerWidth <= 768;
        // Dynamically shrink bar thickness specifically for mobile depth map
        const currentMaxWidth = (algo === 'merge' && isMobile) ? 15 : 20;

        for (let i = 0; i < size; i++) {
            const wrapper = document.createElement('div');
            wrapper.className = 'bar-wrapper';
            wrapper.style.maxWidth = `${currentMaxWidth}px`;

            const bar = document.createElement('div');
            bar.className = 'array-bar bar-default';
            // Start at 0px exactly
            bar.style.height = '0px';
            bar.dataset.elev = '0';
            bar.dataset.xoff = '0';

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
        // Dynamically compute exact pixel height so layout remains flawless regardless of parent
        const pxHeight = (value / 100) * MAX_BAR_HEIGHT_PX;
        this.bars[i].bar.style.height = `${pxHeight}px`;
        this.bars[i].valSpan.innerText = value;
    },

    setBarColor(i, colorClass) {
        if (!this.bars[i]) return;
        this.bars[i].bar.className = `array-bar ${colorClass}`;
    },

    setBarTransform(i, frame) {
        if (!this.bars[i]) return;
        const bar = this.bars[i].bar;
        const elev = frame.elevations[i];
        let xOffset = frame.xOffsets[i];

        if (frame.xOffsets && frame.xOffsets._mergeTargets && frame.xOffsets._mergeTargets[i] !== undefined) {
            const targetObj = frame.xOffsets._mergeTargets[i];
            const targetBar = this.bars[targetObj.target].bar;

            const oldT = targetBar.style.transform;
            const oldS = bar.style.transform;
            targetBar.style.transform = 'none';
            bar.style.transform = 'none';

            const targetX = targetBar.getBoundingClientRect().left;
            const sourceX = bar.getBoundingClientRect().left;

            targetBar.style.transform = oldT;
            bar.style.transform = oldS;

            xOffset = targetX - sourceX + targetObj.offset;
        }

        bar.dataset.elev = elev;
        bar.dataset.xoff = xOffset;
        bar.style.transform = `translateX(${xOffset}px) translateY(${elev}px)`;
        if (elev < 0) bar.style.zIndex = '10';
        else if (elev > 0) bar.style.zIndex = '0';
        else bar.style.zIndex = '1';
    },

    drawCurve(profileData, currentN, currentOps) {
        this.lastCurveData = { profileData, currentN, currentOps };
        const w = this.curveContainer.clientWidth;
        const h = this.curveContainer.clientHeight;

        this.curveSvg.setAttribute('width', w);
        this.curveSvg.setAttribute('height', h);
        this.curveSvg.innerHTML = '';

        const paddingX = 25;
        const paddingY = 20;
        const innerW = w - paddingX * 2;
        const innerH = h - paddingY * 2;

        const maxN = Math.max(...profileData.map(d => d.n), currentN);
        const maxOps = Math.max(...profileData.map(d => d.ops), currentOps);

        const getX = (n) => paddingX + (n / maxN) * innerW;
        const getY = (ops) => h - paddingY - (ops / (maxOps || 1)) * innerH;

        // Draw Grid Lines
        [0.25, 0.5, 0.75].forEach(pct => {
            const y = paddingY + innerH * pct;
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', paddingX); line.setAttribute('x2', w - paddingX);
            line.setAttribute('y1', y); line.setAttribute('y2', y);
            line.setAttribute('stroke', 'var(--border-color)');
            line.setAttribute('stroke-dasharray', '4,4');
            this.curveSvg.appendChild(line);
        });

        // Draw Axes
        const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        xAxis.setAttribute('x1', paddingX); xAxis.setAttribute('x2', w - paddingX);
        xAxis.setAttribute('y1', h - paddingY); xAxis.setAttribute('y2', h - paddingY);
        xAxis.setAttribute('stroke', 'var(--text-secondary)');
        this.curveSvg.appendChild(xAxis);

        const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        yAxis.setAttribute('x1', paddingX); yAxis.setAttribute('x2', paddingX);
        yAxis.setAttribute('y1', paddingY); yAxis.setAttribute('y2', h - paddingY);
        yAxis.setAttribute('stroke', 'var(--text-secondary)');
        this.curveSvg.appendChild(yAxis);

        // Draw The Path
        let dStr = '';
        profileData.forEach((pt, i) => {
            const x = getX(pt.n);
            const y = getY(pt.ops);
            if (i === 0) dStr += `M ${x},${y} `;
            else dStr += `L ${x},${y} `;
        });

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', dStr);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', 'var(--accent-gold)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('stroke-linejoin', 'round');
        this.curveSvg.appendChild(path);

        // Draw Hover Data Points
        profileData.forEach(pt => {
            const cx = getX(pt.n);
            const cy = getY(pt.ops);
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', cx); circle.setAttribute('cy', cy);
            circle.setAttribute('r', '4');
            circle.setAttribute('fill', 'var(--surface-color)');
            circle.setAttribute('stroke', 'var(--accent-gold)');
            circle.setAttribute('stroke-width', '1.5');
            circle.classList.add('curve-point');

            circle.addEventListener('mouseenter', () => {
                this.curveTooltip.innerHTML = `Avg Expected<br>Size: ${pt.n}<br>Ops: ${Math.round(pt.ops)}`;
                this.curveTooltip.style.left = `${cx}px`;
                this.curveTooltip.style.top = `${cy}px`;
                this.curveTooltip.classList.remove('hidden');
                circle.setAttribute('r', '6');
                circle.setAttribute('fill', 'var(--accent-gold)');
            });
            circle.addEventListener('mouseleave', () => {
                this.curveTooltip.classList.add('hidden');
                circle.setAttribute('r', '4');
                circle.setAttribute('fill', 'var(--surface-color)');
            });
            this.curveSvg.appendChild(circle);
        });

        // Plot the "You Are Here" Marker
        const currX = getX(currentN);
        const currY = getY(currentOps);
        const currCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        currCircle.setAttribute('cx', currX); currCircle.setAttribute('cy', currY);
        currCircle.setAttribute('r', '5');
        currCircle.setAttribute('fill', 'var(--bar-comparing)');
        currCircle.setAttribute('stroke', '#fff');
        currCircle.setAttribute('stroke-width', '1.5');
        currCircle.style.filter = 'drop-shadow(0 0 4px var(--bar-comparing))';

        currCircle.addEventListener('mouseenter', () => {
            this.curveTooltip.innerHTML = `<b style="color:var(--bar-comparing)">Current Run</b><br>Size: ${currentN}<br>Ops: ${currentOps}`;
            this.curveTooltip.style.left = `${currX}px`;
            this.curveTooltip.style.top = `${currY}px`;
            this.curveTooltip.classList.remove('hidden');
        });
        currCircle.addEventListener('mouseleave', () => {
            this.curveTooltip.classList.add('hidden');
        });

        this.curveSvg.appendChild(currCircle);
    },

    redrawCurve() {
        if (this.lastCurveData.profileData) {
            this.drawCurve(this.lastCurveData.profileData, this.lastCurveData.currentN, this.lastCurveData.currentOps);
        }
    },

    updateStats(comp, sw) {
        this.statsComp.innerText = comp;
        this.statsSwaps.innerText = sw;
    },

    clearLog() { this.logContainer.innerHTML = ''; },

    appendLogEntry(opName, details) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="log-highlight">${opName}:</span> ${details}`;
        this.logContainer.appendChild(entry);
        this.logContainer.scrollTop = this.logContainer.scrollHeight;
    },

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

    metricInfoData: {
        comparisons: { title: 'Comparisons', body: 'The total number of times the algorithm compared two elements side-by-side to determine their order.' },
        swaps: { title: 'Writes / Swaps', body: 'The total number of times an element was moved, shifted, or exchanged in the array.' },
        runtime: { title: 'Run Time (ms)', body: 'The actual wall-clock time in milliseconds taken to drain the sort generator and pre-collect all frames.' },
        curve: {
            title: 'Complexity Curve',
            body: 'Displays the relationship between Array Size (N) and the Total Operations (Comparisons + Swaps) required to sort it.\n\nThe gold curve represents the mathematical average profiled instantly in the background. The glowing red dot represents your actual current array.\n\nThis visually demonstrates Best Case (red dot drops below the curve) and Worst Case (red dot spikes above the curve) time complexities!'
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

    bindEvents() {
        this.generateBtn.addEventListener('click', generateArray);

        this.sizeSlider.addEventListener('input', () => {
            this.sizeLabel.innerText = this.sizeSlider.value;
            if (animState !== 'playing') generateArray();
        });

        this.speedSlider.addEventListener('input', updateDelay);

        this.algorithmSelect.addEventListener('change', () => {
            this.updateLegend(this.algorithmSelect.value);
            const isMobile = window.innerWidth <= 768;
            const changed = this.adjustConstraints(this.algorithmSelect.value === 'merge' && isMobile);
            if (changed) {
                if (animState !== 'playing') generateArray();
            } else {
                if (animState !== 'playing') reCollectFrames();
            }
        });

        let lastIsMobile = window.innerWidth <= 768;
        window.addEventListener('resize', () => {
            const isMobile = window.innerWidth <= 768;
            this.redrawCurve();
            if (isMobile !== lastIsMobile) {
                lastIsMobile = isMobile;
                if (animState !== 'playing') {
                    this.adjustConstraints();
                    generateArray(); // Force regeneration to apply correct bar thickness for the screen size
                }
            }
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

function init() {
    ui.adjustConstraints();
    ui.bindEvents();
    updateDelay();
    ui.updateLegend(ui.algorithmSelect.value);
    generateArray();
}

window.onload = init;

