<?php
/**
 * public_html/learn/subtraction/index.php
 * Topic: Subtraction — Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Subtraction — Animate, Read & Practice | MathTrainer',
    'description' => 'Learn subtraction with animated visuals, lesson notes and unlimited graded practice with badges.',
    'canonical'   => url('learn/subtraction/'),
    'og_title'    => 'Learn Subtraction | MathTrainer',
    'og_desc'     => 'Master subtraction: visual animation, borrowing, strategies and graded practice.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('learn/learn.css') ?>">
    <style>
        :root { --op-color:#ff6478; --op-glow:rgba(255,100,120,0.22); --op-faint:rgba(255,100,120,0.07); --primary-accent:#d4af37; }
    </style>
</head>
<body>
<div id="page-content">
<div class="container" style="max-width:660px;">

<?php $nav_back_url=url('learn/'); $nav_back_label='Learn'; require_once PATH_INCLUDES.'/navbar.php'; ?>

<!-- Hero -->
<div class="text-center mb-4">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:var(--op-faint);border:1px solid var(--op-glow);font-size:1.6rem;color:var(--op-color);margin-bottom:1rem;"><i class="fas fa-minus"></i></div>
    <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">Subtraction</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">Terms · Counting Back · Borrowing · Practice</p>
</div>

<!-- Tab Bar -->
<div class="learn-tabs" role="tablist">
    <button class="learn-tab active" data-tab="tab-animate"><i class="fas fa-play-circle"></i> Animate</button>
    <button class="learn-tab" data-tab="tab-read"><i class="fas fa-book-open"></i> Read</button>
    <button class="learn-tab" data-tab="tab-practice"><i class="fas fa-pencil-alt"></i> Practice</button>
</div>

<!-- ██ ANIMATE TAB ██ -->
<div id="tab-animate" class="learn-tab-panel active">
<div class="page-card op-subtraction">
    <div class="anim-stage" id="anim-stage">
        <div class="anim-row" id="anim-dots"></div>
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

<div class="page-card op-subtraction">
    <div class="section-badge"><i class="fas fa-circle-info"></i> What is Subtraction?</div>
    <div class="definition-box"><strong>Subtraction</strong> finds the <strong style="color:var(--op-color);">difference</strong> between two numbers — how much is left after taking one away. Symbol: <strong style="color:var(--op-color);">−</strong></div>
    <div class="term-grid">
        <div class="term-box"><div class="term-label">Start with</div><div class="term-value">15</div><div class="term-name">Minuend</div></div>
        <div class="term-box"><div class="term-label">Take away</div><div class="term-value">6</div><div class="term-name">Subtrahend</div></div>
        <div class="term-box" style="border-color:rgba(255,100,120,0.28);background:rgba(255,100,120,0.06);"><div class="term-label">Result</div><div class="term-value">9</div><div class="term-name">Difference</div></div>
    </div>
</div>

<div class="page-card op-subtraction">
    <div class="section-badge"><i class="fas fa-brain"></i> Mental Strategies</div>
    <?php foreach([
        ['Count Back',              '14−5: start at 14, count 13,12,11,10,9.'],
        ['Number Bonds',            'Use known pairs that make 10. 10−3=7 because 3+7=10.'],
        ['Count Up (Difference)',   'Count up from smaller to larger. 52−47: count 47→52 = 5.'],
        ['Round & Adjust',          '63−29 → 63−30+1 = 34.'],
    ] as $i=>[$t,$d]): ?>
    <div class="strategy-item"><div class="strategy-num"><?= $i+1 ?></div><div class="strategy-text"><strong><?= $t ?></strong><span><?= $d ?></span></div></div>
    <?php endforeach; ?>
</div>

<div class="page-card op-subtraction">
    <div class="section-badge gold"><i class="fas fa-arrow-down"></i> Column Subtraction &amp; Borrowing</div>
    <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">Line up digits. Subtract <strong style="color:#fff;">right to left</strong>. When top digit &lt; bottom digit, <strong style="color:var(--primary-accent);">borrow</strong> 1 ten from the left column.</p>
    <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.5rem;">Example: 523 − 168</p>
    <div style="text-align:center;"><div class="column-add">
        <div class="ca-cell ca-label"></div><div class="ca-cell ca-label">H</div><div class="ca-cell ca-label">T</div><div class="ca-cell ca-label">O</div>
        <div class="ca-cell ca-carry"></div><div class="ca-cell ca-carry">4</div><div class="ca-cell ca-carry">11</div><div class="ca-cell ca-carry">13</div>
        <div class="ca-cell ca-num"></div><div class="ca-cell ca-num" style="opacity:.4;text-decoration:line-through;">5</div><div class="ca-cell ca-num" style="opacity:.4;text-decoration:line-through;">2</div><div class="ca-cell ca-num" style="opacity:.4;text-decoration:line-through;">3</div>
        <div class="ca-cell ca-num" style="color:var(--op-color);">−</div><div class="ca-cell ca-num">1</div><div class="ca-cell ca-num">6</div><div class="ca-cell ca-num">8</div>
        <div class="ca-sep"></div>
        <div class="ca-cell ca-result"></div><div class="ca-cell ca-result">3</div><div class="ca-cell ca-result">5</div><div class="ca-cell ca-result">5</div>
    </div></div>
    <div class="definition-box" style="margin-top:1rem;">Ones: 3&lt;8 → borrow: 13−8=5 | Tens: 1&lt;6 → borrow: 11−6=5 | Hundreds: 4−1 = <strong style="color:var(--op-color);">3</strong></div>
</div>

<div class="page-card op-subtraction">
    <div class="section-badge"><i class="fas fa-star"></i> Key Facts</div>
    <?php foreach([
        ['fas fa-circle-check','Subtraction is the <strong>inverse</strong> of addition: if 6+7=13 then 13−7=6.'],
        ['fas fa-circle-check','Subtracting 0 leaves a number unchanged: n−0=n.'],
        ['fas fa-circle-check','Subtracting a number from itself gives 0: n−n=0.'],
        ['fas fa-circle-check','Order matters — subtraction is <strong>not</strong> commutative: 9−3 ≠ 3−9.'],
    ] as [$ic,$tx]): ?>
    <div class="fact-row"><i class="<?= $ic ?>"></i><span><?= $tx ?></span></div>
    <?php endforeach; ?>
</div>

</div><!-- /tab-read -->

<!-- ██ PRACTICE TAB ██ -->
<div id="tab-practice" class="learn-tab-panel">
    <div id="practice-subtraction"></div>
</div>

</div></div><!-- /container /page-content -->

<div style="position:relative;z-index:10;"><?php require_once PATH_INCLUDES.'/footer.php'; ?></div>


<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'sub', opColor:'#ff6478', containerId:'practice-subtraction' });

/* ── Subtraction animation: start with A dots, cross out B one by one ── */
(function(){
    var dotsEl=document.getElementById('anim-dots'),
        lbl   =document.getElementById('anim-label'),
        res   =document.getElementById('anim-result'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        a,b,timers=[];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }

    function reset(){
        clr(); a=rand(7,12); b=rand(2,5);
        dotsEl.innerHTML=''; res.style.opacity='0';
        lbl.textContent= a +' − '+ b +' = ?';
        btnPlay.disabled=false; btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
        for(var i=0;i<a;i++){
            var d=document.createElement('span');
            d.className='anim-dot show';
            d.style.background='#ff6478';
            dotsEl.appendChild(d);
        }
    }

    function play(){
        btnPlay.disabled=true; btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var dots=dotsEl.querySelectorAll('.anim-dot');
        for(var i=0;i<b;i++){
            (function(i){ timers.push(setTimeout(function(){
                dots[dots.length-1-i].style.opacity='0.15';
                dots[dots.length-1-i].style.transform='scale(0.6)';
            }, i*180)); })(i);
        }
        timers.push(setTimeout(function(){
            lbl.textContent= a +' − '+ b +' =';
            res.textContent= a-b;
            res.style.opacity='1';
            btnPlay.innerHTML='<i class="fas fa-check"></i> Done';
        }, b*180+400));
    }

    btnPlay.addEventListener('click',play);
    btnNew.addEventListener('click',reset);
    reset();
})();
</script>
</body>
</html>
