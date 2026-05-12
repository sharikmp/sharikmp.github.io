<?php
/**
 * public_html/learn/division/index.php
 * Topic: Division — Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Division — Animate, Read & Practice | MathTrainer',
    'description' => 'Learn division with animated visuals, short division, remainders and unlimited graded practice.',
    'canonical'   => url('learn/division/'),
    'og_title'    => 'Learn Division | MathTrainer',
    'og_desc'     => 'Master division: visual animation, short division, remainders and graded practice.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('learn/learn.css') ?>">
    <style>
        :root { --op-color:#b464ff; --op-glow:rgba(180,100,255,0.22); --op-faint:rgba(180,100,255,0.07); --primary-accent:#d4af37; }
        .divisibility-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.84rem; }
        .divisibility-row:last-child { border-bottom:none; }
        .div-by { width:40px; height:28px; border-radius:8px; background:rgba(180,100,255,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:700; flex-shrink:0; }
    </style>
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div id="page-content">
<div class="container" style="max-width:660px;">

<?php $nav_back_url=url('learn/'); $nav_back_label='Learn'; require_once PATH_INCLUDES.'/navbar.php'; ?>

<!-- Hero -->
<div class="text-center mb-4">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:var(--op-faint);border:1px solid var(--op-glow);font-size:1.6rem;color:var(--op-color);margin-bottom:1rem;"><i class="fas fa-divide"></i></div>
    <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">Division</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">Terms · Short Division · Remainders · Practice</p>
</div>

<!-- Tab Bar -->
<div class="learn-tabs" role="tablist">
    <button class="learn-tab active" data-tab="tab-animate"><i class="fas fa-play-circle"></i> Animate</button>
    <button class="learn-tab" data-tab="tab-read"><i class="fas fa-book-open"></i> Read</button>
    <button class="learn-tab" data-tab="tab-practice"><i class="fas fa-pencil-alt"></i> Practice</button>
</div>

<!-- ██ ANIMATE TAB ██ -->
<div id="tab-animate" class="learn-tab-panel active">
<div class="page-card op-division">
    <div class="anim-stage" id="anim-stage">
        <div id="anim-groups" style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center;align-items:flex-start;min-height:80px;"></div>
        <div class="anim-sep" id="anim-label" style="font-size:0.85rem;color:rgba(255,255,255,0.45);">Press Play</div>
        <div class="anim-equation" id="anim-result" style="opacity:0;transition:opacity .4s">?</div>
    </div>
    <div class="anim-controls">
        <button class="anim-btn" id="btn-play"><i class="fas fa-play"></i> Play</button>
        <button class="anim-btn" id="btn-new"><i class="fas fa-redo"></i> New</button>
    </div>
</div>
</div>

<!-- ██ READ TAB ██ -->
<div id="tab-read" class="learn-tab-panel">

<div class="page-card op-division">
    <div class="section-badge"><i class="fas fa-circle-info"></i> What is Division?</div>
    <div class="definition-box"><strong>Division</strong> splits a number into equal groups. 12 sweets shared among 4 people — each gets <strong style="color:var(--op-color);">3</strong>. Symbol: <strong style="color:var(--op-color);">÷</strong></div>
    <div class="term-grid" style="grid-template-columns:repeat(2,1fr);">
        <div class="term-box"><div class="term-label">Number to split</div><div class="term-value">56</div><div class="term-name">Dividend</div></div>
        <div class="term-box"><div class="term-label">Split by</div><div class="term-value">8</div><div class="term-name">Divisor</div></div>
        <div class="term-box" style="border-color:rgba(180,100,255,0.28);background:rgba(180,100,255,0.06);"><div class="term-label">Answer</div><div class="term-value">7</div><div class="term-name">Quotient</div></div>
        <div class="term-box"><div class="term-label">Left over</div><div class="term-value">0</div><div class="term-name">Remainder</div></div>
    </div>
</div>

<div class="page-card op-division">
    <div class="section-badge gold"><i class="fas fa-calculator"></i> Short Division (Bus Stop)</div>
    <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">Divide from <strong style="color:#fff;">left to right</strong>, one digit at a time. Write quotient above; carry any remainder to the next digit.</p>
    <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Example: 952 ÷ 4</p>
    <div style="text-align:center;font-family:'Space Grotesk',sans-serif;">
        <div style="display:inline-block;text-align:left;">
            <div style="display:flex;gap:0;padding-left:36px;border-bottom:2px solid rgba(255,255,255,0.25);padding-bottom:4px;margin-bottom:4px;">
                <div style="width:36px;text-align:center;color:var(--op-color);font-size:1.1rem;">2</div>
                <div style="width:36px;text-align:center;color:var(--op-color);font-size:1.1rem;">3</div>
                <div style="width:36px;text-align:center;color:var(--op-color);font-size:1.1rem;">8</div>
            </div>
            <div style="display:flex;align-items:center;">
                <div style="color:var(--primary-accent);font-size:1.2rem;font-weight:800;padding-right:6px;">4</div>
                <div style="border-left:2px solid rgba(255,255,255,0.4);padding-left:6px;display:flex;gap:0;">
                    <div style="width:36px;text-align:center;font-size:1.1rem;color:#fff;">9</div>
                    <div style="width:36px;text-align:center;font-size:1.1rem;color:#fff;"><sup style="color:var(--primary-accent);font-size:0.65rem;">1</sup>5</div>
                    <div style="width:36px;text-align:center;font-size:1.1rem;color:#fff;"><sup style="color:var(--primary-accent);font-size:0.65rem;">3</sup>2</div>
                </div>
            </div>
        </div>
    </div>
    <div class="definition-box" style="margin-top:1rem;">9÷4=2 rem <strong style="color:var(--primary-accent);">1</strong> | 15÷4=3 rem <strong style="color:var(--primary-accent);">3</strong> | 32÷4 = <strong style="color:var(--op-color);">8</strong> → Answer: <strong style="color:var(--op-color);">238</strong></div>
</div>

<div class="page-card op-division">
    <div class="section-badge"><i class="fas fa-circle-half-stroke"></i> Remainders</div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.8rem;">When a number cannot be divided exactly, the leftover is the <strong style="color:#fff;">remainder</strong>.</p>
    <div class="definition-box">17÷5 = <strong style="color:var(--op-color);">3</strong> remainder <strong style="color:var(--primary-accent);">2</strong> &nbsp;<span style="color:rgba(255,255,255,0.45);font-size:0.82rem;">(5×3=15, and 17−15=2)</span></div>
    <div class="fact-row" style="margin-top:0.4rem;"><i class="fas fa-lightbulb"></i><span>The remainder is <strong style="color:#fff;">always less than the divisor</strong>. If equal or larger, divide once more.</span></div>
</div>

<div class="page-card op-division">
    <div class="section-badge"><i class="fas fa-wand-magic-sparkles"></i> Divisibility Rules</div>
    <p style="font-size:0.85rem;color:rgba(255,255,255,0.55);margin-bottom:0.8rem;">Quick ways to check divisibility without calculating:</p>
    <?php foreach([
        [2,  'Last digit is even (0,2,4,6 or 8)'],
        [3,  'Sum of all digits is divisible by 3'],
        [4,  'Last 2 digits are divisible by 4'],
        [5,  'Last digit is 0 or 5'],
        [9,  'Sum of all digits is divisible by 9'],
        [10, 'Last digit is 0'],
    ] as [$n,$rule]): ?>
    <div class="divisibility-row"><div class="div-by">÷<?= $n ?></div><span style="color:rgba(255,255,255,0.68);font-size:0.84rem;"><?= $rule ?></span></div>
    <?php endforeach; ?>
</div>

<div class="page-card op-division">
    <div class="section-badge"><i class="fas fa-arrows-rotate"></i> Division &amp; Multiplication</div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.6rem;">Division is the <strong style="color:#fff;">inverse</strong> of multiplication. One fact gives four related facts:</p>
    <div style="background:rgba(255,255,255,0.04);border-radius:14px;padding:14px;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
        <?php foreach(['6×8=48','8×6=48','48÷6=8','48÷8=6'] as $f): ?>
        <div style="background:rgba(180,100,255,0.07);border:1px solid rgba(180,100,255,0.2);border-radius:10px;padding:8px 12px;font-family:'Space Grotesk',sans-serif;font-size:0.9rem;font-weight:700;color:#fff;text-align:center;"><?= $f ?></div>
        <?php endforeach; ?>
    </div>
</div>

</div><!-- /tab-read -->

<!-- ██ PRACTICE TAB ██ -->
<div id="tab-practice" class="learn-tab-panel">
    <div id="practice-division"></div>
</div>

</div></div><!-- /container /page-content -->

<div style="position:relative;z-index:10;"><?php require_once PATH_INCLUDES.'/footer.php'; ?></div>
<?php $galaxy_mode='full'; require_once PATH_INCLUDES.'/galaxy.php'; ?>

<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'div', opColor:'#b464ff', containerId:'practice-division' });

/* ── Division animation: N dots split into equal groups that light up one by one ── */
(function(){
    var groupsEl=document.getElementById('anim-groups'),
        lbl    =document.getElementById('anim-label'),
        res    =document.getElementById('anim-result'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        dividend,divisor,quotient,timers=[];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }

    function reset(){
        clr(); divisor=rand(2,4); quotient=rand(2,5); dividend=divisor*quotient;
        groupsEl.innerHTML=''; res.style.opacity='0';
        lbl.textContent= dividend+' ÷ '+divisor+' = ?';
        btnPlay.disabled=false; btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
        /* pre-build all groups (invisible) */
        for(var g=0;g<divisor;g++){
            var grp=document.createElement('div');
            grp.style.cssText='display:flex;flex-wrap:wrap;gap:5px;pad:6px;border-radius:10px;border:1px dashed rgba(180,100,255,0.15);padding:8px;transition:border-color .3s;';
            grp.dataset.group=g;
            for(var d=0;d<quotient;d++){
                var dot=document.createElement('span');
                dot.className='anim-dot';
                dot.style.background='#b464ff';
                grp.appendChild(dot);
            }
            groupsEl.appendChild(grp);
        }
    }

    function play(){
        btnPlay.disabled=true; btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var groups=groupsEl.querySelectorAll('[data-group]');
        groups.forEach(function(grp,gi){
            timers.push(setTimeout(function(){
                grp.style.borderColor='rgba(180,100,255,0.55)';
                grp.querySelectorAll('.anim-dot').forEach(function(d,di){
                    timers.push(setTimeout(function(){ d.classList.add('show'); }, di*80));
                });
            }, gi*(quotient*80+200)));
        });
        var total=groups.length*(quotient*80+200)+200;
        timers.push(setTimeout(function(){
            lbl.textContent= dividend+' ÷ '+divisor+' =';
            res.textContent=quotient;
            res.style.opacity='1';
            btnPlay.innerHTML='<i class="fas fa-check"></i> Done';
        }, total));
    }

    btnPlay.addEventListener('click',play);
    btnNew.addEventListener('click',reset);
    reset();
})();
</script>
</body>
</html>
