<?php
/**
 * public_html/learn/addition/index.php
 * Topic: Addition - Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Learn Addition - Animate, Read & Practice | MathTrainer',
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
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 3rem; min-height:100vh; }
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
        .prop-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:0.85rem; }
        .prop-row:last-child { border-bottom:none; }
        .prop-badge { background:rgba(0,255,128,0.08); border:1px solid rgba(0,255,128,0.22); border-radius:8px; padding:3px 10px; font-family:'Space Grotesk',sans-serif; font-size:0.75rem; font-weight:700; color:var(--op-color); white-space:nowrap; flex-shrink:0; }
        .btn-gold-page { background:linear-gradient(135deg,var(--primary-accent),#b8901b); color:#000; font-family:'Space Grotesk',sans-serif; font-weight:800; border:none; border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:2px; font-size:0.95rem; box-shadow:0 0 20px rgba(212,175,55,0.4); text-decoration:none; display:inline-flex; align-items:center; gap:8px; transition:all 0.3s; }
        .btn-gold-page:hover { transform:scale(1.04); box-shadow:0 0 30px rgba(212,175,55,0.7); color:#000; }
        .btn-outline-page { background:transparent; color:rgba(255,255,255,0.65); border:1px solid rgba(255,255,255,0.2); border-radius:50px; padding:0.85rem 2rem; text-transform:uppercase; letter-spacing:1.5px; font-size:0.9rem; font-family:'Space Grotesk',sans-serif; font-weight:700; text-decoration:none; display:inline-flex; align-items:center; gap:7px; transition:all 0.2s; }
        /* ─── Addition two-column animation ─── */
        .add-anim { display:grid; grid-template-columns:70px 1fr; gap:6px 20px; align-items:center; padding:0.4rem 0.2rem; width:100%; }
        .add-num-cell { font-family:'Space Grotesk',sans-serif; font-size:2.8rem; font-weight:900; color:#fff; opacity:0; transform:scale(0.4); transition:opacity .3s,transform .35s; text-align:center; line-height:1.2; }
        .add-num-cell.show { opacity:1; transform:scale(1); }
        .add-num-cell.ans-cell { color:var(--op-color); text-shadow:0 0 22px rgba(0,255,128,0.45); font-size:3rem; }
        .add-op-cell { font-family:'Space Grotesk',sans-serif; font-size:1.8rem; font-weight:700; color:rgba(255,255,255,0.4); opacity:0; transition:opacity .3s; text-align:center; }
        .add-op-cell.show { opacity:1; }
        .add-line-cell { padding:2px 0; }
        .add-line-bar { height:3px; background:linear-gradient(90deg,rgba(0,255,128,0.55),rgba(0,255,128,0.15)); border-radius:2px; transform:scaleX(0); transform-origin:left; transition:transform .38s ease-out; }
        .add-line-bar.show { transform:scaleX(1); }
        .add-apple-row { display:flex; flex-wrap:wrap; gap:5px; min-height:42px; align-items:center; }
        .add-apple-ans-row { border-top:1px solid transparent; padding-top:8px; min-height:50px; transition:border-color .3s; }
        .add-apple-ans-row.reveal { border-color:rgba(255,255,255,0.09); }
        .add-counter { grid-column:1/-1; text-align:center; font-family:'Space Grotesk',sans-serif; font-size:0.85rem; font-weight:600; color:rgba(255,255,255,0.4); min-height:1.4em; opacity:0; transition:opacity .3s; padding-top:4px; }
        .add-counter.show { opacity:1; }
        .add-apple { font-size:1.5rem; display:inline-block; opacity:0; transform:scale(0.2); transition:opacity 1s,transform 1s; }
        .add-apple.show { opacity:1; transform:scale(1); }
        .add-apple.going { opacity:0 !important; transform:scale(0.1) translateY(-8px) !important; transition:opacity .55s ease,transform .55s ease !important; }
        @keyframes appleArrive { 0%{opacity:0;transform:scale(0.1) translateY(-18px);} 65%{transform:scale(1.12) translateY(2px);} 100%{opacity:1;transform:scale(1) translateY(0);} }
        .add-apple.arriving { animation:appleArrive .7s ease both; }
    </style>
</head>
<body>
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
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Watch how two groups of 🍎 apples combine &mdash; count along as they merge into the sum.</p>
    <div class="add-anim" id="add-anim">
        <div class="add-num-cell" id="add-num-a"></div>
        <div class="add-apple-row" id="add-row-a"></div>

        <div class="add-op-cell" id="add-op">+</div>
        <div></div>

        <div class="add-num-cell" id="add-num-b"></div>
        <div class="add-apple-row" id="add-row-b"></div>

        <div class="add-line-cell"><div class="add-line-bar" id="add-line"></div></div>
        <div class="add-line-cell"><div class="add-line-bar" id="add-line-r"></div></div>

        <div class="add-num-cell ans-cell" id="add-ans"></div>
        <div class="add-apple-row add-apple-ans-row" id="add-row-ans"></div>

        <div class="add-counter" id="add-counter"></div>
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
        ['Commutative','3+5=5+3 - order does not matter'],
        ['Associative','(2+3)+4=2+(3+4) - grouping does not matter'],
        ['Identity',   'n+0=n - adding zero changes nothing'],
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


<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'add', opColor:'#00ff80', containerId:'practice-addition' });

/* ── Addition animation: two-column layout ── */
(function(){
    var numA  = document.getElementById('add-num-a'),
        opEl  = document.getElementById('add-op'),
        numB  = document.getElementById('add-num-b'),
        lineL = document.getElementById('add-line'),
        lineR = document.getElementById('add-line-r'),
        ansEl = document.getElementById('add-ans'),
        rowA  = document.getElementById('add-row-a'),
        rowB  = document.getElementById('add-row-b'),
        rowAns= document.getElementById('add-row-ans'),
        cntEl = document.getElementById('add-counter'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        a, b, emojiA, emojiB, timers=[];

    function rand(mn,mx){ return Math.floor(Math.random()*(mx-mn+1))+mn; }
    function clr(){ timers.forEach(clearTimeout); timers=[]; }
    function after(fn,ms){ var id=setTimeout(fn,ms); timers.push(id); return id; }
    function mkApple(emoji){ var sp=document.createElement('span'); sp.className='add-apple'; sp.textContent=emoji; return sp; }

    function resetDOM(){
        numA.className='add-num-cell'; numA.textContent='';
        opEl.className='add-op-cell';
        numB.className='add-num-cell'; numB.textContent='';
        lineL.className='add-line-bar';
        lineR.className='add-line-bar';
        ansEl.className='add-num-cell ans-cell'; ansEl.textContent='';
        rowA.innerHTML=''; rowB.innerHTML=''; rowAns.innerHTML=''; rowAns.classList.remove('reveal');
        cntEl.className='add-counter'; cntEl.textContent='';
    }

    function reset(){
        clr();
        a=rand(5,9); b=rand(5,9);
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
                }, T+idx*500);
            })(i);
        }
        T+=a*500+420;

        /* 3 – + sign fades in */
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
                }, T+idx*500);
            })(j);
        }
        T+=b*500+500;

        /* 6 – separator line sweeps in on both sides */
        after(function(){
            lineL.classList.add('show');
            setTimeout(function(){ lineR.classList.add('show'); },60);
            rowAns.classList.add('reveal');
        }, T);
        T+=700;

        /* 7 – collect: apples migrate from rows A+B into the answer row */
        after(function(){
            cntEl.classList.add('show');
            var all=[].slice.call(rowA.querySelectorAll('.add-apple'))
                      .concat([].slice.call(rowB.querySelectorAll('.add-apple')));
            var total=a+b, count=0;
            cntEl.textContent='0 / '+total;

            all.forEach(function(src,idx){
                after(function(){
                    var emoji=src.textContent;
                    src.classList.add('going');
                    after(function(){
                        var ap=mkApple(emoji);
                        ap.classList.add('arriving');
                        rowAns.appendChild(ap);
                        count++;
                        cntEl.textContent=count+' / '+total;
                        if(count===total){
                            after(function(){
                                ansEl.textContent=total;
                                ansEl.classList.add('show');
                                cntEl.textContent='\uD83C\uDF89 '+a+' + '+b+' = '+total;
                                btnPlay.innerHTML='<i class="fas fa-redo"></i> Replay';
                                btnPlay.disabled=false;
                            }, 600);
                        }
                    }, 500);
                }, idx*800);
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
