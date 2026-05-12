<?php
/**
 * public_html/learn/multiplication/index.php
 * Topic: Multiplication — Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Multiplication — Animate, Read & Practice | MathTrainer',
    'description' => 'Learn multiplication with animated visuals, lesson notes and unlimited graded practice with badges.',
    'canonical'   => url('learn/multiplication/'),
    'og_title'    => 'Learn Multiplication | MathTrainer',
    'og_desc'     => 'Master multiplication: visual animation, grid method, mental tricks and graded practice.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('learn/learn.css') ?>">
    <style>
        :root { --op-color:#50a0ff; --op-glow:rgba(80,160,255,0.22); --op-faint:rgba(80,160,255,0.07); --primary-accent:#d4af37; }
        .grid-method { display:grid; grid-template-columns:auto 80px 60px; gap:4px; margin:0.8rem auto; max-width:260px; }
        .gm-cell { border-radius:10px; padding:10px; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; }
        .gm-header { background:rgba(80,160,255,0.14); color:var(--op-color); }
        .gm-body { background:rgba(255,255,255,0.05); color:#fff; border:1px solid rgba(255,255,255,0.07); }
    </style>
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div id="page-content">
<div class="container" style="max-width:660px;">

<?php $nav_back_url=url('learn/'); $nav_back_label='Learn'; require_once PATH_INCLUDES.'/navbar.php'; ?>

<!-- Hero -->
<div class="text-center mb-4">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:var(--op-faint);border:1px solid var(--op-glow);font-size:1.6rem;color:var(--op-color);margin-bottom:1rem;"><i class="fas fa-xmark"></i></div>
    <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">Multiplication</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">Terms · Repeated Addition · Grid Method · Practice</p>
</div>

<!-- Tab Bar -->
<div class="learn-tabs" role="tablist">
    <button class="learn-tab active" data-tab="tab-animate"><i class="fas fa-play-circle"></i> Animate</button>
    <button class="learn-tab" data-tab="tab-read"><i class="fas fa-book-open"></i> Read</button>
    <button class="learn-tab" data-tab="tab-practice"><i class="fas fa-pencil-alt"></i> Practice</button>
</div>

<!-- ██ ANIMATE TAB ██ -->
<div id="tab-animate" class="learn-tab-panel active">
<div class="page-card op-multiply">
    <div class="anim-stage" id="anim-stage">
        <div id="anim-grid" style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;align-items:center;min-height:80px;"></div>
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

<div class="page-card op-multiply">
    <div class="section-badge"><i class="fas fa-circle-info"></i> What is Multiplication?</div>
    <div class="definition-box"><strong>Multiplication</strong> is fast repeated addition. 4×3 = 4+4+4 = <strong style="color:var(--op-color);">12</strong> (add 4 exactly 3 times)</div>
    <div class="term-grid">
        <div class="term-box"><div class="term-label">First</div><div class="term-value">6</div><div class="term-name">Factor</div></div>
        <div class="term-box"><div class="term-label">Second</div><div class="term-value">7</div><div class="term-name">Factor</div></div>
        <div class="term-box" style="border-color:rgba(80,160,255,0.28);background:rgba(80,160,255,0.06);"><div class="term-label">Result</div><div class="term-value">42</div><div class="term-name">Product</div></div>
    </div>
</div>

<div class="page-card op-multiply">
    <div class="section-badge"><i class="fas fa-brain"></i> Quick Mental Tricks</div>
    <?php foreach([
        ['× 2 — Double it',          'Doubling is fastest: 2×13=26 (13+13).'],
        ['× 4 — Double twice',        '4×8: double 8=16, double again=32.'],
        ['× 5 — Halve then × 10',    '5×14: half of 14=7, ×10=70.'],
        ['× 10 — Shift digits left',  'Add a zero: 6×10=60, 45×10=450.'],
        ['× 9 — Use × 10 then −',    '9×7 = 10×7−7 = 70−7 = 63.'],
        ['× 11 (2-digit)',            'Sum the two digits and put in middle: 11×13 = 1_(1+3)_3 = 143.'],
    ] as $i=>[$t,$d]): ?>
    <div class="strategy-item"><div class="strategy-num"><?= $i+1 ?></div><div class="strategy-text"><strong><?= $t ?></strong><span><?= $d ?></span></div></div>
    <?php endforeach; ?>
</div>

<div class="page-card op-multiply">
    <div class="section-badge gold"><i class="fas fa-table-cells-large"></i> Grid Method (Partitioning)</div>
    <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">Break numbers into tens and ones, multiply each part, then add. Great for 2-digit × 1-digit.</p>
    <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.5rem;">Example: 47 × 6</p>
    <div style="text-align:center;">
        <div class="grid-method">
            <div class="gm-cell gm-header">×</div><div class="gm-cell gm-header">40</div><div class="gm-cell gm-header">7</div>
            <div class="gm-cell gm-header">6</div><div class="gm-cell gm-body">240</div><div class="gm-cell gm-body">42</div>
        </div>
        <div style="margin-top:8px;font-size:0.88rem;color:rgba(255,255,255,0.65);">240 + 42 = <strong style="color:var(--primary-accent);font-size:1.1rem;">282</strong></div>
    </div>
</div>

<div class="page-card op-multiply">
    <div class="section-badge"><i class="fas fa-star"></i> Properties</div>
    <?php foreach([
        ['Commutative',  '6×7 = 7×6 — order does not matter'],
        ['Associative',  '(2×3)×4 = 2×(3×4) — grouping does not matter'],
        ['Identity',     'n×1 = n — multiplying by 1 changes nothing'],
        ['Zero',         'n×0 = 0 — multiplying by 0 always gives 0'],
        ['Distributive', '6×(4+3) = 6×4+6×3 = 42'],
    ] as [$n,$d]): ?>
    <div class="prop-row"><div class="prop-badge"><?= $n ?></div><span style="color:rgba(255,255,255,0.65);font-size:0.84rem;"><?= $d ?></span></div>
    <?php endforeach; ?>
</div>

</div><!-- /tab-read -->

<!-- ██ PRACTICE TAB ██ -->
<div id="tab-practice" class="learn-tab-panel">
    <div id="practice-multiplication"></div>
</div>

</div></div><!-- /container /page-content -->

<div style="position:relative;z-index:10;"><?php require_once PATH_INCLUDES.'/footer.php'; ?></div>
<?php $galaxy_mode='full'; require_once PATH_INCLUDES.'/galaxy.php'; ?>

<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'mul', opColor:'#50a0ff', containerId:'practice-multiplication' });

/* ── Multiplication animation: grid of dots appearing row by row ── */
(function(){
    var gridEl=document.getElementById('anim-grid'),
        lbl   =document.getElementById('anim-label'),
        res   =document.getElementById('anim-result'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        a,b,timers=[];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }

    function reset(){
        clr(); a=rand(2,5); b=rand(2,5);
        gridEl.innerHTML=''; res.style.opacity='0';
        lbl.textContent= a +' × '+ b +' = ?';
        btnPlay.disabled=false; btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
        gridEl.style.gridTemplateColumns='repeat('+b+', 28px)';
        /* pre-create invisible dots */
        for(var r=0;r<a;r++) for(var c=0;c<b;c++){
            var d=document.createElement('span');
            d.className='anim-dot';
            d.style.background='#50a0ff';
            d.dataset.row=r;
            gridEl.appendChild(d);
        }
    }

    function play(){
        btnPlay.disabled=true; btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var dots=gridEl.querySelectorAll('.anim-dot');
        dots.forEach(function(d,i){
            timers.push(setTimeout(function(){ d.classList.add('show'); }, i*80));
        });
        timers.push(setTimeout(function(){
            lbl.textContent= a +' × '+ b +' =';
            res.textContent=a*b;
            res.style.opacity='1';
            btnPlay.innerHTML='<i class="fas fa-check"></i> Done';
        }, dots.length*80+350));
    }

    btnPlay.addEventListener('click',play);
    btnNew.addEventListener('click',reset);
    reset();
})();
</script>
</body>
</html>
