<?php
/**
 * public_html/learn/numbers/index.php
 * Topic: Numbers — counting, place value, odd/even, comparing.
 * 3-tab layout: Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Numbers — Place Value, Odd & Even | MathTrainer',
    'description' => 'Learn about numbers — counting, place value (ones, tens, hundreds), odd and even numbers, and how to compare numbers.',
    'canonical'   => url('learn/numbers/'),
    'og_title'    => 'Learn Numbers | MathTrainer',
    'og_desc'     => 'Understand numbers — place value, odd & even, comparing and ordering. Visual, easy lessons.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('learn/learn.css') ?>">
    <style>
        :root { --op-color:#00f3ff; --op-glow:rgba(0,243,255,0.22); --op-faint:rgba(0,243,255,0.07); --primary-accent:#d4af37; }
        .digit-strip { display:flex; flex-wrap:wrap; gap:8px; margin:0.6rem 0; }
        .digit-box { width:44px; height:44px; border-radius:12px; background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.3); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; color:var(--primary-accent); }
        .place-table { width:100%; border-collapse:separate; border-spacing:6px; }
        .place-table th { background:rgba(212,175,55,0.12); color:var(--primary-accent); font-family:'Space Grotesk',sans-serif; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:9px 10px; border-radius:10px; text-align:center; }
        .place-table td { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.78); font-size:0.9rem; padding:10px; border-radius:10px; text-align:center; border:1px solid rgba(255,255,255,0.07); }
        .oe-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:0.6rem; }
        .oe-card { background:rgba(255,255,255,0.04); border-radius:14px; padding:14px; border:1px solid rgba(255,255,255,0.08); }
        .oe-numbers { display:flex; flex-wrap:wrap; gap:6px; }
        .oe-num { width:34px; height:34px; border-radius:8px; display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; }
        .oe-even { background:rgba(0,243,255,0.1); color:var(--op-color); border:1px solid rgba(0,243,255,0.25); }
        .oe-odd  { background:rgba(212,175,55,0.1); color:var(--primary-accent); border:1px solid rgba(212,175,55,0.25); }
        .compare-row { display:flex; align-items:center; justify-content:center; gap:16px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:700; }
        .compare-row:last-child { border-bottom:none; }
        .compare-sym { font-size:1.3rem; color:var(--op-color); }
        /* apple counting animation */
        .anim-apple { font-size:1.6rem; opacity:0; transform:scale(0.3); transition:opacity .18s,transform .18s; display:inline-block; }
        .anim-apple.show { opacity:1; transform:scale(1); }
        /* number sequence practice */
        .np-progress { font-size:0.78rem; color:rgba(255,255,255,0.45); }
        .np-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:12px; }
        .nseq-card { background:rgba(255,255,255,0.02); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px); border:1px solid rgba(0,243,255,0.10); border-radius:16px; padding:16px; display:flex; flex-direction:column; gap:10px; transition:border-color .2s; }
        .nseq-card.solved { border-color:rgba(0,255,128,0.4); background:rgba(0,255,128,0.03); pointer-events:none; }
        .nseq-card.wrong  { border-color:rgba(255,100,120,0.5); animation:shake .4s; }
        .nseq-type { font-size:0.65rem; text-transform:uppercase; letter-spacing:1.5px; color:rgba(255,255,255,0.35); font-weight:700; }
        .nseq-row  { display:flex; align-items:center; gap:8px; flex-wrap:wrap; justify-content:center; }
        .nseq-num  { font-family:'Space Grotesk',sans-serif; font-size:1.6rem; font-weight:800; color:#fff; min-width:40px; text-align:center; }
        .nseq-arr  { font-size:1.1rem; color:rgba(255,255,255,0.22); }
        .nseq-input { width:50px; height:42px; background:rgba(255,255,255,0.06); border:1.5px solid rgba(0,243,255,0.3); border-radius:10px; color:#fff; font-family:'Space Grotesk',sans-serif; font-size:1.2rem; font-weight:800; text-align:center; outline:none; transition:border-color .2s; -moz-appearance:textfield; appearance: textfield; }
        .nseq-input::-webkit-outer-spin-button,.nseq-input::-webkit-inner-spin-button { -webkit-appearance:none; }
        .nseq-input:focus { border-color:#00f3ff; }
        .nseq-input.correct   { border-color:#00ff80; background:rgba(0,255,128,0.06); color:#00ff80; }
        .nseq-input.incorrect { border-color:#ff6478; color:#ff6478; }
        .nseq-foot { display:flex; align-items:center; gap:8px; }
        .nseq-check { background:rgba(0,243,255,0.1); border:1px solid rgba(0,243,255,0.3); color:#00f3ff; border-radius:8px; padding:5px 14px; font-size:0.8rem; font-weight:700; cursor:pointer; font-family:'Space Grotesk',sans-serif; transition:all .2s; }
        .nseq-check:hover:not(:disabled) { background:rgba(0,243,255,0.2); }
        .nseq-result { font-size:0.75rem; font-weight:700; }
        .nseq-result.ok  { color:#00ff80; }
        .nseq-result.err { color:#ff6478; }
    </style>
</head>
<body>
<div id="page-content">
<div class="container" style="max-width:660px;">

<?php $nav_back_url=url('learn/'); $nav_back_label='Learn'; require_once PATH_INCLUDES.'/navbar.php'; ?>

<!-- Hero -->
<div class="text-center mb-4">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:var(--op-faint);border:1px solid var(--op-glow);font-size:1.6rem;color:var(--op-color);margin-bottom:1rem;"><i class="fas fa-hashtag"></i></div>
    <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">Numbers</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">Counting · Place Value · Odd &amp; Even · Comparing</p>
</div>

<!-- Tab Bar -->
<div class="learn-tabs" role="tablist">
    <button class="learn-tab active" data-tab="tab-animate"><i class="fas fa-play-circle"></i> Animate</button>
    <button class="learn-tab" data-tab="tab-read"><i class="fas fa-book-open"></i> Read</button>
    <button class="learn-tab" data-tab="tab-practice"><i class="fas fa-pencil-alt"></i> Practice</button>
</div>

<!-- ██ ANIMATE TAB ██ -->
<div id="tab-animate" class="learn-tab-panel active">
<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Press <strong style="color:var(--op-color);">Play</strong> to count 1–10 one by one · tap <strong style="color:var(--primary-accent);">New</strong> for a random number 1–20.</p>
    <div class="anim-stage" id="anim-stage" style="min-height:180px;flex-direction:column;gap:8px;">
        <div id="anim-number" style="font-family:'Space Grotesk',sans-serif;font-size:5rem;font-weight:900;color:var(--primary-accent);letter-spacing:4px;opacity:0;transition:opacity .4s;line-height:1;">8</div>
        <div id="anim-apples" style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;margin-top:6px;min-height:40px;"></div>
        <div id="anim-counter" style="font-size:0.85rem;color:rgba(255,255,255,0.4);min-height:1.3em;text-align:center;">Press Play</div>
    </div>
    <div class="anim-controls">
        <button class="anim-btn" id="btn-play"><i class="fas fa-play"></i> Play</button>
        <button class="anim-btn" id="btn-new"><i class="fas fa-redo"></i> New</button>
    </div>
</div>
</div>

<!-- ██ READ TAB ██ -->
<div id="tab-read" class="learn-tab-panel">

<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <div class="section-badge"><i class="fas fa-circle-info"></i> The 10 Digits</div>
    <p style="font-size:0.9rem;color:rgba(255,255,255,0.72);line-height:1.65;margin-bottom:1rem;">Every number in the world is written using just <strong style="color:#fff;">10 digits</strong>. Combine them in different ways to make any number you need.</p>
    <div class="digit-strip">
        <?php for ($i = 0; $i <= 9; $i++): ?>
        <div class="digit-box"><?= $i ?></div>
        <?php endfor; ?>
    </div>
    <div class="definition-box">A <strong>digit</strong> is a single symbol used to represent a number. The digits 0–9 are the building blocks of our number system.</div>
</div>

<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <div class="section-badge gold"><i class="fas fa-arrows-left-right"></i> Number Line</div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.8rem;">Numbers increase as you move right and decrease as you move left.</p>
    <div style="display:flex;align-items:center;gap:0;overflow-x:auto;padding:0.6rem 0;">
        <?php for ($i = 0; $i <= 10; $i++): ?>
            <div style="display:flex;flex-direction:column;align-items:center;min-width:36px;">
                <div style="font-family:'Space Grotesk',sans-serif;font-size:0.82rem;font-weight:700;color:rgba(255,255,255,0.7);"><?= $i ?></div>
                <div style="width:10px;height:10px;border-radius:50%;background:var(--primary-accent);margin:4px 0;box-shadow:0 0 6px rgba(212,175,55,0.5);"></div>
            </div>
            <?php if ($i < 10): ?><div style="flex:1;height:2px;background:rgba(212,175,55,0.3);min-width:20px;"></div><?php endif; ?>
        <?php endfor; ?>
    </div>
    <div class="fact-row" style="margin-top:0.6rem;"><i class="fas fa-lightbulb"></i><span>The further right on the number line, the <strong style="color:#fff;">bigger</strong> the number. Negative numbers go to the left of 0.</span></div>
</div>

<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <div class="section-badge"><i class="fas fa-layer-group"></i> Place Value</div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:1rem;">The <strong style="color:#fff;">position</strong> of a digit tells you its value. The number <strong style="color:var(--primary-accent);">4,537</strong> breaks down like this:</p>
    <table class="place-table">
        <thead><tr><th>Thousands</th><th>Hundreds</th><th>Tens</th><th>Ones</th></tr></thead>
        <tbody>
            <tr>
                <td>4 × 1,000<br><small style="color:var(--primary-accent);font-weight:700;">= 4,000</small></td>
                <td>5 × 100<br><small style="color:var(--primary-accent);font-weight:700;">= 500</small></td>
                <td>3 × 10<br><small style="color:var(--primary-accent);font-weight:700;">= 30</small></td>
                <td>7 × 1<br><small style="color:var(--primary-accent);font-weight:700;">= 7</small></td>
            </tr>
        </tbody>
    </table>
    <div class="definition-box" style="margin-top:1rem;">4,000 + 500 + 30 + 7 = <strong style="color:var(--primary-accent);">4,537</strong></div>
</div>

<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <div class="section-badge"><i class="fas fa-circle-half-stroke"></i> Odd &amp; Even</div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);line-height:1.6;margin-bottom:0.8rem;">Every whole number is either <strong style="color:var(--op-color);">even</strong> (divisible by 2) or <strong style="color:var(--primary-accent);">odd</strong> (not divisible by 2).</p>
    <div class="oe-grid">
        <div class="oe-card">
            <h4 style="color:var(--op-color);font-size:0.85rem;margin:0 0 8px;"><i class="fas fa-circle-half-stroke"></i> Even Numbers</h4>
            <div class="oe-numbers"><?php foreach ([0,2,4,6,8,10,12,14] as $n): ?><div class="oe-num oe-even"><?= $n ?></div><?php endforeach; ?></div>
            <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin:8px 0 0;">End in 0, 2, 4, 6 or 8</p>
        </div>
        <div class="oe-card">
            <h4 style="color:var(--primary-accent);font-size:0.85rem;margin:0 0 8px;"><i class="fas fa-circle"></i> Odd Numbers</h4>
            <div class="oe-numbers"><?php foreach ([1,3,5,7,9,11,13,15] as $n): ?><div class="oe-num oe-odd"><?= $n ?></div><?php endforeach; ?></div>
            <p style="font-size:0.75rem;color:rgba(255,255,255,0.45);margin:8px 0 0;">End in 1, 3, 5, 7 or 9</p>
        </div>
    </div>
</div>

<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <div class="section-badge gold"><i class="fas fa-scale-balanced"></i> Comparing Numbers</div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.65);margin-bottom:0.8rem;">Use these symbols to compare two numbers:</p>
    <div class="definition-box" style="margin-bottom:1rem;">
        <strong style="color:var(--op-color);">&lt;</strong> Less than &nbsp;|&nbsp;
        <strong style="color:var(--primary-accent);">&gt;</strong> Greater than &nbsp;|&nbsp;
        <strong style="color:#fff;">=</strong> Equal to
    </div>
    <div class="compare-row"><span>25</span><span class="compare-sym">&lt;</span><span>40</span><span style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-left:8px;">25 is less than 40</span></div>
    <div class="compare-row"><span>99</span><span class="compare-sym" style="color:var(--primary-accent);">&gt;</span><span>56</span><span style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-left:8px;">99 is greater than 56</span></div>
    <div class="compare-row"><span>7 × 6</span><span class="compare-sym" style="color:#fff;">=</span><span>42</span><span style="font-size:0.78rem;color:rgba(255,255,255,0.4);margin-left:8px;">Both equal 42</span></div>
</div>

<div class="page-card op-division" style="--op-color:#00f3ff;--op-glow:rgba(0,243,255,0.22);--op-faint:rgba(0,243,255,0.07);">
    <div class="section-badge"><i class="fas fa-star"></i> Key Facts</div>
    <?php foreach([
        ['fas fa-circle-check','0 is the smallest whole number (and it is even).'],
        ['fas fa-circle-check','There is no largest number — numbers go on forever (∞).'],
        ['fas fa-circle-check','Adding any number to 0 leaves it unchanged: n + 0 = n.'],
        ['fas fa-circle-check','Multiplying by 10 shifts every digit one place to the left.'],
        ['fas fa-circle-check','A number with more digits is always larger (e.g. 100 > 99).'],
    ] as [$icon,$text]): ?>
    <div class="fact-row"><i class="<?= $icon ?>"></i><span><?= $text ?></span></div>
    <?php endforeach; ?>
</div>

</div><!-- /tab-read -->

<!-- ██ PRACTICE TAB ██ -->
<div id="tab-practice" class="learn-tab-panel">
    <div id="practice-numbers"></div>
</div>

</div></div><!-- /container /page-content -->

<div style="position:relative;z-index:10;"><?php require_once PATH_INCLUDES.'/footer.php'; ?></div>


<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();

/* ── Numbers animation: Play = 1→10 sequence · New = random 1-20 ── */
(function(){
    var numEl    = document.getElementById('anim-number'),
        applesEl = document.getElementById('anim-apples'),
        cntEl    = document.getElementById('anim-counter'),
        btnPlay  = document.getElementById('btn-play'),
        btnNew   = document.getElementById('btn-new'),
        timers   = [];

    function rand(mn, mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers = []; }
    function setBtns(pd, nd){
        btnPlay.disabled = pd;
        btnNew.disabled  = nd;
    }

    /* Show N apples one by one; calls onDone() after last apple + short pause */
    function animApples(n, onDone){
        applesEl.innerHTML = '';
        for(var i = 0; i < n; i++){
            var sp = document.createElement('span');
            sp.className = 'anim-apple'; sp.textContent = '\uD83C\uDF4E';
            applesEl.appendChild(sp);
        }
        cntEl.textContent = '0 / ' + n;
        var nodes = applesEl.querySelectorAll('.anim-apple');
        for(var j = 0; j < n; j++){
            (function(idx, node){
                timers.push(setTimeout(function(){
                    node.classList.add('show');
                    cntEl.textContent = (idx+1) + ' / ' + n;
                }, idx * 130));
            })(j, nodes[j]);
        }
        timers.push(setTimeout(onDone, (n > 0 ? (n-1)*130 : 0) + 650));
    }

    /* Play button — animate 1 through 10 sequentially */
    function seqFrom(n){
        if(n > 10){
            cntEl.textContent = '\uD83C\uDF89 1 to 10 done!';
            btnPlay.innerHTML = '<i class="fas fa-redo"></i> Replay';
            setBtns(false, false);
            return;
        }
        numEl.textContent = n;
        numEl.style.opacity = '1';
        animApples(n, function(){
            numEl.style.opacity = '0';
            timers.push(setTimeout(function(){ seqFrom(n+1); }, 250));
        });
    }

    btnPlay.addEventListener('click', function(){
        clr();
        setBtns(true, true);
        btnPlay.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Playing…';
        numEl.style.opacity = '0';
        applesEl.innerHTML = ''; cntEl.textContent = '';
        timers.push(setTimeout(function(){ seqFrom(1); }, 300));
    });

    /* New button — pick random number 1-20, show it, auto-count */
    btnNew.addEventListener('click', function(){
        clr();
        var n = rand(1, 20);
        setBtns(true, true);
        btnNew.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        applesEl.innerHTML = ''; cntEl.textContent = '';
        numEl.textContent = n; numEl.style.opacity = '0';
        timers.push(setTimeout(function(){
            numEl.style.opacity = '1';
            timers.push(setTimeout(function(){
                animApples(n, function(){
                    cntEl.textContent = '\uD83C\uDF89 That\'s ' + n + '!';
                    btnNew.innerHTML = '<i class="fas fa-redo"></i> New';
                    setBtns(false, false);
                });
            }, 400));
        }, 300));
    });

    /* Initial state */
    btnPlay.innerHTML = '<i class="fas fa-play"></i> Play 1\u201310';
    numEl.style.opacity = '0';
    cntEl.textContent = 'Play counts 1\u201310 \u00b7 New picks a random number';
})();

/* ── Numbers practice: sequence puzzles (before / after) ── */
(function(){
    var BADGES_KEY='mt_badges_numbers';
    var cont=document.getElementById('practice-numbers');
    if(!cont) return;

    var LEVEL_CFG=[
        null,
        {types:['after'],                               mn:1, mx:40},
        {types:['before'],                              mn:2, mx:41},
        {types:['2after'],                              mn:1, mx:38},
        {types:['2before'],                             mn:3, mx:42},
        {types:['after','before','2after','2before'],   mn:2, mx:38}
    ];
    var TYPE_LABELS={
        'after':  'What comes after?',
        'before': 'What comes before?',
        '2after': 'Fill 2 numbers after',
        '2before':'Fill 2 numbers before'
    };
    var LEVEL_NAMES=['','After','Before','2 After','2 Before','Mix'];

    var curLv=1;
    var batches=[null,[],[],[],[],[]];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function storedBadges(){ return parseInt(localStorage.getItem(BADGES_KEY)||'0',10); }
    function addBadge(){ localStorage.setItem(BADGES_KEY,storedBadges()+1); }

    function genQ(lv){
        var c=LEVEL_CFG[lv];
        var type=c.types[Math.floor(Math.random()*c.types.length)];
        var base=rand(c.mn,c.mx), answers;
        if(type==='after')   answers=[base+1];
        if(type==='before')  answers=[base-1];
        if(type==='2after')  answers=[base+1,base+2];
        if(type==='2before') answers=[base-2,base-1];
        return {type:type,base:base,answers:answers};
    }

    function seqHTML(q){
        var N=function(v){return '<span class="nseq-num">'+v+'</span>';};
        var A=function(){return '<span class="nseq-arr">\u2192</span>';};
        var I=function(i){return '<input class="nseq-input" data-idx="'+i+'" type="number" placeholder="?" autocomplete="off" inputmode="numeric">';};
        var p;
        if(q.type==='after')        p=[N(q.base),A(),I(0)];
        else if(q.type==='before')  p=[I(0),A(),N(q.base)];
        else if(q.type==='2after')  p=[N(q.base),A(),I(0),A(),I(1)];
        else                        p=[I(0),A(),I(1),A(),N(q.base)];
        return '<div class="nseq-row">'+p.join('')+'</div>';
    }

    function makeCard(q){
        var div=document.createElement('div');
        div.className='nseq-card';
        div.innerHTML=
            '<div class="nseq-type">'+TYPE_LABELS[q.type]+'</div>'+
            seqHTML(q)+
            '<div class="nseq-foot">'+
            '<button class="nseq-check">Check</button>'+
            '<span class="nseq-result"></span>'+
            '</div>';
        div.querySelectorAll('.nseq-input').forEach(function(inp){
            inp.addEventListener('keydown',function(e){ if(e.key==='Enter') doCheck(div,q); });
        });
        div.querySelector('.nseq-check').addEventListener('click',function(){ doCheck(div,q); });
        return div;
    }

    function doCheck(div,q){
        if(div.classList.contains('solved')) return;
        var inputs=div.querySelectorAll('.nseq-input'), ok=true;
        inputs.forEach(function(inp,i){
            var val=parseInt(inp.value,10), good=(!isNaN(val))&&(val===q.answers[i]);
            inp.classList.toggle('correct',good);
            inp.classList.toggle('incorrect',!good);
            if(!good) ok=false;
        });
        var res=div.querySelector('.nseq-result');
        if(ok){
            div.classList.add('solved');
            div.querySelector('.nseq-check').disabled=true;
            res.className='nseq-result ok'; res.textContent='\u2713 Correct!';
            if(curLv===5){ addBadge(); refreshBadges(); }
            updateProg();
            checkDone();
        } else {
            div.classList.add('wrong');
            setTimeout(function(){ div.classList.remove('wrong'); },500);
            res.className='nseq-result err'; res.textContent='\u2717 Try again';
        }
    }

    function solvedCount(){
        var n=0;
        batches[curLv].forEach(function(item){ if(item.div.classList.contains('solved')) n++; });
        return n;
    }

    function updateProg(){
        var el=cont.querySelector('.np-progress');
        if(el) el.textContent=solvedCount()+' / '+batches[curLv].length+' solved';
    }

    function checkDone(){
        if(solvedCount()===batches[curLv].length){
            var lmr=cont.querySelector('.load-more-row');
            if(lmr) lmr.classList.add('visible');
        }
    }

    function addMore(n){
        var grid=cont.querySelector('.np-grid');
        for(var i=0;i<n;i++){
            var q=genQ(curLv);
            var div=makeCard(q);
            batches[curLv].push({q:q,div:div});
            grid.appendChild(div);
        }
        cont.querySelector('.load-more-row').classList.remove('visible');
        updateProg();
    }

    function renderLevel(){
        var grid=cont.querySelector('.np-grid');
        grid.innerHTML='';
        cont.querySelector('.load-more-row').classList.remove('visible');
        if(batches[curLv].length===0){
            for(var i=0;i<10;i++){
                var q=genQ(curLv);
                batches[curLv].push({q:q,div:makeCard(q)});
            }
        }
        batches[curLv].forEach(function(item){ grid.appendChild(item.div); });
        /* update level subtitle */
        var sub=cont.querySelector('.np-lv-sub');
        if(sub) sub.textContent=LEVEL_NAMES[curLv];
        updateProg();
        checkDone();
    }

    function switchLevel(lv){
        curLv=lv;
        cont.querySelectorAll('.level-pill').forEach(function(p,i){
            p.classList.toggle('active',i+1===lv);
        });
        renderLevel();
    }

    function refreshBadges(){
        var total=storedBadges();
        var REQS=[20,50,100];
        cont.querySelectorAll('.badge-card').forEach(function(bc,i){
            bc.classList.toggle('earned',total>=REQS[i]);
            var br=bc.querySelector('.badge-req');
            if(br) br.textContent=total+' / '+REQS[i]+' (L5)';
        });
    }

    /* Build HTML */
    cont.innerHTML=
        '<div class="practice-header">'+
        '<div style="display:flex;gap:8px;flex-wrap:wrap;">'+
        [1,2,3,4,5].map(function(lv){
            return '<button class="level-pill'+(lv===1?' active':'')+' has-tooltip" data-lv="'+lv+'" title="'+LEVEL_NAMES[lv]+'">L'+lv+'</button>';
        }).join('')+
        '<span class="np-lv-sub" style="font-size:0.75rem;color:rgba(255,255,255,0.35);align-self:center;margin-left:4px;">'+LEVEL_NAMES[1]+'</span>'+
        '</div>'+
        '<div class="np-progress">0 / 10 solved</div>'+
        '</div>'+
        '<div class="np-grid"></div>'+
        '<div class="load-more-row"><button class="btn-load-more">Load 10 more</button></div>'+
        '<div class="badges-section" style="margin-top:1.5rem;">'+
        '<div class="section-badge" style="margin-bottom:0.8rem;"><i class="fas fa-medal"></i> Level 5 Badges</div>'+
        '<div class="badges-grid">'+
        [['\uD83E\uDD49','Bronze',20],['\uD83E\uDD48','Silver',50],['\uD83E\uDD47','Gold',100]].map(function(b){
            return '<div class="badge-card"><div class="badge-icon">'+b[0]+'</div><div class="badge-name">'+b[1]+'</div><div class="badge-req">0 / '+b[2]+' (L5)</div></div>';
        }).join('')+
        '</div></div>';

    cont.querySelectorAll('.level-pill').forEach(function(p){
        p.addEventListener('click',function(){ switchLevel(parseInt(p.dataset.lv,10)); });
    });
    cont.querySelector('.btn-load-more').addEventListener('click',function(){ addMore(10); });

    renderLevel();
    refreshBadges();
})();

</script>
</body>
</html>
