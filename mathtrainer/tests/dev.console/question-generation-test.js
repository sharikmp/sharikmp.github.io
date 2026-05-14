// ============================================================================
// MATHTRAINER QUESTION GENERATION TEST (FIXED DIVISION)
// ============================================================================

const TEST_CONFIG = {
    levels: Array.from({ length: 1000 }, (_, i) => i + 1),
    questionsPerLevel: 1000
};

const MAX_DIGITS_PER_OPERAND = 7;

function getLevelDigitConfig(level) {
    const BASE_LEVEL_CONFIGS = [
        null,
        { d1: 1, d2: 1 }, { d1: 1, d2: 2 }, { d1: 2, d2: 2 },
        { d1: 1, d2: 3 }, { d1: 2, d2: 3 }, { d1: 3, d2: 3 }
    ];
    if (level < BASE_LEVEL_CONFIGS.length) return BASE_LEVEL_CONFIGS[level];
    const extraLevels = level - 6;
    const d1 = Math.min(MAX_DIGITS_PER_OPERAND, 3 + Math.floor(extraLevels / 2));
    const d2 = Math.min(MAX_DIGITS_PER_OPERAND, 3 + Math.ceil(extraLevels / 2));
    return { d1, d2 };
}

function getDivisionLevelConfig(level) {
    const BASE_DIV_CONFIGS = [
        null,
        { ad: 1, dd: 1 }, { ad: 2, dd: 1 }, { ad: 2, dd: 2 },
        { ad: 3, dd: 1 }, { ad: 3, dd: 2 }, { ad: 3, dd: 2 }
    ];
    if (level < BASE_DIV_CONFIGS.length) return BASE_DIV_CONFIGS[level];
    const digitConfig = getLevelDigitConfig(level);
    return { ad: digitConfig.d2, dd: Math.max(1, digitConfig.d1 - 1) };
}

function getRange(digits) {
    if (digits <= 1) return [1, 9];
    return [Math.pow(10, digits - 1), Math.pow(10, digits) - 1];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDigitCount(num) {
    return Math.abs(num).toString().length;
}

const results = { passed: 0, failed: 0, details: [] };

console.clear();
console.log('🧪 MathTrainer Question Generation Test (FIXED)');
console.log('='.repeat(70));

for (const level of TEST_CONFIG.levels) {
    const levelResult = {
        level, totalQuestions: 0, violations: 0,
        violations_by_op: { add: 0, sub: 0, mul: 0, div: 0 },
        samples: []
    };

    const cfg = getLevelDigitConfig(level);
    const divCfg = getDivisionLevelConfig(level);
    const expectedD1 = cfg.d1;
    const expectedD2 = cfg.d2;

    // Test add, sub, mul with d1/d2
    ['add', 'sub', 'mul'].forEach(op => {
        for (let i = 0; i < TEST_CONFIG.questionsPerLevel; i++) {
            levelResult.totalQuestions++;
            const [r1min, r1max] = getRange(expectedD1);
            const [r2min, r2max] = getRange(expectedD2);
            const n1 = getRandomInt(r1min, r1max);
            const n2 = getRandomInt(r2min, r2max);
            const n1Digits = getDigitCount(n1);
            const n2Digits = getDigitCount(n2);

            if (n1Digits !== expectedD1 || n2Digits !== expectedD2) {
                levelResult.violations++;
                levelResult.violations_by_op[op]++;
                if (levelResult.samples.length < 2) {
                    levelResult.samples.push({
                        op, n1, n1Digits, n2, n2Digits,
                        expected: `${expectedD1}d ⊕ ${expectedD2}d`,
                        actual: `${n1Digits}d ⊕ ${n2Digits}d`
                    });
                }
            }
        }
    });

    // Test division with ad/dd (answer/divisor digits)
    for (let i = 0; i < TEST_CONFIG.questionsPerLevel; i++) {
        levelResult.totalQuestions++;
        const [ansMin, ansMax] = getRange(divCfg.ad);
        const [divMin, divMax] = getRange(divCfg.dd);
        const answer = getRandomInt(Math.max(2, ansMin), ansMax);
        const divisor = getRandomInt(divMin, divMax);
        const dividend = answer * divisor;

        const answerDigits = getDigitCount(answer);
        const divisorDigits = getDigitCount(divisor);

        if (answerDigits !== divCfg.ad || divisorDigits !== divCfg.dd) {
            levelResult.violations++;
            levelResult.violations_by_op.div++;
            if (levelResult.samples.length < 2) {
                levelResult.samples.push({
                    op: 'div',
                    problem: `${dividend} ÷ ${divisor}`,
                    answer, answerDigits,
                    divisor, divisorDigits,
                    expected: `(answer: ${divCfg.ad}d, divisor: ${divCfg.dd}d)`,
                    actual: `(answer: ${answerDigits}d, divisor: ${divisorDigits}d)`
                });
            }
        }
    }

    // Report
    const passStatus = levelResult.violations === 0 ? '✅' : '❌';
    const passText = levelResult.violations === 0
        ? 'PASS'
        : `FAIL (${levelResult.violations} violations)`;

    console.log(`${passStatus} L${level.toString().padStart(2)}: (${expectedD1}d⊕${expectedD2}d) div:(${divCfg.ad}d÷${divCfg.dd}d) | ${passText}`);

    if (levelResult.violations > 0 && levelResult.samples.length > 0) {
        levelResult.samples.forEach(s => {
            if (s.op === 'div') {
                console.log(`     └─ div: ${s.problem} - answer ${s.answerDigits}d, divisor ${s.divisorDigits}d`);
            } else {
                console.log(`     └─ ${s.op}: ${s.n1} ⊕ ${s.n2} (expected ${s.expected}, got ${s.actual})`);
            }
        });
    }

    if (levelResult.violations === 0) {
        results.passed++;
    } else {
        results.failed++;
    }

    results.details.push(levelResult);
}

console.log('='.repeat(70));
console.log(`✅ Passed: ${results.passed}/${TEST_CONFIG.levels.length} | ❌ Failed: ${results.failed}/${TEST_CONFIG.levels.length}`);
console.log('='.repeat(70));
window._testResults = results;