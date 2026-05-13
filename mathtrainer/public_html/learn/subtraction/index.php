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
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; }
        /* ─── Two-column subtraction animation ─── */
        .sub-anim { display:grid; grid-template-columns:70px 1fr; gap:6px 20px; align-items:center; padding:0.4rem 0.2rem; width:100%; }
        .sub-num-cell { font-family:'Space Grotesk',sans-serif; font-size:2.8rem; font-weight:900; color:#fff; opacity:0; transform:scale(0.4); transition:opacity .3s,transform .35s; text-align:center; line-height:1.2; }
        .sub-num-cell.show { opacity:1; transform:scale(1); }
        .sub-num-cell.ans-cell { color:var(--op-color); text-shadow:0 0 22px rgba(255,100,120,0.45); font-size:3rem; }
        .sub-op-cell { font-family:'Space Grotesk',sans-serif; font-size:1.8rem; font-weight:700; color:rgba(255,255,255,0.4); opacity:0; transition:opacity .3s; text-align:center; }
        .sub-op-cell.show { opacity:1; }
        .sub-line-cell { padding:2px 0; }
        .sub-line-bar { height:3px; background:linear-gradient(90deg,rgba(255,100,120,0.55),rgba(255,100,120,0.15)); border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform .38s ease-out; }
        .sub-line-bar.show { transform:scaleX(1); }
        .sub-apple-row { display:flex; flex-wrap:wrap; gap:5px; min-height:42px; align-items:center; }
        .sub-apple-ans-row { border-top:1px solid transparent; padding-top:8px; min-height:50px; transition:border-color .3s; }
        .sub-apple-ans-row.reveal { border-color:rgba(255,255,255,0.09); }
        .sub-counter { grid-column:1/-1; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.4); min-height:1.4em; opacity:0; transition:opacity .3s; padding-top:4px; }
        .sub-counter.show { opacity:1; }
        .sub-apple { font-size:1.5rem; display:inline-block; opacity:0; transform:scale(0.2); transition:opacity .4s,transform .4s; }
        .sub-apple.show { opacity:1; transform:scale(1); }
        .sub-apple.going { opacity:0 !important; transform:scale(0.1) translateY(-8px) !important; transition:opacity .4s ease,transform .4s ease !important; }
        @keyframes subArrive { 0%{opacity:0;transform:scale(0.1) translateY(-18px);} 65%{transform:scale(1.12) translateY(2px);} 100%{opacity:1;transform:scale(1) translateY(0);} }
        .sub-apple.arriving { animation:subArrive .65s ease both; }
        @keyframes subSlideDown { 0%{opacity:1;transform:translateY(0);} 80%{opacity:0;} 100%{opacity:0;transform:translateY(56px);} }
        @keyframes subSlideUp   { 0%{opacity:1;transform:translateY(0);} 80%{opacity:0;} 100%{opacity:0;transform:translateY(-56px);} }
        .sub-apple.cancel-down { animation:subSlideDown .65s ease-in both; pointer-events:none; }
        .sub-apple.cancel-up   { animation:subSlideUp   .65s ease-in both; pointer-events:none; }
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
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Watch the apples cancel each other out &mdash; survivors move to the answer row.</p>
    <div class="sub-anim" id="sub-anim">
        <div class="sub-num-cell" id="sub-num-a"></div>
        <div class="sub-apple-row" id="sub-row-a"></div>

        <div class="sub-op-cell" id="sub-op">−</div>
        <div></div>

        <div class="sub-num-cell" id="sub-num-b"></div>
        <div class="sub-apple-row" id="sub-row-b"></div>

        <div class="sub-line-cell"><div class="sub-line-bar" id="sub-line"></div></div>
        <div class="sub-line-cell"><div class="sub-line-bar" id="sub-line-r"></div></div>

        <div class="sub-num-cell ans-cell" id="sub-ans"></div>
        <div class="sub-apple-row sub-apple-ans-row" id="sub-row-ans"></div>

        <div class="sub-counter" id="sub-counter"></div>
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

/* ── Subtraction animation: two-column layout ── */
(function(){
    var numA  = document.getElementById('sub-num-a'),
        opEl  = document.getElementById('sub-op'),
        numB  = document.getElementById('sub-num-b'),
        lineL = document.getElementById('sub-line'),
        lineR = document.getElementById('sub-line-r'),
        ansEl = document.getElementById('sub-ans'),
        rowA  = document.getElementById('sub-row-a'),
        rowB  = document.getElementById('sub-row-b'),
        rowAns= document.getElementById('sub-row-ans'),
        cntEl = document.getElementById('sub-counter'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        a, b, emojiA, emojiB, timers=[];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }
    function after(fn,ms){ var id=setTimeout(fn,ms); timers.push(id); return id; }
    function mkApple(emoji){ var sp=document.createElement('span'); sp.className='sub-apple'; sp.textContent=emoji; return sp; }

    function resetDOM(){
        numA.className='sub-num-cell'; numA.textContent='';
        opEl.className='sub-op-cell';
        numB.className='sub-num-cell'; numB.textContent='';
        lineL.className='sub-line-bar';
        lineR.className='sub-line-bar';
        ansEl.className='sub-num-cell ans-cell'; ansEl.textContent='';
        rowA.innerHTML=''; rowB.innerHTML=''; rowAns.innerHTML=''; rowAns.classList.remove('reveal');
        cntEl.className='sub-counter'; cntEl.textContent='';
    }

    function reset(){
        clr();
        a=rand(6,9); b=rand(2,a-2);
        emojiA=Math.random()<0.5 ? '\uD83C\uDF4E' : '\uD83C\uDF4F';
        emojiB=emojiA==='\uD83C\uDF4E' ? '\uD83C\uDF4F' : '\uD83C\uDF4E';
        resetDOM();
        btnPlay.disabled=false;
        btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
    }

    function play(){
        clr(); resetDOM();
        btnPlay.disabled=true;
        btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var T=0;

        /* 1 – number A pops in */
        numA.textContent=a;
        after(function(){ numA.classList.add('show'); }, T+=200);

        /* 2 – A apples appear one by one */
        T+=480;
        for(var i=0;i<a;i++){
            (function(idx){
                after(function(){
                    var ap=mkApple(emojiA); rowA.appendChild(ap);
                    setTimeout(function(){ ap.classList.add('show'); },20);
                }, T+idx*400);
            })(i);
        }
        T+=a*400+420;

        /* 3 – minus sign fades in */
        after(function(){ opEl.classList.add('show'); }, T);
        T+=380;

        /* 4 – number B pops in */
        numB.textContent=b;
        after(function(){ numB.classList.add('show'); }, T);
        T+=480;

        /* 5 – B apples appear one by one */
        for(var j=0;j<b;j++){
            (function(idx){
                after(function(){
                    var ap=mkApple(emojiB); rowB.appendChild(ap);
                    setTimeout(function(){ ap.classList.add('show'); },20);
                }, T+idx*400);
            })(j);
        }
        T+=b*400+500;

        /* 6 – separator line sweeps in */
        after(function(){
            lineL.classList.add('show');
            setTimeout(function(){ lineR.classList.add('show'); },60);
            rowAns.classList.add('reveal');
        }, T);
        T+=700;

        /* 7 – cancellation: front A slides down, front B slides up — they vanish toward each other */
        after(function(){
            cntEl.classList.add('show');
            cntEl.textContent='Cancelling…';
            var applesA=[].slice.call(rowA.querySelectorAll('.sub-apple'));
            var applesB=[].slice.call(rowB.querySelectorAll('.sub-apple'));

            for(var k=0;k<b;k++){
                (function(idx){
                    after(function(){
                        applesA[idx].classList.add('cancel-down');
                        applesB[idx].classList.add('cancel-up');
                    }, idx*800);
                })(k);
            }

            /* 8 – after all cancellations, move surviving A apples to answer row */
            after(function(){
                var applesA2=[].slice.call(rowA.querySelectorAll('.sub-apple'));
                var diff=a-b, count=0;
                cntEl.textContent='0 / '+diff;

                applesA2.slice(b).forEach(function(src,idx){
                    after(function(){
                        src.classList.add('going');
                        after(function(){
                            var ap=mkApple(emojiA);
                            ap.classList.add('arriving');
                            rowAns.appendChild(ap);
                            count++;
                            cntEl.textContent=count+' / '+diff;
                            if(count===diff){
                                after(function(){
                                    ansEl.textContent=diff;
                                    ansEl.classList.add('show');
                                    cntEl.textContent='\uD83C\uDF89 '+a+' \u2212 '+b+' = '+diff;
                                    btnPlay.innerHTML='<i class="fas fa-redo"></i> Replay';
                                    btnPlay.disabled=false;
                                }, 600);
                            }
                        }, 450);
                    }, idx*700);
                });
            }, b*800+800);

        }, T);
    }

    btnPlay.addEventListener('click', play);
    btnNew.addEventListener('click', function(){ reset(); play(); });
    reset();
})();
</script>
</body>
</html>
