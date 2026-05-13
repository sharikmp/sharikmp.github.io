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
        /* op-color-tinted overrides for this page */
        .section-badge { background:rgba(80,160,255,0.08); border:1px solid rgba(80,160,255,0.25); color:var(--op-color); }
        .definition-box { background:rgba(80,160,255,0.05); border-left:3px solid var(--op-color); }
        .strategy-num { background:rgba(80,160,255,0.1); }
        .prop-badge { background:rgba(80,160,255,0.08); border-color:rgba(80,160,255,0.22); }
        .grid-method { display:grid; grid-template-columns:auto 80px 60px; gap:4px; margin:0.8rem auto; max-width:260px; }
        .gm-cell { border-radius:10px; padding:10px; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.9rem; font-weight:700; }
        .gm-header { background:rgba(80,160,255,0.14); color:var(--op-color); }
        .gm-body { background:rgba(255,255,255,0.05); color:#fff; border:1px solid rgba(255,255,255,0.07); }
        /* ─── Multiplication two-column animation ─── */
        .mul-anim { display:grid; grid-template-columns:70px 1fr; gap:6px 20px; align-items:start; padding:0.4rem 0.2rem; width:100%; }
        .mul-num-cell { font-family:'Space Grotesk',sans-serif; font-size:2.8rem; font-weight:900; color:#fff; opacity:0; transform:scale(0.4); transition:opacity .3s,transform .35s; text-align:center; line-height:1.2; align-self:center; }
        .mul-num-cell.show { opacity:1; transform:scale(1); }
        .mul-num-cell.ans-cell { color:var(--op-color); text-shadow:0 0 22px rgba(80,160,255,0.45); font-size:3rem; }
        .mul-op-cell { font-family:'Space Grotesk',sans-serif; font-size:1.8rem; font-weight:700; color:rgba(255,255,255,0.4); opacity:0; transition:opacity .3s; text-align:center; align-self:center; }
        .mul-op-cell.show { opacity:1; }
        .mul-line-cell { padding:2px 0; align-self:center; }
        .mul-line-bar { height:3px; background:linear-gradient(90deg,rgba(80,160,255,0.55),rgba(80,160,255,0.15)); border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform .38s ease-out; }
        .mul-line-bar.show { transform:scaleX(1); }
        .mul-rows-wrap { display:flex; flex-direction:column; gap:8px; }
        .mul-apple-row { display:flex; flex-wrap:wrap; gap:5px; min-height:36px; align-items:center; }
        .mul-apple-row.answer-row { border-top:1px solid transparent; padding-top:8px; min-height:50px; transition:border-color .3s; }
        .mul-apple-row.answer-row.reveal { border-color:rgba(255,255,255,0.09); }
        .mul-row-label { font-family:'Space Grotesk',sans-serif; font-size:0.72rem; font-weight:700; color:rgba(255,255,255,0.25); margin-bottom:2px; }
        .mul-counter { grid-column:1/-1; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.4); min-height:1.4em; opacity:0; transition:opacity .3s; padding-top:4px; }
        .mul-counter.show { opacity:1; }
        .mul-apple { font-size:1.4rem; display:inline-block; opacity:0; transform:scale(0.2); transition:opacity .4s,transform .4s; }
        .mul-apple.show { opacity:1; transform:scale(1); }
        .mul-apple.going { opacity:0 !important; transform:scale(0.1) translateY(-8px) !important; transition:opacity .45s ease,transform .45s ease !important; }
        @keyframes mulArrive { 0%{opacity:0;transform:scale(0.1) translateY(-18px);} 65%{transform:scale(1.12) translateY(2px);} 100%{opacity:1;transform:scale(1) translateY(0);} }
        .mul-apple.arriving { animation:mulArrive .65s ease both; }
        .mul-empty-cell { min-height:36px; }
    </style>
</head>
<body>
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
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Multiplication is <em>repeated addition</em> &mdash; watch each group appear, then all apples merge into the product.</p>
    <div class="mul-anim" id="mul-anim">
        <!-- Row 0: numA | empty (rows will be injected here by JS) -->
        <div class="mul-num-cell" id="mul-num-a"></div>
        <div class="mul-rows-wrap" id="mul-rows-wrap"></div>

        <div class="mul-op-cell" id="mul-op">×</div>
        <div class="mul-empty-cell"></div>

        <div class="mul-num-cell" id="mul-num-b"></div>
        <div class="mul-empty-cell"></div>

        <div class="mul-line-cell"><div class="mul-line-bar" id="mul-line"></div></div>
        <div class="mul-line-cell"><div class="mul-line-bar" id="mul-line-r"></div></div>

        <div class="mul-num-cell ans-cell" id="mul-ans"></div>
        <div class="mul-apple-row answer-row" id="mul-row-ans"></div>

        <div class="mul-counter" id="mul-counter"></div>
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


<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'mul', opColor:'#50a0ff', containerId:'practice-multiplication' });

/* ── Multiplication animation: repeated-addition row layout ── */
(function(){
    var numA    = document.getElementById('mul-num-a'),
        opEl    = document.getElementById('mul-op'),
        numB    = document.getElementById('mul-num-b'),
        lineL   = document.getElementById('mul-line'),
        lineR   = document.getElementById('mul-line-r'),
        ansEl   = document.getElementById('mul-ans'),
        rowsWrap= document.getElementById('mul-rows-wrap'),
        rowAns  = document.getElementById('mul-row-ans'),
        cntEl   = document.getElementById('mul-counter'),
        btnPlay = document.getElementById('btn-play'),
        btnNew  = document.getElementById('btn-new'),
        a, b, emoji, timers=[];

    var EMOJIS = ['\uD83C\uDF4E','\uD83C\uDF4F','\uD83C\uDF4B','\uD83C\uDF47','\uD83C\uDF53'];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }
    function after(fn,ms){ var id=setTimeout(fn,ms); timers.push(id); return id; }
    function mkApple(){ var sp=document.createElement('span'); sp.className='mul-apple'; sp.textContent=emoji; return sp; }

    function resetDOM(){
        numA.className='mul-num-cell'; numA.textContent='';
        opEl.className='mul-op-cell';
        numB.className='mul-num-cell'; numB.textContent='';
        lineL.className='mul-line-bar';
        lineR.className='mul-line-bar';
        ansEl.className='mul-num-cell ans-cell'; ansEl.textContent='';
        rowsWrap.innerHTML='';
        rowAns.innerHTML=''; rowAns.classList.remove('reveal');
        cntEl.className='mul-counter'; cntEl.textContent='';
    }

    function reset(){
        clr();
        a=rand(2,9); b=rand(2,4);
        emoji=EMOJIS[rand(0,EMOJIS.length-1)];
        resetDOM();
        btnPlay.disabled=false;
        btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
    }

    function play(){
        clr(); resetDOM();
        btnPlay.disabled=true;
        btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var T=0;

        /* Step 1 — numA pops in */
        numA.textContent=a;
        after(function(){ numA.classList.add('show'); }, T+=200);
        T+=400;

        /* Step 2 — first row of A apples appears */
        /* Pre-build all b rows (hidden), reveal row 0 now, rest in step 4 */
        var rows=[];
        for(var r=0;r<b;r++){
            var rowDiv=document.createElement('div');
            rowDiv.className='mul-apple-row';
            rowDiv.style.opacity='0'; rowDiv.style.transition='opacity .35s';
            rowsWrap.appendChild(rowDiv);
            rows.push(rowDiv);
        }

        /* Show row 0 and fill its A apples */
        after((function(ri){
            return function(){
                rows[ri].style.opacity='1';
                for(var i=0;i<a;i++){
                    (function(idx){
                        after(function(){
                            var ap=mkApple(); rows[ri].appendChild(ap);
                            setTimeout(function(){ ap.classList.add('show'); },20);
                        }, idx*300);
                    })(i);
                }
            };
        })(0), T);
        T+=a*300+500;

        /* Step 3 — × sign and numB pop in */
        after(function(){ opEl.classList.add('show'); }, T);
        T+=350;
        numB.textContent=b;
        after(function(){ numB.classList.add('show'); }, T);
        T+=450;

        /* Step 4 — rows 1..b-1 appear one by one, each filling A apples */
        for(var ri=1;ri<b;ri++){
            (function(rowIdx){
                after(function(){
                    rows[rowIdx].style.opacity='1';
                    for(var i=0;i<a;i++){
                        (function(idx){
                            after(function(){
                                var ap=mkApple(); rows[rowIdx].appendChild(ap);
                                setTimeout(function(){ ap.classList.add('show'); },20);
                            }, idx*300);
                        })(i);
                    }
                }, T+(rowIdx-1)*(a*300+600));
            })(ri);
        }
        T+=(b-1)*(a*300+600)+a*300+600;

        /* Step 5 — separator line sweeps */
        after(function(){
            lineL.classList.add('show');
            setTimeout(function(){ lineR.classList.add('show'); },60);
            rowAns.classList.add('reveal');
        }, T);
        T+=700;

        /* Step 6 — all apples migrate from every row into the answer row, counted */
        after(function(){
            cntEl.classList.add('show');
            var total=a*b, count=0;
            cntEl.textContent='0 / '+total;
            var allApples=[];
            rows.forEach(function(row){ [].forEach.call(row.querySelectorAll('.mul-apple'),function(ap){ allApples.push(ap); }); });

            allApples.forEach(function(src,idx){
                after(function(){
                    src.classList.add('going');
                    after(function(){
                        var ap=mkApple(); ap.classList.add('arriving');
                        rowAns.appendChild(ap);
                        count++;
                        cntEl.textContent=count+' / '+total;
                        if(count===total){
                            after(function(){
                                ansEl.textContent=total;
                                ansEl.classList.add('show');
                                cntEl.textContent='\uD83C\uDF89 '+a+' \xD7 '+b+' = '+total;
                                btnPlay.innerHTML='<i class="fas fa-redo"></i> Replay';
                                btnPlay.disabled=false;
                            }, 600);
                        }
                    }, 450);
                }, idx*600);
            });
        }, T);
    }

    btnPlay.addEventListener('click', play);
    btnNew.addEventListener('click', function(){ reset(); play(); });
    reset();
})();
</script>
</body>
</html>
