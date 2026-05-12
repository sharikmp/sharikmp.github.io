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
    </style>
</head>
<body>
<canvas id="bg-canvas"></canvas>
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
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Place value decomposition — watch a number split into Thousands, Hundreds, Tens, Ones.</p>
    <div class="anim-stage" id="anim-stage" style="min-height:120px;flex-direction:column;gap:10px;">
        <div id="anim-number" style="font-family:'Space Grotesk',sans-serif;font-size:2.2rem;font-weight:900;color:var(--primary-accent);letter-spacing:2px;opacity:0;transition:opacity .4s;">1234</div>
        <div id="anim-blocks" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;min-height:56px;"></div>
        <div class="anim-equation" id="anim-sum" style="opacity:0;transition:opacity .4s;font-size:0.9rem;font-weight:600;color:rgba(255,255,255,0.7);"></div>
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
<?php $galaxy_mode='full'; require_once PATH_INCLUDES.'/galaxy.php'; ?>

<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'add', opColor:'#00f3ff', containerId:'practice-numbers' });

/* ── Numbers animation: reveal 4-digit number then animate place-value blocks ── */
(function(){
    var numEl  =document.getElementById('anim-number'),
        blkEl  =document.getElementById('anim-blocks'),
        sumEl  =document.getElementById('anim-sum'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        num,timers=[];

    var PLACES=[
        {label:'Thousands',mul:1000,color:'#d4af37'},
        {label:'Hundreds', mul:100, color:'#00f3ff'},
        {label:'Tens',     mul:10,  color:'#00ff80'},
        {label:'Ones',     mul:1,   color:'#ff6478'},
    ];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }

    function reset(){
        clr();
        num=rand(1000,9999);
        numEl.style.opacity='0'; numEl.textContent=num;
        blkEl.innerHTML=''; sumEl.style.opacity='0';
        btnPlay.disabled=false; btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
    }

    function play(){
        btnPlay.disabled=true; btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        /* Show big number */
        timers.push(setTimeout(function(){ numEl.style.opacity='1'; }, 200));
        /* Decompose: build blocks one by one */
        var remaining=num, delay=700, parts=[];
        PLACES.forEach(function(p,i){
            var digit=Math.floor(remaining/p.mul);
            remaining%=p.mul;
            if(digit===0 && i<3){ return; } /* skip leading zeros except ones */
            var value=digit*p.mul;
            parts.push(p.label+': '+digit+' × '+p.mul+' = <strong style="color:'+p.color+'">'+value+'</strong>');
            timers.push(setTimeout((function(d,v,pl,c){
                return function(){
                    var blk=document.createElement('div');
                    blk.style.cssText='background:rgba(255,255,255,0.04);border:1px solid '+c+';border-radius:12px;padding:10px 14px;text-align:center;font-family:Space Grotesk,sans-serif;animation:popIn .3s ease;';
                    blk.innerHTML='<div style="font-size:0.68rem;color:rgba(255,255,255,0.45);text-transform:uppercase;letter-spacing:1px;">'+pl+'</div><div style="font-size:1.3rem;font-weight:800;color:'+c+'">'+v+'</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.35);">'+d+' × '+p.mul+'</div>';
                    blkEl.appendChild(blk);
                };
            })(digit,value,p.label,c), delay));
            delay+=500;
        });
        /* Show sum equation */
        timers.push(setTimeout(function(){
            sumEl.innerHTML=parts.map(function(p){return p;}).join(' &thinsp;+&thinsp; ')+' = <strong style="color:var(--primary-accent)">'+num+'</strong>';
            sumEl.style.opacity='1';
            btnPlay.innerHTML='<i class="fas fa-check"></i> Done';
        }, delay+200));
    }

    btnPlay.addEventListener('click',play);
    btnNew.addEventListener('click',reset);
    reset();
})();
</script>
</body>
</html>
