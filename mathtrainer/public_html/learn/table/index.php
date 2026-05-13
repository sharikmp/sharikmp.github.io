<?php
/**
 * public_html/learn/table/index.php
 * Topic: Multiplication Tables 1-12
 * 3-tab layout: Animate | Read | Practice
 */
require_once __DIR__ . '/../../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../../includes');

$page = [
    'title'       => 'Multiplication Tables 1-12 | MathTrainer',
    'description' => 'Learn and memorise multiplication tables from 1 to 12 with tips, patterns and a full visual times table grid.',
    'canonical'   => url('learn/table/'),
    'og_title'    => 'Multiplication Tables | MathTrainer',
    'og_desc'     => 'Visual times table grid, memorable patterns and tips to master multiplication facts 1-12.',
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
    <link rel="stylesheet" href="<?= asset('learn/learn.css') ?>">
    <style>
        :root { --op-color:#d4af37; --op-glow:rgba(212,175,55,0.22); --op-faint:rgba(212,175,55,0.07); --primary-accent:#d4af37; }
        .tt-wrap { overflow-x:auto; border-radius:14px; }
        .tt-grid { border-collapse:separate; border-spacing:3px; width:100%; }
        .tt-grid th { background:rgba(212,175,55,0.15); color:var(--primary-accent); font-family:'Space Grotesk',sans-serif; font-size:0.72rem; font-weight:800; padding:7px 5px; border-radius:8px; text-align:center; min-width:32px; }
        .tt-grid td { background:rgba(255,255,255,0.04); color:rgba(255,255,255,0.72); font-size:0.78rem; padding:7px 5px; border-radius:8px; text-align:center; border:1px solid rgba(255,255,255,0.05); cursor:default; transition:background 0.15s; }
        .tt-grid td:hover { background:rgba(212,175,55,0.18); color:#fff; }
        .tt-grid td.square { background:rgba(212,175,55,0.14); color:var(--primary-accent); font-weight:700; }
        .tip-row { display:flex; align-items:flex-start; gap:12px; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:0.85rem; color:rgba(255,255,255,0.72); }
        .tip-row:last-child { border-bottom:none; }
        .tip-icon { width:34px; height:34px; border-radius:10px; background:rgba(212,175,55,0.1); color:var(--primary-accent); display:flex; align-items:center; justify-content:center; font-size:0.9rem; flex-shrink:0; }
        .tip-text strong { color:#fff; display:block; margin-bottom:2px; }
    </style>
</head>
<body>
<div id="page-content">
<div class="container" style="max-width:700px;">

<?php $nav_back_url=url('learn/'); $nav_back_label='Learn'; require_once PATH_INCLUDES.'/navbar.php'; ?>

<!-- Hero -->
<div class="text-center mb-4">
    <div style="display:inline-flex;align-items:center;justify-content:center;width:64px;height:64px;border-radius:18px;background:var(--op-faint);border:1px solid var(--op-glow);font-size:1.6rem;color:var(--op-color);margin-bottom:1rem;"><i class="fas fa-table-cells"></i></div>
    <h1 style="font-size:clamp(2rem,7vw,2.8rem);color:var(--primary-accent);text-shadow:0 0 20px rgba(212,175,55,0.4);margin-bottom:0.4rem;">Times Tables</h1>
    <p style="color:rgba(255,255,255,0.45);font-size:0.9rem;margin:0;">Multiplication facts from 1 × 1 to 12 × 12</p>
</div>

<!-- Tab Bar -->
<div class="learn-tabs" role="tablist">
    <button class="learn-tab active" data-tab="tab-animate"><i class="fas fa-play-circle"></i> Animate</button>
    <button class="learn-tab" data-tab="tab-read"><i class="fas fa-book-open"></i> Read</button>
    <button class="learn-tab" data-tab="tab-practice"><i class="fas fa-pencil-alt"></i> Practice</button>
</div>

<!-- ██ ANIMATE TAB ██ -->
<div id="tab-animate" class="learn-tab-panel active">
<div class="page-card op-multiply" style="--op-color:#d4af37;--op-glow:rgba(212,175,55,0.22);--op-faint:rgba(212,175,55,0.07);">
    <p style="font-size:0.78rem;color:rgba(255,255,255,0.4);text-align:center;margin-bottom:0.8rem;">Pick a table row — watch each cell light up one by one.</p>
    <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-bottom:1rem;">
        <label style="font-size:0.82rem;color:rgba(255,255,255,0.55);">Table of</label>
        <select id="tt-select" style="background:rgba(255,255,255,0.07);border:1px solid rgba(212,175,55,0.3);color:#fff;border-radius:10px;padding:6px 12px;font-family:'Space Grotesk',sans-serif;font-size:0.95rem;font-weight:700;-webkit-appearance:none;appearance:none;outline:none;">
            <?php for($t=2;$t<=12;$t++) echo '<option value="'.$t.'"'.($t==7?' selected':'').'>'.$t.'</option>'; ?>
        </select>
    </div>
    <div id="tt-anim-rows" style="display:flex;flex-direction:column;gap:8px;min-height:80px;"></div>
    <div class="anim-controls" style="margin-top:1rem;">
        <button class="anim-btn" id="btn-play"><i class="fas fa-play"></i> Play</button>
        <button class="anim-btn" id="btn-new"><i class="fas fa-redo"></i> Reset</button>
    </div>
</div>
</div>

<!-- ██ READ TAB ██ -->
<div id="tab-read" class="learn-tab-panel">

<div class="page-card op-multiply" style="--op-color:#d4af37;--op-glow:rgba(212,175,55,0.22);--op-faint:rgba(212,175,55,0.07);">
    <div class="section-badge"><i class="fas fa-circle-info"></i> Quick Recap</div>
    <div class="definition-box"><strong>Multiplication</strong> is repeated addition.<br>3 × 4 means "add 3 together four times" → 3 + 3 + 3 + 3 = <strong style="color:var(--primary-accent);">12</strong></div>
    <p style="font-size:0.88rem;color:rgba(255,255,255,0.6);margin:0.8rem 0 0;line-height:1.6;">Knowing your tables by heart means you can solve problems <strong style="color:#fff;">instantly</strong> without working them out each time.</p>
</div>

<div class="page-card op-multiply" style="--op-color:#d4af37;--op-glow:rgba(212,175,55,0.22);--op-faint:rgba(212,175,55,0.07);">
    <div class="section-badge gold"><i class="fas fa-grid"></i> 12 × 12 Grid</div>
    <p style="font-size:0.8rem;color:rgba(255,255,255,0.45);margin-bottom:0.8rem;"><i class="fas fa-circle-info fa-xs"></i> Hover a cell to highlight. <span style="color:var(--primary-accent);">Gold = square numbers</span>.</p>
    <div class="tt-wrap">
        <table class="tt-grid">
            <thead>
                <tr><th>×</th><?php for ($c=1;$c<=12;$c++) echo '<th>'.$c.'</th>'; ?></tr>
            </thead>
            <tbody>
                <?php for ($r=1;$r<=12;$r++): ?>
                <tr>
                    <th><?= $r ?></th>
                    <?php for ($c=1;$c<=12;$c++): $val=$r*$c; ?>
                    <td class="<?= ($r===$c)?'square':'' ?>"><?= $val ?></td>
                    <?php endfor; ?>
                </tr>
                <?php endfor; ?>
            </tbody>
        </table>
    </div>
</div>

<div class="page-card op-multiply" style="--op-color:#d4af37;--op-glow:rgba(212,175,55,0.22);--op-faint:rgba(212,175,55,0.07);">
    <div class="section-badge"><i class="fas fa-lightbulb"></i> Memorisation Tips</div>
    <?php foreach([
        ['fas fa-circle-xmark','× 1 is always the number itself','7 × 1 = 7, 15 × 1 = 15'],
        ['fas fa-circle-xmark','× 0 is always 0','Any number multiplied by 0 equals 0'],
        ['fas fa-arrow-right','× 2 — just double it','6 × 2 = 12, 9 × 2 = 18'],
        ['fas fa-hand-point-right','× 5 — ends in 0 or 5','4 × 5 = 20, 7 × 5 = 35'],
        ['fas fa-arrow-up-right-dots','× 10 — add a zero','8 × 10 = 80, 13 × 10 = 130'],
        ['fas fa-rotate','× 9 trick — fingers','Fold the Nth finger: digits left = tens, right = ones'],
        ['fas fa-shuffle','Commutative rule','6 × 7 = 7 × 6 — halves what you need to memorise!'],
    ] as [$icon,$title,$desc]): ?>
    <div class="tip-row">
        <div class="tip-icon"><i class="<?= $icon ?>"></i></div>
        <div class="tip-text"><strong><?= $title ?></strong><span style="font-size:0.82rem;color:rgba(255,255,255,0.5);"><?= $desc ?></span></div>
    </div>
    <?php endforeach; ?>
</div>

<div class="page-card op-multiply" style="--op-color:#d4af37;--op-glow:rgba(212,175,55,0.22);--op-faint:rgba(212,175,55,0.07);">
    <div class="section-badge gold"><i class="fas fa-wand-magic-sparkles"></i> Patterns to Spot</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:0.4rem;">
        <?php foreach([
            ['Square numbers','Diagonal of the grid: 1, 4, 9, 16, 25, 36…','var(--primary-accent)'],
            ['× 11 up to 9','11×2=22, 11×3=33 — digits repeat!','#00f3ff'],
            ['Even × Even','Always gives an even product','rgba(0,255,128,0.85)'],
            ['Odd × Odd','Always gives an odd product','#ff6478'],
        ] as [$t,$d,$c]): ?>
        <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:12px;">
            <div style="font-family:'Space Grotesk',sans-serif;font-size:0.85rem;font-weight:700;color:<?= $c ?>;margin-bottom:4px;"><?= $t ?></div>
            <div style="font-size:0.78rem;color:rgba(255,255,255,0.5);line-height:1.4;"><?= $d ?></div>
        </div>
        <?php endforeach; ?>
    </div>
</div>

</div><!-- /tab-read -->

<!-- ██ PRACTICE TAB ██ -->
<div id="tab-practice" class="learn-tab-panel">
    <div id="practice-table"></div>
</div>

</div></div><!-- /container /page-content -->

<div style="position:relative;z-index:10;"><?php require_once PATH_INCLUDES.'/footer.php'; ?></div>


<script src="<?= asset('learn/practice.js') ?>"></script>
<script>
initLearnTabs();
initPractice({ op:'mul', opColor:'#d4af37', containerId:'practice-table' });

/* ── Times Table animation: sweep through selected table row, cell by cell ── */
(function(){
    var rowsEl =document.getElementById('tt-anim-rows'),
        selEl  =document.getElementById('tt-select'),
        btnPlay=document.getElementById('btn-play'),
        btnNew =document.getElementById('btn-new'),
        timers =[];

    function clr(){ timers.forEach(clearTimeout); timers=[]; }

    function reset(){
        clr(); rowsEl.innerHTML='';
        btnPlay.disabled=false; btnPlay.innerHTML='<i class="fas fa-play"></i> Play';
    }

    function play(){
        clr(); rowsEl.innerHTML='';
        btnPlay.disabled=true; btnPlay.innerHTML='<i class="fas fa-spinner fa-spin"></i>';
        var t=parseInt(selEl.value,10);
        for(var i=1;i<=12;i++){
            (function(n){
                var row=document.createElement('div');
                row.style.cssText='display:flex;align-items:center;gap:10px;opacity:0;transform:translateX(-12px);transition:opacity .35s,transform .35s;font-family:Space Grotesk,sans-serif;';
                row.innerHTML='<span style="width:150px;text-align:right;font-size:0.9rem;color:rgba(255,255,255,0.45);">'+t+' × '+n+' =</span>'
                    +'<span style="font-size:1.15rem;font-weight:800;color:var(--primary-accent);">'+t*n+'</span>';
                rowsEl.appendChild(row);
                timers.push(setTimeout(function(){ row.style.opacity='1'; row.style.transform='translateX(0)'; }, n*120));
            })(i);
        }
        timers.push(setTimeout(function(){
            btnPlay.innerHTML='<i class="fas fa-check"></i> Done';
        }, 12*120+300));
    }

    selEl.addEventListener('change', reset);
    btnPlay.addEventListener('click', play);
    btnNew.addEventListener('click', reset);
    reset();
})();
</script>
</body>
</html>
