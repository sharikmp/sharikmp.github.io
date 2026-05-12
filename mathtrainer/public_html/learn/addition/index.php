<?php
/**
 * public_html/learn/addition/index.php
 * Topic: Addition — Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Addition — Animate, Read & Practice | MathTrainer',
    'description' => 'Learn addition with animated visuals, lesson notes and unlimited graded practice with badges.',
    'canonical'   => url('learn/addition/'),
    'og_title'    => 'Learn Addition | MathTrainer',
    'og_desc'     => 'Master addition: visual animation, column method, strategies and graded practice.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('learn/learn.css') ?>">
    <style>
        :root { --op-color:#00ff80; --op-glow:rgba(0,255,128,0.22); --op-faint:rgba(0,255,128,0.07); --primary-accent:#d4af37; }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:inline-flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.6rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(0,255,128,0.08); border:1px solid rgba(0,255,128,0.25); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--op-color); margin-bottom:1rem; }
        .section-badge.gold { background:rgba(212,175,55,0.1); border-color:rgba(212,175,55,0.28); color:var(--primary-accent); }
        .definition-box { background:rgba(0,255,128,0.05); border-left:3px solid var(--op-color); border-radius:0 12px 12px 0; padding:12px 16px; margin:0.8rem 0; font-size:0.88rem; color:rgba(255,255,255,0.82); line-height:1.6; }
        .term-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin:0.8rem 0; }
        .term-box { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 10px; text-align:center; }
        .term-label { font-size:0.68rem; font-weight:600; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:4px; }
        .term-value { font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--op-color); }
        .term-name  { font-size:0.72rem; color:rgba(255,255,255,0.45); margin-top:3px; }
        .strategy-item { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .strategy-item:last-child { border-bottom:none; }
        .strategy-num { width:32px; height:32px; border-radius:10px; background:rgba(0,255,128,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:800; flex-shrink:0; }
        .strategy-text strong { display:block; color:#fff; font-size:0.88rem; margin-bottom:3px; }
        .strategy-text span { font-size:0.82rem; color:rgba(255,255,255,0.5); line-height:1.5; }
        .column-add { display:inline-grid; grid-template-columns:repeat(4,36px); gap:4px; font-family:'Space Grotesk',sans-serif; font-size:1rem; font-weight:700; margin:0.8rem auto; }
        .ca-cell { height:36px; border-radius:8px; display:flex; align-items:center; justify-content:center; }
        .ca-label { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.4); font-size:0.7rem; font-weight:600; }
        .ca-num { background:rgba(255,255,255,0.06); color:#fff; }
        .ca-result { background:rgba(0,255,128,0.12); color:var(--op-color); }
        .ca-carry { background:rgba(212,175,55,0.12); color:var(--primary-accent); font-size:0.76rem; }
        .ca-sep { grid-column:1/-1; border-bottom:1px solid rgba(255,255,255,0.2); margin:2px 0; }
        .prop-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; }
        .prop-row:last-child { border-bottom:none; }
        .prop-badge { background:rgba(0,255,128,0.08); border:1px solid rgba(0,255,128,0.22); border-radius:8px; padding:3px 10px; font-family:'Space Grotesk',sans-serif; font-size:0.75rem; font-weight:700; color:var(--op-color); white-space:nowrap; flex-shrink:0; }
        .btn-gold-page { background:linear-gradient(135deg,var(--primary-accent),#b8901b); color:#000; font-family:'Space Grotesk',sans-serif; font-weight:800; border:none; border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:2px; font-size:0.95rem; box-shadow:0 0 20px rgba(212,175,55,0.4); text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all 0.3s; }
        .btn-gold-page:hover { transform:scale(1.04); box-shadow:0 0 30px rgba(212,175,55,0.7); color:#000; }
        .btn-outline-page { background:transparent; color:rgba(255,255,255,0.65); border:1px solid rgba(255,255,255,0.2); border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:1.5px; font-size:0.9rem; font-family:'Space Grotesk',sans-serif; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:7px; transition:all 0.2s; }
    </style>
</head>
<body>
<canvas id="bg-canvas"></canvas>
<div id="page-content">
<div class="container" style="max-width:660px;">

<?php $nav_back_url=url('learn/'); $nav_back_label='Learn'; require_once PATH_INCLUDES.'/navbar.php'; ?>

<!-- Hero -->
<div class="text-center mb-4">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:var(--op-faint);border:1px solid var(--op-glow);font-size:1.6rem;color:var(--op-color);margin-bottom:1rem;"><i class="fas fa-plus"></i></div>
    <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">Addition</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">Terms · Strategies · Column Method · Practice</p>
</div>

<!-- Tab Bar -->
<div class="learn-tabs" role="tablist">
    <button class="learn-tab active" data-tab="tab-animate"><i class="fas fa-play-circle"></i> Animate</button>
    <button class="learn-tab" data-tab="tab-read"><i class="fas fa-book-open"></i> Read</button>
    <button class="learn-tab" data-tab="tab-practice"><i class="fas fa-pencil-alt"></i> Practice</button>
</div>

<!-- ██ ANIMATE TAB ██ -->
<div id="tab-animate" class="learn-tab-panel active">
<div class="page-card op-addition">
    <div class="anim-stage" id="anim-stage">
        <div class="anim-row" id="anim-row-a"></div>
        <div class="anim-sep">+</div>
        <div class="anim-row" id="anim-row-b"></div>
        <div class="anim-sep" id="anim-eq-sep" style="opacity:0;transition:opacity .4s">=</div>
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

<div class="page-card op-addition">
    <div class="section-badge"><i class="fas fa-circle-info"></i> What is Addition?</div>
    <div class="definition-box"><strong>Addition</strong> combines numbers to find a <strong style="color:var(--op-color);">total (sum)</strong>. Symbol: <strong style="color:var(--op-color);">+</strong></div>
    <div class="term-grid">
        <div class="term-box"><div class="term-label">First</div><div class="term-value">8</div><div class="term-name">Addend</div></div>
        <div class="term-box"><div class="term-label">Second</div><div class="term-value">5</div><div class="term-name">Addend</div></div>
        <div class="term-box" style="border-color:rgba(0,255,128,0.28);background:rgba(0,255,128,0.06);"><div class="term-label">Result</div><div class="term-value">13</div><div class="term-name">Sum</div></div>
    </div>
</div>

<div class="page-card op-addition">
    <div class="section-badge"><i class="fas fa-brain"></i> Mental Strategies</div>
    <?php foreach([
        ['Count On',       'Start from the bigger number and count up. 7+3: start at 7, count 8,9,10.'],
        ['Make 10',        'Break a number to reach 10 first. 8+6 → (8+2)+4 = 10+4 = 14.'],
        ['Doubles',        'Memorise doubles, then adjust. 7+8 = (7+7)+1 = 14+1 = 15.'],
        ['Round & Adjust', 'Round to a nice number, then fix. 49+36 → 50+36−1 = 85.'],
    ] as $i=>[$t,$d]): ?>
    <div class="strategy-item">
        <div class="strategy-num"><?= $i+1 ?></div>
        <div class="strategy-text"><strong><?= $t ?></strong><span><?= $d ?></span></div>
    </div>
    <?php endforeach; ?>
</div>

<div class="page-card op-addition">
    <div class="section-badge gold"><i class="fas fa-arrow-up"></i> Column Addition &amp; Carrying</div>
    <p style="font-size:0.85rem;color:rgba(255,255,255,0.6);margin-bottom:1rem;line-height:1.6;">Line up digits by place value. Add <strong style="color:#fff;">right to left</strong>. When total ≥10, carry the tens digit.</p>
    <p style="font-size:0.8rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.5rem;">Example: 347 + 285</p>
    <div style="text-align:center;"><div class="column-add">
        <div class="ca-cell ca-label"></div><div class="ca-cell ca-label">H</div><div class="ca-cell ca-label">T</div><div class="ca-cell ca-label">O</div>
        <div class="ca-cell ca-carry"></div><div class="ca-cell ca-carry">1</div><div class="ca-cell ca-carry">1</div><div class="ca-cell ca-carry"></div>
        <div class="ca-cell ca-num"></div><div class="ca-cell ca-num">3</div><div class="ca-cell ca-num">4</div><div class="ca-cell ca-num">7</div>
        <div class="ca-cell ca-num" style="color:var(--op-color);">+</div><div class="ca-cell ca-num">2</div><div class="ca-cell ca-num">8</div><div class="ca-cell ca-num">5</div>
        <div class="ca-sep"></div>
        <div class="ca-cell ca-result"></div><div class="ca-cell ca-result">6</div><div class="ca-cell ca-result">3</div><div class="ca-cell ca-result">2</div>
    </div></div>
    <div class="definition-box" style="margin-top:1rem;">Ones: 7+5=12 → write 2, carry 1 | Tens: 4+8+1=13 → write 3, carry 1 | Hundreds: 3+2+1 = <strong style="color:var(--op-color);">6</strong></div>
</div>

<div class="page-card op-addition">
    <div class="section-badge"><i class="fas fa-star"></i> Properties</div>
    <?php foreach([
        ['Commutative','3+5=5+3 — order does not matter'],
        ['Associative','(2+3)+4=2+(3+4) — grouping does not matter'],
        ['Identity',   'n+0=n — adding zero changes nothing'],
    ] as [$n,$d]): ?>
    <div class="prop-row"><div class="prop-badge"><?= $n ?></div><span style="color:rgba(255,255,255,0.65);font-size:0.84rem;"><?= $d ?></span></div>
    <?php endforeach; ?>
</div>

</div><!-- /tab-read -->

<!-- ██ PRACTICE TAB ██ -->
<div id="tab-practice" class="learn-tab-panel">
    <div id="practice-addition"></div>
</div>

</div></div><!-- /container /page-content -->

<div style="position:relative;z-index:10;"><?php require_once PATH_INCLUDES.'/footer.php'; ?></div>
<?php $galaxy_mode='full'; require_once PATH_INCLUDES.'/galaxy.php'; ?>

<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'add', opColor:'#00ff80', containerId:'practice-addition' });

/* ── Addition animation ── */
(function(){
    var rowA=document.getElementById('anim-row-a'),
        rowB=document.getElementById('anim-row-b'),
        res =document.getElementById('anim-result'),
        sep =document.getElementById('anim-eq-sep'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        a,b,timers=[];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }
    function mkDot(c){ var d=document.createElement('span'); d.className='anim-dot'; d.style.background=c; return d; }

    function reset(){
        clr(); a=rand(3,8); b=rand(2,6);
        rowA.innerHTML=''; rowB.innerHTML='';
        res.style.opacity='0'; sep.style.opacity='0'; res.textContent='?';
        btnPlay.disabled=false; btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
    }

    function play(){
        btnPlay.disabled=true; btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        for(var i=0;i<a;i++){
            (function(i){ timers.push(setTimeout(function(){
                var d=mkDot('#00ff80'); rowA.appendChild(d);
                setTimeout(function(){ d.classList.add('show'); },30);
            }, i*130)); })(i);
        }
        var t2=a*130+250;
        for(var j=0;j<b;j++){
            (function(j){ timers.push(setTimeout(function(){
                var d=mkDot('#d4af37'); rowB.appendChild(d);
                setTimeout(function(){ d.classList.add('show'); },30);
            }, t2+j*130)); })(j);
        }
        timers.push(setTimeout(function(){
            sep.style.opacity='1';
            res.textContent=a+b;
            res.style.opacity='1';
            btnPlay.innerHTML='<i class="fas fa-check"></i> Done';
        }, t2+b*130+350));
    }

    btnPlay.addEventListener('click',play);
    btnNew.addEventListener('click',reset);
    reset();
})();
</script>
</body>
</html>
