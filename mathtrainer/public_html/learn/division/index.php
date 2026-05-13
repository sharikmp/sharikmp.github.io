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
        /* op-color-tinted overrides */
        .section-badge { background:rgba(180,100,255,0.08); border:1px solid rgba(180,100,255,0.25); color:var(--op-color); }
        .definition-box { background:rgba(180,100,255,0.05); border-left:3px solid var(--op-color); }
        .strategy-num { background:rgba(180,100,255,0.1); }
        .prop-badge { background:rgba(180,100,255,0.08); border-color:rgba(180,100,255,0.22); }
        /* divisibility table */
        .divisibility-row { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.84rem; }
        .divisibility-row:last-child { border-bottom:none; }
        .div-by { width:40px; height:28px; border-radius:8px; background:rgba(180,100,255,0.1); color:var(--op-color); display:flex; align-items:center; justify-content:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:700; flex-shrink:0; }
        /* ─── Division two-column animation ─── */
        .div-anim { display:grid; grid-template-columns:70px 1fr; gap:6px 20px; align-items:start; padding:0.4rem 0.2rem; width:100%; }
        .div-num-cell { font-family:'Space Grotesk',sans-serif; font-size:2.8rem; font-weight:900; color:#fff; opacity:0; transform:scale(0.4); transition:opacity .3s,transform .35s; text-align:center; line-height:1.2; align-self:center; }
        .div-num-cell.show { opacity:1; transform:scale(1); }
        .div-num-cell.ans-cell { color:var(--op-color); text-shadow:0 0 22px rgba(180,100,255,0.45); font-size:3rem; }
        .div-op-cell { font-family:'Space Grotesk',sans-serif; font-size:1.8rem; font-weight:700; color:rgba(255,255,255,0.4); opacity:0; transition:opacity .3s; text-align:center; align-self:center; }
        .div-op-cell.show { opacity:1; }
        .div-line-cell { padding:2px 0; align-self:center; }
        .div-line-bar { height:3px; background:linear-gradient(90deg,rgba(180,100,255,0.55),rgba(180,100,255,0.15)); border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform .38s ease-out; }
        .div-line-bar.show { transform:scaleX(1); }
        .div-pool-row { display:flex; flex-wrap:wrap; gap:5px; min-height:36px; align-items:center; align-self:center; }
        .div-boxes-wrap { display:flex; flex-wrap:wrap; gap:8px; min-height:60px; align-items:flex-start; padding-top:4px; }
        .div-box { display:flex; flex-direction:column; align-items:center; gap:5px; border:2px dashed rgba(180,100,255,0.18); border-radius:14px; padding:8px 7px; min-width:46px; opacity:0; transform:scale(0.3); transition:opacity .35s,transform .4s,border-color .3s; }
        .div-box.show { opacity:1; transform:scale(1); }
        .div-box-apples { display:flex; flex-wrap:wrap; gap:3px; justify-content:center; min-height:26px; }
        .div-box-count { font-family:'Space Grotesk',sans-serif; font-size:0.78rem; font-weight:700; color:var(--op-color); min-height:1.1em; }
        .div-counter { grid-column:1/-1; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.4); min-height:1.4em; opacity:0; transition:opacity .3s; padding-top:4px; }
        .div-counter.show { opacity:1; }
        .div-apple { font-size:1.35rem; display:inline-block; opacity:0; transform:scale(0.2); transition:opacity .4s,transform .4s; }
        .div-apple.show { opacity:1; transform:scale(1); }
        .div-apple.going { opacity:0 !important; transform:scale(0.1) translateY(-8px) !important; transition:opacity .38s ease,transform .38s ease !important; }
        .div-box-apple { font-size:1.2rem; display:inline-block; }
        @keyframes divArrive { 0%{opacity:0;transform:scale(0.1) translateY(-14px);} 65%{transform:scale(1.15) translateY(2px);} 100%{opacity:1;transform:scale(1) translateY(0);} }
        .div-box-apple.arriving { animation:divArrive .55s ease both; }
    </style>
</head>
<body>
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
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Watch the apples fill the pool, then share them equally into boxes &mdash; one by one, round-robin.</p>
    <div class="div-anim" id="div-anim">
        <div class="div-num-cell" id="div-num-a"></div>
        <div class="div-pool-row" id="div-pool-row"></div>

        <div class="div-op-cell" id="div-op">&divide;</div>
        <div></div>

        <div class="div-num-cell" id="div-num-b"></div>
        <div></div>

        <div class="div-line-cell"><div class="div-line-bar" id="div-line"></div></div>
        <div class="div-line-cell"><div class="div-line-bar" id="div-line-r"></div></div>

        <div class="div-num-cell ans-cell" id="div-ans"></div>
        <div class="div-boxes-wrap" id="div-boxes-wrap"></div>

        <div class="div-counter" id="div-counter"></div>
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


<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'div', opColor:'#b464ff', containerId:'practice-division' });

/* ── Division animation: pool → share into boxes ── */
(function(){
    var numA    = document.getElementById('div-num-a'),
        opEl    = document.getElementById('div-op'),
        numB    = document.getElementById('div-num-b'),
        lineL   = document.getElementById('div-line'),
        lineR   = document.getElementById('div-line-r'),
        ansEl   = document.getElementById('div-ans'),
        poolRow = document.getElementById('div-pool-row'),
        boxWrap = document.getElementById('div-boxes-wrap'),
        cntEl   = document.getElementById('div-counter'),
        btnPlay = document.getElementById('btn-play'),
        btnNew  = document.getElementById('btn-new'),
        dividend, divisor, quotient, emoji, timers=[];

    var EMOJIS=['🍎','🍏','🍋','🍇','🍓'];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }
    function after(fn,ms){ var id=setTimeout(fn,ms); timers.push(id); return id; }

    function resetDOM(){
        numA.className='div-num-cell'; numA.textContent='';
        opEl.className='div-op-cell';
        numB.className='div-num-cell'; numB.textContent='';
        lineL.className='div-line-bar';
        lineR.className='div-line-bar';
        ansEl.className='div-num-cell ans-cell'; ansEl.textContent='';
        poolRow.innerHTML=''; boxWrap.innerHTML='';
        cntEl.className='div-counter'; cntEl.textContent='';
    }

    function reset(){
        clr();
        divisor = rand(2,5);
        var minQ = Math.ceil(10/divisor), maxQ = Math.floor(20/divisor);
        quotient = rand(minQ, maxQ);
        dividend = divisor * quotient;
        emoji = EMOJIS[rand(0, EMOJIS.length-1)];
        resetDOM();
        btnPlay.disabled=false;
        btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
    }

    function play(){
        clr(); resetDOM();
        btnPlay.disabled=true;
        btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var T=0;

        /* Pre-build hidden boxes */
        var boxes=[];
        for(var g=0;g<divisor;g++){
            var box=document.createElement('div');
            box.className='div-box';
            var apArea=document.createElement('div'); apArea.className='div-box-apples';
            var badge=document.createElement('div');  badge.className='div-box-count';
            box.appendChild(apArea); box.appendChild(badge);
            boxWrap.appendChild(box);
            boxes.push({box:box, apples:apArea, count:badge, n:0});
        }

        /* Step 1 — dividend pops in */
        numA.textContent=dividend;
        after(function(){ numA.classList.add('show'); }, T+=200);
        T+=380;

        /* Step 2 — fill pool one apple at a time */
        for(var i=0;i<dividend;i++){
            (function(idx){
                after(function(){
                    var ap=document.createElement('span');
                    ap.className='div-apple'; ap.textContent=emoji;
                    poolRow.appendChild(ap);
                    setTimeout(function(){ ap.classList.add('show'); },20);
                }, T+idx*180);
            })(i);
        }
        T+=dividend*180+400;

        /* Step 3 — ÷ sign */
        after(function(){ opEl.classList.add('show'); }, T);
        T+=380;

        /* Step 4 — divisor pops in */
        numB.textContent=divisor;
        after(function(){ numB.classList.add('show'); }, T);
        T+=480;

        /* Step 5 — line sweeps */
        after(function(){
            lineL.classList.add('show');
            setTimeout(function(){ lineR.classList.add('show'); },60);
        }, T);
        T+=700;

        /* Step 6 — boxes appear one by one */
        for(var b=0;b<divisor;b++){
            (function(bi){
                after(function(){ boxes[bi].box.classList.add('show'); }, T+bi*320);
            })(b);
        }
        T+=divisor*320+500;

        /* Step 7 — share round-robin in to boxes */
        after(function(){
            cntEl.classList.add('show');
            cntEl.textContent='Sharing out…';
            var poolApples=[].slice.call(poolRow.querySelectorAll('.div-apple'));

            poolApples.forEach(function(src,idx){
                after(function(){
                    var bi=idx % divisor;
                    var bx=boxes[bi];
                    src.classList.add('going');
                    after(function(){
                        var ap=document.createElement('span');
                        ap.className='div-box-apple arriving'; ap.textContent=emoji;
                        bx.apples.appendChild(ap);
                        bx.n++;
                        bx.count.textContent=bx.n;
                        bx.box.style.borderColor='rgba(180,100,255,0.75)';
                        setTimeout(function(){ bx.box.style.borderColor='rgba(180,100,255,0.35)'; },380);
                    }, 360);
                }, idx*360);
            });

            /* Step 8 — reveal answer */
            after(function(){
                ansEl.textContent=quotient;
                ansEl.classList.add('show');
                cntEl.textContent='🎉 '+dividend+' ÷ '+divisor+' = '+quotient;
                boxes.forEach(function(bx){ bx.box.style.borderColor='rgba(180,100,255,0.65)'; });
                btnPlay.innerHTML='<i class="fas fa-redo"></i> Replay';
                btnPlay.disabled=false;
            }, dividend*360+700);
        }, T);
    }

    btnPlay.addEventListener('click', play);
    btnNew.addEventListener('click', function(){ reset(); play(); });
    reset();
})();
</script>
</body>
</html>
