<?php
/**
 * Hangout Hub Cafe — Admin Panel Dashboard
 */
require_once __DIR__ . '/includes/auth.php';
require_auth();

$csrf    = csrf_token();
$uname   = htmlspecialchars($_SESSION['hhc_username'], ENT_QUOTES, 'UTF-8');
$role    = $_SESSION['hhc_role'];
$isAdmin = ($role === 'admin');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HHC Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --gold: #c8a45a;
            --gold-dark: #a88640;
            --dark-bg: #050505;
            --surface: #111111;
            --surface-2: #181818;
            --border: #252525;
            --text: #ddd8c8;
            --text-muted: #777770;
            --status-pending:   #f59e0b;
            --status-confirmed: #60a5fa;
            --status-completed: #4ade80;
            --status-cancelled: #f87171;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body {
            margin: 0;
            background: var(--dark-bg);
            color: var(--text);
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
        }

        /* ── Navbar ─────────────────────────────────────────────────────── */
        .hhc-navbar {
            position: fixed; top: 0; left: 0; right: 0; z-index: 1030;
            background: #0a0a0a;
            border-bottom: 1px solid var(--border);
            display: flex; align-items: center; justify-content: space-between;
            padding: 0 1.25rem;
            height: 54px;
        }
        .navbar-brand {
            font-family: 'Cinzel', serif;
            color: var(--gold);
            font-size: 1.05rem;
            letter-spacing: 0.12em;
            text-decoration: none;
        }
        .navbar-brand span { color: var(--text-muted); font-size: 0.72em; margin-left: 4px; }
        .user-badge {
            background: var(--gold);
            color: #050505;
            font-size: 0.65rem;
            font-weight: 700;
            padding: 1px 7px;
            border-radius: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .user-badge.staff { background: #333; color: var(--text-muted); }
        .btn-logout {
            font-size: 0.78rem;
            color: var(--text-muted);
            border: 1px solid var(--border);
            background: none;
            border-radius: 5px;
            padding: 4px 12px;
            text-decoration: none;
            transition: color .2s, border-color .2s;
        }
        .btn-logout:hover { color: var(--text); border-color: var(--text-muted); }

        /* ── Tab nav ─────────────────────────────────────────────────────── */
        .tab-bar {
            position: sticky; top: 54px; z-index: 1020;
            background: #0d0d0d;
            border-bottom: 1px solid var(--border);
            display: flex; align-items: center;
            padding: 0 1rem;
            gap: 2px;
        }
        .tab-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            padding: 0.75rem 1rem;
            font-size: 0.82rem;
            font-family: 'Montserrat', sans-serif;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            transition: color .2s, border-color .2s;
            white-space: nowrap;
        }
        .tab-btn:hover    { color: var(--text); }
        .tab-btn.active   { color: var(--gold); border-bottom-color: var(--gold); }
        .tab-btn.pos-link { color: var(--gold); margin-left: auto; font-size: 0.8rem; }
        .tab-btn.pos-link:hover { color: var(--gold-dark); }

        /* ── Tab panels ──────────────────────────────────────────────────── */
        .tab-panel { display: none; padding: 1.25rem; }
        .tab-panel.active { display: block; }

        /* ── Metric cards ────────────────────────────────────────────────── */
        .metric-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1rem 1.25rem;
        }
        .metric-label {
            font-size: 0.7rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 0.35rem;
        }
        .metric-value {
            font-size: 1.65rem;
            font-weight: 700;
            color: var(--text);
            line-height: 1;
        }
        .metric-value.gold { color: var(--gold); }

        /* ── Status chips ────────────────────────────────────────────────── */
        .chip-group { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.85rem; }
        .chip {
            font-size: 0.75rem;
            padding: 4px 12px;
            border-radius: 20px;
            border: 1px solid var(--border);
            background: none;
            color: var(--text-muted);
            cursor: pointer;
            transition: all .18s;
            font-family: inherit;
        }
        .chip:hover { color: var(--text); border-color: var(--text-muted); }
        .chip.active { background: var(--gold); border-color: var(--gold); color: #050505; font-weight: 600; }

        /* ── Orders table ────────────────────────────────────────────────── */
        .hhc-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.83rem;
        }
        .hhc-table thead th {
            background: #0d0d0d;
            color: var(--text-muted);
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            font-weight: 600;
            padding: 0.6rem 0.75rem;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }
        .hhc-table tbody tr {
            border-bottom: 1px solid var(--border);
            transition: background .15s;
        }
        .hhc-table tbody tr:hover { background: #131313; }
        .hhc-table td {
            padding: 0.6rem 0.75rem;
            vertical-align: middle;
        }
        .hhc-table .expand-row { background: #0b0b0b; }
        .hhc-table .expand-row:hover { background: #0b0b0b; }

        /* Expand btn */
        .btn-expand {
            background: none; border: none;
            color: var(--text-muted);
            padding: 0; margin-right: 6px;
            cursor: pointer;
            font-size: 0.72rem;
            transition: color .15s, transform .15s;
            vertical-align: middle;
        }
        .btn-expand:hover { color: var(--gold); }

        /* Status select */
        .status-select {
            background: #0d0d0d;
            border: 1px solid currentColor;
            border-radius: 4px;
            padding: 3px 6px;
            font-size: 0.78rem;
            font-family: inherit;
            cursor: pointer;
            outline: none;
        }
        .status-select option { background: #111; color: var(--text); }

        /* Delete btn */
        .btn-delete {
            background: none;
            border: 1px solid var(--status-cancelled);
            color: var(--status-cancelled);
            border-radius: 4px;
            padding: 3px 8px;
            font-size: 0.75rem;
            cursor: pointer;
            transition: background .15s, color .15s;
        }
        .btn-delete:hover { background: var(--status-cancelled); color: #fff; }

        /* Sub-items table */
        .items-sub { width: 100%; font-size: 0.8rem; border-collapse: collapse; }
        .items-sub th {
            color: var(--text-muted);
            font-weight: 600;
            font-size: 0.68rem;
            text-transform: uppercase;
            letter-spacing: .04em;
            padding: 0.3rem 0.5rem;
            border-bottom: 1px solid var(--border);
        }
        .items-sub td {
            padding: 0.3rem 0.5rem;
            border-bottom: 1px solid #111;
            color: var(--text-muted);
        }

        /* WA link */
        .wa-link { color: var(--gold); text-decoration: none; }
        .wa-link:hover { color: var(--gold-dark); }

        /* ── Stat cards ──────────────────────────────────────────────────── */
        .stat-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1.1rem 1.25rem;
            text-align: center;
        }
        .stat-val {
            display: block;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--gold);
            line-height: 1;
            margin-bottom: 0.3rem;
        }
        .stat-lbl {
            font-size: 0.68rem;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.06em;
        }

        /* ── Period pills ────────────────────────────────────────────────── */
        .period-group, .scope-group {
            display: flex; gap: 4px;
        }
        .period-btn, .scope-btn {
            background: none;
            border: 1px solid var(--border);
            color: var(--text-muted);
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 0.78rem;
            font-family: inherit;
            cursor: pointer;
            transition: all .18s;
        }
        .period-btn.active, .scope-btn.active {
            background: var(--gold);
            border-color: var(--gold);
            color: #050505;
            font-weight: 600;
        }
        .period-btn:not(.active):hover, .scope-btn:not(.active):hover {
            border-color: var(--text-muted);
            color: var(--text);
        }

        /* ── Bestseller card ─────────────────────────────────────────────── */
        .dark-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 1.1rem 1.25rem;
        }
        .seller-item {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.65rem 0;
            border-bottom: 1px solid var(--border);
        }
        .seller-item:last-child { border-bottom: none; }
        .rank { font-size: 1.4rem; min-width: 2rem; text-align: center; }

        /* ── Date inputs ─────────────────────────────────────────────────── */
        .hhc-input {
            background: #0a0a0a;
            border: 1px solid var(--border);
            color: var(--text);
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 0.82rem;
            font-family: inherit;
        }
        .hhc-input:focus { border-color: var(--gold); outline: none; }
        .btn-apply {
            background: none;
            border: 1px solid var(--gold);
            color: var(--gold);
            padding: 5px 16px;
            border-radius: 5px;
            font-size: 0.8rem;
            font-family: inherit;
            cursor: pointer;
            transition: background .18s, color .18s;
        }
        .btn-apply:hover { background: var(--gold); color: #050505; }

        /* ── Pagination ──────────────────────────────────────────────────── */
        .pagination .page-link {
            background: var(--surface);
            border-color: var(--border);
            color: var(--text-muted);
            font-size: 0.8rem;
        }
        .pagination .page-link:hover   { background: var(--surface-2); color: var(--text); }
        .pagination .page-item.disabled .page-link { opacity: .4; }

        /* ── Delete modal ─────────────────────────────────────────────────── */
        .hhc-modal .modal-content {
            background: var(--surface);
            border: 1px solid var(--border);
            color: var(--text);
        }
        .hhc-modal .modal-header { border-bottom-color: var(--border); }
        .hhc-modal .modal-footer { border-top-color: var(--border); }

        /* ── Misc ────────────────────────────────────────────────────────── */
        .tbl-wrap { overflow-x: auto; border-radius: 8px; border: 1px solid var(--border); }
        .loading-spinner { color: var(--text-muted); font-size: 0.85rem; }
        code { color: var(--text-muted); font-size: 0.8em; background: none; }

        @media (max-width: 768px) {
            .tab-btn { padding: 0.75rem 0.6rem; font-size: 0.75rem; }
            .metric-value { font-size: 1.35rem; }
        }
    </style>
</head>
<body>

<!-- ── Navbar ──────────────────────────────────────────────────────────────── -->
<nav class="hhc-navbar">
    <a href="#" class="navbar-brand">Hangout Hub Café <span>Panel</span></a>
    <div class="d-flex align-items-center gap-2">
        <span style="font-size:.82rem;color:var(--text-muted)">
            <i class="fas fa-user-circle me-1"></i><?= $uname ?>
        </span>
        <span class="user-badge <?= $isAdmin ? '' : 'staff' ?>"><?= ucfirst($role) ?></span>
        <a href="logout.php" class="btn-logout ms-1">
            <i class="fas fa-sign-out-alt me-1"></i>Logout
        </a>
    </div>
</nav>

<!-- ── Tab bar ─────────────────────────────────────────────────────────────── -->
<div class="tab-bar" style="margin-top:54px">
    <button class="tab-btn active" data-tab="today">
        <i class="fas fa-calendar-day me-1"></i>Today's Orders
    </button>
    <button class="tab-btn" data-tab="all">
        <i class="fas fa-list me-1"></i>All Orders
    </button>
    <button class="tab-btn" data-tab="stats">
        <i class="fas fa-chart-bar me-1"></i>Stats
    </button>
    <a href="pos/" target="_blank" class="tab-btn pos-link">
        <i class="fas fa-cash-register me-1"></i>Open POS ↗
    </a>
</div>

<!-- ── Tab panels ──────────────────────────────────────────────────────────── -->

<!-- ─── Today's Orders ────────────────────────────────────────────────────── -->
<div class="tab-panel active" id="panel-today">

    <!-- Metrics -->
    <div class="row g-3 mb-3">
        <div class="col-4">
            <div class="metric-card">
                <div class="metric-label"><i class="fas fa-receipt me-1"></i>Orders Today</div>
                <div class="metric-value" id="metric-orders">—</div>
            </div>
        </div>
        <div class="col-4">
            <div class="metric-card">
                <div class="metric-label"><i class="fas fa-clock me-1"></i>Pending</div>
                <div class="metric-value" id="metric-pending">—</div>
            </div>
        </div>
        <div class="col-4">
            <div class="metric-card">
                <div class="metric-label"><i class="fas fa-rupee-sign me-1"></i>Revenue</div>
                <div class="metric-value gold" id="metric-revenue">—</div>
            </div>
        </div>
    </div>

    <!-- Status filter chips -->
    <div class="chip-group">
        <button class="chip active" data-view="today" data-status="all">All</button>
        <button class="chip" data-view="today" data-status="pending">Pending</button>
        <button class="chip" data-view="today" data-status="confirmed">Confirmed</button>
        <button class="chip" data-view="today" data-status="completed">Completed</button>
        <button class="chip" data-view="today" data-status="cancelled">Cancelled</button>
    </div>

    <!-- Table -->
    <div class="tbl-wrap">
        <table class="hhc-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>WhatsApp</th>
                    <th class="text-center">Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                    <?php if ($isAdmin): ?><th></th><?php endif; ?>
                </tr>
            </thead>
            <tbody id="orders-body-today">
                <tr><td colspan="<?= $isAdmin ? 9 : 8 ?>" class="text-center py-5 loading-spinner">
                    <i class="fas fa-spinner fa-spin me-1"></i>Loading…
                </td></tr>
            </tbody>
        </table>
    </div>
    <div id="pagination-today" class="d-flex justify-content-center mt-3"></div>
</div>

<!-- ─── All Orders ─────────────────────────────────────────────────────────── -->
<div class="tab-panel" id="panel-all">

    <!-- Date range filter -->
    <div class="d-flex align-items-center flex-wrap gap-2 mb-3">
        <label style="font-size:.78rem;color:var(--text-muted)">From</label>
        <input type="date" id="filter-from" class="hhc-input">
        <label style="font-size:.78rem;color:var(--text-muted)">To</label>
        <input type="date" id="filter-to" class="hhc-input">
        <button id="btn-filter-all" class="btn-apply">Apply</button>
    </div>

    <!-- Status filter chips -->
    <div class="chip-group">
        <button class="chip active" data-view="all" data-status="all">All</button>
        <button class="chip" data-view="all" data-status="pending">Pending</button>
        <button class="chip" data-view="all" data-status="confirmed">Confirmed</button>
        <button class="chip" data-view="all" data-status="completed">Completed</button>
        <button class="chip" data-view="all" data-status="cancelled">Cancelled</button>
    </div>

    <!-- Table -->
    <div class="tbl-wrap">
        <table class="hhc-table">
            <thead>
                <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>WhatsApp</th>
                    <th class="text-center">Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                    <?php if ($isAdmin): ?><th></th><?php endif; ?>
                </tr>
            </thead>
            <tbody id="orders-body-all">
                <tr><td colspan="<?= $isAdmin ? 9 : 8 ?>" class="text-center py-5 loading-spinner">
                    <i class="fas fa-spinner fa-spin me-1"></i>Loading…
                </td></tr>
            </tbody>
        </table>
    </div>
    <div id="pagination-all" class="d-flex justify-content-center mt-3"></div>
</div>

<!-- ─── Stats ──────────────────────────────────────────────────────────────── -->
<div class="tab-panel" id="panel-stats">

    <!-- Period selector -->
    <div class="d-flex align-items-center gap-3 mb-4">
        <span style="font-size:.78rem;color:var(--text-muted)">Period:</span>
        <div class="period-group">
            <button class="period-btn active" data-period="today">Today</button>
            <button class="period-btn" data-period="week">This Week</button>
            <button class="period-btn" data-period="month">This Month</button>
        </div>
    </div>

    <!-- Summary cards -->
    <div class="row g-3 mb-4">
        <div class="col-6 col-md-3">
            <div class="stat-card">
                <span class="stat-val" id="stat-orders">—</span>
                <span class="stat-lbl">Orders</span>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="stat-card">
                <span class="stat-val" id="stat-pending">—</span>
                <span class="stat-lbl">Pending</span>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="stat-card">
                <span class="stat-val" id="stat-revenue">—</span>
                <span class="stat-lbl">Revenue</span>
            </div>
        </div>
        <div class="col-6 col-md-3">
            <div class="stat-card">
                <span class="stat-val" id="stat-avg">—</span>
                <span class="stat-lbl">Avg Order</span>
            </div>
        </div>
    </div>

    <!-- Top sellers -->
    <div class="dark-card">
        <div class="d-flex align-items-center justify-content-between mb-3">
            <h6 style="margin:0;color:var(--text);font-size:.92rem;letter-spacing:.04em">
                <i class="fas fa-fire me-1" style="color:var(--gold)"></i> Top Sellers
            </h6>
            <div class="scope-group">
                <button class="scope-btn active" data-scope="today">Today</button>
                <button class="scope-btn" data-scope="alltime">All Time</button>
            </div>
        </div>
        <div id="top-sellers">
            <p class="text-center py-3" style="color:var(--text-muted);font-size:.82rem">Loading…</p>
        </div>
    </div>
</div>

<!-- ── Delete confirm modal ─────────────────────────────────────────────────── -->
<div class="modal fade hhc-modal" id="deleteModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content">
            <div class="modal-header" style="padding:.85rem 1rem">
                <h6 class="modal-title" style="font-size:.9rem">
                    <i class="fas fa-exclamation-triangle me-1" style="color:#f59e0b"></i>Confirm Delete
                </h6>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body" style="padding:.85rem 1rem">
                <p style="margin:0;font-size:.85rem">
                    Delete order <strong id="deleteOrderNum" style="color:var(--gold)"></strong>?
                </p>
                <p style="margin:.4rem 0 0;font-size:.78rem;color:var(--text-muted)">
                    This cannot be undone.
                </p>
            </div>
            <div class="modal-footer" style="padding:.65rem 1rem;gap:.5rem">
                <button type="button" class="btn btn-sm btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-sm btn-danger" id="btn-confirm-delete">Delete</button>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
'use strict';

// ── PHP-injected constants ─────────────────────────────────────────────────
const CSRF     = '<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>';
const IS_ADMIN = <?= $isAdmin ? 'true' : 'false' ?>;
const COLS     = IS_ADMIN ? 9 : 8;

// ── Helpers ────────────────────────────────────────────────────────────────
const $id  = id => document.getElementById(id);
const esc  = s  => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const money = n => '₹' + parseFloat(n || 0).toFixed(2);
const fmtDt = iso => {
    const d = new Date(iso.replace(' ', 'T'));
    return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short' }) + ' ' +
           d.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit', hour12:true });
};

const STATUS_COLOR = {
    pending:   '#f59e0b',
    confirmed: '#60a5fa',
    completed: '#4ade80',
    cancelled: '#f87171'
};
const STATUS_LABEL = {
    pending:'Pending', confirmed:'Confirmed', completed:'Completed', cancelled:'Cancelled'
};

// ── State ──────────────────────────────────────────────────────────────────
let refreshTimer    = null;
let pendingDeleteId = null;
const state = {
    today: { status:'all', page:1 },
    all:   { status:'all', page:1 },
    stats: { period:'today', scope:'today' }
};

// ── Init ───────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupChips();
    setupStatsControls();
    setupDeleteModal();

    $id('btn-filter-all')?.addEventListener('click', () => {
        state.all.page = 1;
        loadAllOrders();
    });

    loadTodayOrders();
    startRefresh();
});

// ── Tab switching ──────────────────────────────────────────────────────────
function setupTabs() {
    document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn[data-tab]').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            $id('panel-' + btn.dataset.tab)?.classList.add('active');
            stopRefresh();
            if (btn.dataset.tab === 'today')  { loadTodayOrders(); startRefresh(); }
            if (btn.dataset.tab === 'all')    loadAllOrders();
            if (btn.dataset.tab === 'stats')  loadStats();
        });
    });
}

// ── Status filter chips ────────────────────────────────────────────────────
function setupChips() {
    document.querySelectorAll('.chip[data-view]').forEach(chip => {
        chip.addEventListener('click', () => {
            const view = chip.dataset.view;
            chip.closest('.chip-group').querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            if (view === 'today') {
                state.today.status = chip.dataset.status;
                state.today.page   = 1;
                loadTodayOrders();
            } else {
                state.all.status = chip.dataset.status;
                state.all.page   = 1;
                loadAllOrders();
            }
        });
    });
}

// ── Stats controls ─────────────────────────────────────────────────────────
function setupStatsControls() {
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.period-group').querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.stats.period = btn.dataset.period;
            loadStats();
        });
    });
    document.querySelectorAll('.scope-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.scope-group').querySelectorAll('.scope-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.stats.scope = btn.dataset.scope;
            loadStats();
        });
    });
}

// ── Delete modal ───────────────────────────────────────────────────────────
function setupDeleteModal() {
    $id('btn-confirm-delete')?.addEventListener('click', async () => {
        if (!pendingDeleteId) return;
        bootstrap.Modal.getInstance($id('deleteModal'))?.hide();
        await deleteOrder(pendingDeleteId);
        pendingDeleteId = null;
    });
}

// ── Auto-refresh ───────────────────────────────────────────────────────────
function startRefresh() {
    stopRefresh();
    refreshTimer = setInterval(loadTodayOrders, 60000);
}
function stopRefresh() {
    if (refreshTimer) { clearInterval(refreshTimer); refreshTimer = null; }
}

// ── Load Today's Orders ────────────────────────────────────────────────────
async function loadTodayOrders() {
    setTableLoading('orders-body-today');
    try {
        const [ordRes, statRes] = await Promise.all([
            apiFetch(`api/orders.php?view=today&status=${state.today.status}&page=${state.today.page}&per_page=20`),
            apiFetch('api/stats.php?period=today&scope=today')
        ]);
        if (statRes.ok)  updateMetrics(statRes.summary);
        if (ordRes.ok)   renderOrders(ordRes, 'orders-body-today', 'pagination-today', 'today');
    } catch (e) {
        setTableError('orders-body-today', 'Failed to load orders.');
    }
}

// ── Load All Orders ────────────────────────────────────────────────────────
async function loadAllOrders() {
    setTableLoading('orders-body-all');
    const from = $id('filter-from')?.value || '';
    const to   = $id('filter-to')?.value   || '';
    try {
        const data = await apiFetch(
            `api/orders.php?view=all&status=${state.all.status}&page=${state.all.page}&per_page=20&from=${from}&to=${to}`
        );
        if (data.ok) renderOrders(data, 'orders-body-all', 'pagination-all', 'all');
    } catch (e) {
        setTableError('orders-body-all', 'Failed to load orders.');
    }
}

// ── Render orders ──────────────────────────────────────────────────────────
function renderOrders(data, bodyId, paginId, view) {
    const tbody = $id(bodyId);
    if (!tbody) return;

    if (!data.orders.length) {
        tbody.innerHTML = `<tr><td colspan="${COLS}" class="text-center py-5" style="color:var(--text-muted)">No orders found.</td></tr>`;
    } else {
        tbody.innerHTML = data.orders.map(renderRow).join('');
        bindRowEvents(tbody);
    }

    // Pagination
    const el = $id(paginId);
    if (el) {
        const totalPages = Math.ceil(data.total_count / data.per_page);
        if (totalPages <= 1) {
            el.innerHTML = '';
        } else {
            const cur = data.page;
            el.innerHTML = `
                <nav><ul class="pagination pagination-sm mb-0">
                    <li class="page-item ${cur <= 1 ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-view="${view}" data-pg="${cur - 1}">‹</a>
                    </li>
                    <li class="page-item disabled">
                        <span class="page-link" style="background:var(--surface);border-color:var(--border);color:var(--text-muted)">
                            ${cur} / ${totalPages}
                        </span>
                    </li>
                    <li class="page-item ${cur >= totalPages ? 'disabled' : ''}">
                        <a class="page-link" href="#" data-view="${view}" data-pg="${cur + 1}">›</a>
                    </li>
                </ul></nav>`;
            el.querySelectorAll('[data-pg]').forEach(a => {
                a.addEventListener('click', e => {
                    e.preventDefault();
                    const pg = +a.dataset.pg;
                    if (a.dataset.view === 'today') { state.today.page = pg; loadTodayOrders(); }
                    else                             { state.all.page   = pg; loadAllOrders(); }
                });
            });
        }
    }
}

// ── Build order row HTML ───────────────────────────────────────────────────
function renderRow(o) {
    const color   = STATUS_COLOR[o.status] || '#aaa';
    const opts    = ['pending','confirmed','completed','cancelled'].map(s =>
        `<option value="${s}"${o.status === s ? ' selected' : ''}>${STATUS_LABEL[s]}</option>`
    ).join('');
    const itemsHtml = (o.items || []).map(i => `
        <tr>
            <td>${esc(i.item_name)}</td>
            <td>${esc(i.variant_label)}</td>
            <td>${i.quantity}</td>
            <td>${money(i.unit_price)}</td>
            <td style="color:var(--gold)">${money(i.subtotal)}</td>
        </tr>`).join('');
    const delCell = IS_ADMIN
        ? `<td><button class="btn-delete" data-order-id="${o.id}" data-order-num="${esc(o.order_number)}">
               <i class="fas fa-trash-alt"></i>
           </button></td>`
        : '';

    const typeBadge = o.order_type === 'dinein'
        ? `<span style="font-size:.65rem;background:#1a1a1a;color:#c8a45a;border:1px solid #c8a45a;border-radius:3px;padding:1px 5px;margin-left:5px;vertical-align:middle">Dine-In</span>`
        : `<span style="font-size:.65rem;background:#0d1b2a;color:#5bc0de;border:1px solid #5bc0de;border-radius:3px;padding:1px 5px;margin-left:5px;vertical-align:middle">Online</span>`;

    const payIcon = o.payment_mode === 'cash'
        ? `<span title="Cash" style="color:#a3d977;font-size:.8rem"><i class="fas fa-money-bill-wave me-1"></i>Cash</span>`
        : o.payment_mode === 'online'
        ? `<span title="Online" style="color:#5bc0de;font-size:.8rem"><i class="fas fa-qrcode me-1"></i>Online</span>`
        : `<span title="Payment pending" style="color:#f0ad4e;font-size:.8rem"><i class="fas fa-clock me-1"></i>Pending</span>`;

    return `
    <tr data-order-id="${o.id}">
        <td>
            <button class="btn-expand" data-order-id="${o.id}" title="View items">
                <i class="fas fa-chevron-right"></i>
            </button>
            <code>${esc(o.order_number)}</code>${typeBadge}
        </td>
        <td>${esc(o.customer_name)}</td>
        <td><a href="https://wa.me/${esc(o.whatsapp)}" target="_blank" class="wa-link">${esc(o.whatsapp)}</a></td>
        <td class="text-center">${o.item_count}</td>
        <td style="font-weight:600">${money(o.total_amount)}</td>
        <td>${payIcon}</td>
        <td>
            <select class="status-select" data-order-id="${o.id}" style="color:${color};border-color:${color}">
                ${opts}
            </select>
        </td>
        <td style="font-size:.8em;white-space:nowrap;color:var(--text-muted)">${fmtDt(o.created_at)}</td>
        ${delCell}
    </tr>
    <tr id="expand-${o.id}" class="expand-row" style="display:none">
        <td colspan="${COLS}" style="padding:.5rem 1rem .75rem 2.5rem">
            <table class="items-sub">
                <thead>
                    <tr><th>Item</th><th>Variant</th><th>Qty</th><th>Unit</th><th>Subtotal</th></tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>
            ${o.notes ? `<p style="margin:.4rem 0 0;font-size:.78rem;color:var(--text-muted)"><i class="fas fa-sticky-note me-1"></i>${esc(o.notes)}</p>` : ''}
        </td>
    </tr>`;
}

// ── Bind events on newly rendered rows ─────────────────────────────────────
function bindRowEvents(tbody) {
    tbody.querySelectorAll('.btn-expand').forEach(btn => {
        btn.addEventListener('click', () => {
            const expRow = $id('expand-' + btn.dataset.orderId);
            const icon   = btn.querySelector('i');
            if (!expRow) return;
            const hidden = expRow.style.display === 'none';
            expRow.style.display = hidden ? 'table-row' : 'none';
            icon.classList.toggle('fa-chevron-right', !hidden);
            icon.classList.toggle('fa-chevron-down',   hidden);
        });
    });

    tbody.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', () => updateStatus(+sel.dataset.orderId, sel.value, sel));
    });

    tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
            pendingDeleteId = +btn.dataset.orderId;
            const numEl = $id('deleteOrderNum');
            if (numEl) numEl.textContent = btn.dataset.orderNum;
            new bootstrap.Modal($id('deleteModal')).show();
        });
    });
}

// ── Update order status ────────────────────────────────────────────────────
async function updateStatus(orderId, newStatus, sel) {
    sel.disabled = true;
    try {
        const res = await apiFetch('api/orders.php', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': CSRF },
            body:    JSON.stringify({ action: 'update_status', order_id: orderId, status: newStatus })
        });
        if (!res.ok) throw new Error(res.msg || 'Update failed');
        sel.style.color       = STATUS_COLOR[newStatus];
        sel.style.borderColor = STATUS_COLOR[newStatus];
    } catch (e) {
        alert('Status update failed: ' + e.message);
        // Reload table to restore accurate state
        const activeTab = document.querySelector('.tab-btn.active')?.dataset.tab;
        if (activeTab === 'today') loadTodayOrders();
        else loadAllOrders();
    } finally {
        sel.disabled = false;
    }
}

// ── Delete order ───────────────────────────────────────────────────────────
async function deleteOrder(orderId) {
    try {
        const res = await apiFetch('api/orders.php', {
            method:  'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': CSRF },
            body:    JSON.stringify({ order_id: orderId })
        });
        if (!res.ok) throw new Error(res.msg || 'Delete failed');

        // Remove rows from DOM (both tables)
        ['orders-body-today', 'orders-body-all'].forEach(bodyId => {
            const row = $id(bodyId)?.querySelector(`tr[data-order-id="${orderId}"]`);
            if (row) {
                $id('expand-' + orderId)?.remove();
                row.remove();
            }
        });

        // Refresh metric cards
        apiFetch('api/stats.php?period=today&scope=today')
            .then(d => { if (d.ok) updateMetrics(d.summary); })
            .catch(() => {});

    } catch (e) {
        alert('Delete failed: ' + e.message);
    }
}

// ── Load stats ─────────────────────────────────────────────────────────────
async function loadStats() {
    const { period, scope } = state.stats;
    try {
        const data = await apiFetch(`api/stats.php?period=${period}&scope=${scope}`);
        if (data.ok) renderStats(data);
    } catch (e) { /* silent */ }
}

// ── Render stats ───────────────────────────────────────────────────────────
function renderStats(data) {
    const s = data.summary;
    if ($id('stat-orders'))  $id('stat-orders').textContent  = s.order_count;
    if ($id('stat-pending')) $id('stat-pending').textContent = s.pending_count;
    if ($id('stat-revenue')) $id('stat-revenue').textContent = money(s.revenue);
    if ($id('stat-avg'))     $id('stat-avg').textContent     = money(s.avg_order);

    const el = $id('top-sellers');
    if (!el) return;

    if (!data.top_sellers?.length) {
        el.innerHTML = '<p class="text-center py-4" style="color:var(--text-muted);font-size:.82rem">No data for this period.</p>';
        return;
    }

    const medals = ['🥇','🥈','🥉'];
    el.innerHTML = data.top_sellers.map((item, i) => `
        <div class="seller-item">
            <span class="rank">${medals[i] || (i + 1)}</span>
            <div style="flex:1">
                <div style="font-weight:600">${esc(item.item_name)}</div>
                <div style="font-size:.78rem;color:var(--text-muted)">${esc(item.variant_label)}</div>
            </div>
            <div style="text-align:right">
                <div style="color:var(--gold);font-weight:600">${money(item.revenue)}</div>
                <div style="font-size:.75rem;color:var(--text-muted)">${item.qty_sold} sold</div>
            </div>
        </div>`).join('');
}

// ── Update Today metric cards ──────────────────────────────────────────────
function updateMetrics(s) {
    if ($id('metric-orders'))  $id('metric-orders').textContent  = s.order_count  ?? '—';
    if ($id('metric-pending')) $id('metric-pending').textContent = s.pending_count ?? '—';
    if ($id('metric-revenue')) $id('metric-revenue').textContent = s.revenue != null ? money(s.revenue) : '—';
}

// ── Loading / error states ─────────────────────────────────────────────────
function setTableLoading(bodyId) {
    const el = $id(bodyId);
    if (el) el.innerHTML = `<tr><td colspan="${COLS}" class="text-center py-5 loading-spinner">
        <i class="fas fa-spinner fa-spin me-1"></i>Loading…</td></tr>`;
}
function setTableError(bodyId, msg) {
    const el = $id(bodyId);
    if (el) el.innerHTML = `<tr><td colspan="${COLS}" class="text-center py-4" style="color:#f87171">${esc(msg)}</td></tr>`;
}

// ── API fetch wrapper ──────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
    const res = await fetch(url, opts);
    return res.json();
}
</script>
</body>
</html>
