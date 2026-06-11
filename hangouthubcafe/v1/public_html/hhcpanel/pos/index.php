<?php
require_once __DIR__ . '/../includes/auth.php';
require_auth();
$csrf = csrf_token();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Hangout Hub Café | POS</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css" rel="stylesheet">
    <!-- Html2Canvas for Image Export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>

    <style>
        /* =========================================
           CSS VARIABLES (Theme & Colors)
           ========================================= */
        :root {
            /* Chai / Coffee Theme */
            --primary-color: #5D4037;
            /* Dark Coffee */
            --primary-light: #8D6E63;
            --secondary-color: #D7CCC8;
            /* Latte */
            --accent-color: #D4A373;
            /* Warm Chai */
            --bg-color: #F8F5F2;
            /* Creamy Background */
            --surface-color: #FFFFFF;
            --text-main: #3E2723;
            --text-muted: #795548;

            /* Status Colors */
            --success-color: #2E7D32;
            --pending-color: #C62828;
            --online-color: #1565C0;
            /* Replaced UPI with Online */

            /* UI Elements */
            --radius-sm: 8px;
            --radius-md: 12px;
            --radius-lg: 20px;
            --shadow-sm: 0 2px 4px rgba(93, 64, 55, 0.05);
            --shadow-md: 0 4px 12px rgba(93, 64, 55, 0.15);

            /* Transitions */
            --transition: all 0.2s ease-in-out;
        }

        /* =========================================
           BASE STYLES & TYPOGRAPHY
           ========================================= */
        body {
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .bg-gradient-primary {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
        }

        .text-primary-theme {
            color: var(--primary-color) !important;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
            width: 6px;
            height: 6px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-color);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--primary-light);
            border-radius: 4px;
        }

        /* =========================================
           LAYOUT & COMPONENTS
           ========================================= */
        .navbar-brand {
            font-weight: 700;
            letter-spacing: 0.5px;
        }

        /* Menu Cards */
        .menu-item-card {
            background: var(--surface-color);
            border-radius: var(--radius-md);
            border: 1.5px solid var(--secondary-color);
            box-shadow: var(--shadow-sm);
            transition: var(--transition);
            cursor: pointer;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 12px;
            position: relative;
            overflow: hidden;
        }

        .menu-item-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
            opacity: 0;
            transition: opacity 0.25s ease;
        }

        .menu-item-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 24px rgba(93, 64, 55, 0.16);
            border-color: var(--accent-color);
        }

        .menu-item-card:hover::before {
            opacity: 1;
        }

        .menu-item-card.out-of-stock {
            opacity: 0.5;
            pointer-events: none;
            filter: grayscale(1);
        }

        .menu-item-card.active-in-cart {
            border-color: var(--accent-color);
            border-width: 2px;
            background: linear-gradient(145deg, rgba(212, 163, 115, 0.07), var(--surface-color));
            box-shadow: 0 0 0 3px rgba(212, 163, 115, 0.2), var(--shadow-md);
        }

        .menu-item-card.active-in-cart::before {
            opacity: 1;
        }

        .item-icon-wrapper {
            background: linear-gradient(135deg, rgba(141, 110, 99, 0.1), rgba(212, 163, 115, 0.15));
            border-radius: 10px;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--primary-color);
            flex-shrink: 0;
            transition: var(--transition);
        }

        .menu-item-card:hover .item-icon-wrapper,
        .menu-item-card.active-in-cart .item-icon-wrapper {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
        }

        .item-category-tag {
            font-size: 0.58rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.4px;
            padding: 2px 7px;
            border-radius: 20px;
            background: rgba(141, 110, 99, 0.1);
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 70%;
            width: 70%;
            text-align: center;
        }

        .item-name {
            font-size: 0.82rem;
            font-weight: 700;
            line-height: 1.35;
            color: var(--text-main);
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin: 7px 0 6px;
            min-height: 2.3em;
            flex-grow: 1;
        }

        .item-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 8px;
            border-top: 1px dashed rgba(141, 110, 99, 0.2);
            min-height: 38px;
            margin-top: auto;
        }

        .item-price {
            font-size: 1rem;
            font-weight: 800;
            color: var(--primary-color);
            letter-spacing: -0.3px;
        }

        /* Add to Cart Button */
        .btn-add-item {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            line-height: 1;
            box-shadow: 0 2px 8px rgba(93, 64, 55, 0.3);
            transition: var(--transition);
            flex-shrink: 0;
            cursor: pointer;
        }

        .btn-add-item:hover {
            transform: scale(1.15) rotate(5deg);
            box-shadow: 0 4px 14px rgba(93, 64, 55, 0.45);
        }

        /* Qty Stepper */
        .qty-stepper {
            display: flex;
            align-items: center;
            gap: 5px;
            background: white;
            border-radius: 20px;
            padding: 3px 5px;
            border: 1.5px solid var(--accent-color);
            box-shadow: 0 2px 6px rgba(212, 163, 115, 0.25);
        }

        .btn-qty {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            font-size: 14px;
            line-height: 1;
            transition: var(--transition);
            cursor: pointer;
        }

        .btn-qty-minus {
            background: rgba(141, 110, 99, 0.12);
            color: var(--primary-color);
        }

        .btn-qty-minus:hover {
            background: var(--pending-color);
            color: white;
        }

        .btn-qty-plus {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
        }

        .btn-qty-plus:hover {
            box-shadow: 0 2px 6px rgba(93, 64, 55, 0.4);
        }

        .qty-value {
            min-width: 16px;
            text-align: center;
            font-size: 0.82rem;
            font-weight: 800;
            color: var(--text-main);
        }

        /* Category Filter Bar */
        #category-filters {
            overflow-x: auto;
            flex-wrap: nowrap;
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE/Edge */
            padding-bottom: 4px;
        }

        #category-filters::-webkit-scrollbar {
            display: none; /* Chrome/Safari */
        }

        .category-pill {
            cursor: pointer;
            padding: 6px 14px;
            border-radius: 30px;
            background: var(--surface-color);
            border: 1px solid var(--secondary-color);
            color: var(--text-main);
            transition: var(--transition);
            white-space: nowrap;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .category-pill.active {
            background: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }

        /* Invoice / Receipt Area */
        .invoice-container {
            background: var(--surface-color);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-md);
            height: calc(100vh - 100px);
            /* Sticky full height minus nav */
            display: flex;
            flex-direction: column;
            position: sticky;
            top: 80px;
            min-width: 320px;
        }

        .receipt-paper {
            background: #fff;
            border: 1px solid #eee;
            margin: 10px;
            padding: 15px;
            border-radius: 4px;
            flex-grow: 1;
            overflow-y: auto;
            position: relative;
            box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.02);
            font-family: 'Courier New', Courier, monospace;
        }

        /* Reverted Receipt Header & Kept Brand Footer Styles */
        .receipt-header {
            border-bottom: 2px dashed #ccc;
            padding-bottom: 10px;
            margin-bottom: 12px;
            text-align: center;
        }

        .receipt-footer {
            border-top: 2px dashed #eee;
            padding-top: 12px;
            margin-top: 10px;
        }

        .invoice-brand-footer {
            background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
            color: white;
            padding: 12px;
            border-radius: 6px;
            margin-top: 15px;
        }

        .cart-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 0.9rem;
            align-items: center;
            border-bottom: 1px dashed #f0f0f0;
            padding-bottom: 8px;
        }

        .cart-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }

        /* Payment Toggles */
        .payment-btn-group .btn {
            border-color: var(--secondary-color);
            color: var(--text-muted);
            font-size: 0.85rem;
        }

        .payment-btn-group .btn.active[data-mode="Cash"] {
            background-color: var(--success-color);
            color: white;
            border-color: var(--success-color);
        }

        .payment-btn-group .btn.active[data-mode="Online"] {
            background-color: var(--online-color);
            color: white;
            border-color: var(--online-color);
        }

        .payment-btn-group .btn.active[data-mode="Pending"] {
            background-color: var(--pending-color);
            color: white;
            border-color: var(--pending-color);
        }

        /* Autocomplete Suggestions */
        .suggestions-box {
            position: absolute;
            z-index: 1000;
            background: white;
            width: 100%;
            border: 1px solid var(--secondary-color);
            border-radius: var(--radius-sm);
            max-height: 150px;
            overflow-y: auto;
            display: none;
            box-shadow: var(--shadow-md);
        }

        .suggestion-item {
            padding: 8px 12px;
            cursor: pointer;
            border-bottom: 1px solid #f0f0f0;
            font-size: 0.9rem;
        }

        .suggestion-item:hover {
            background-color: var(--secondary-color);
        }

        /* Validations */
        .glow-error {
            border-color: #dc3545 !important;
            box-shadow: 0 0 8px rgba(220, 53, 69, 0.6) !important;
        }

        /* =========================================
           LOADERS, ANIMATIONS & TOASTS
           ========================================= */
        #global-loader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.9);
            z-index: 9999;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            transition: opacity 0.3s;
        }

        .coffee-cup-svg {
            width: 80px;
            height: 80px;
            animation: bounce 2s infinite ease-in-out;
        }

        .steam {
            stroke-dasharray: 10;
            animation: steamRise 2s infinite linear;
        }

        @keyframes bounce {

            0%,
            100% {
                transform: translateY(0);
            }

            50% {
                transform: translateY(-10px);
            }
        }

        @keyframes steamRise {
            0% {
                stroke-dashoffset: 20;
                opacity: 0;
            }

            50% {
                opacity: 1;
            }

            100% {
                stroke-dashoffset: 0;
                opacity: 0;
            }
        }

        /* Cart Floating Animation */
        .floating-num {
            position: fixed;
            font-weight: 800;
            font-size: 2rem;
            z-index: 9999;
            pointer-events: none;
            transition: all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            text-shadow: 0 2px 4px rgba(255, 255, 255, 0.8);
        }

        .cart-bounce {
            animation: cartBounceAnim 0.3s ease;
        }

        @keyframes cartBounceAnim {
            0% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.25) rotate(-5deg);
            }

            100% {
                transform: scale(1);
            }
        }

        .toast-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1050;
        }

        /* Scroll to Top FAB */
        #fab-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1040;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: none;
            align-items: center;
            justify-content: center;
            box-shadow: var(--shadow-md);
            border: none;
        }

        /* Footer */
        .main-footer {
            margin-top: auto;
            border-top: 3px solid var(--accent-color);
        }

        /* =========================================
           PRINT OPTIMIZATION (Thermal 58mm)
           ========================================= */
        @media print {
            body {
                background: white;
                color: black;
                font-family: 'Courier New', Courier, monospace;
                margin: 0;
                padding: 0;
            }

            .no-print,
            nav,
            #menu-section,
            .action-buttons,
            .payment-options,
            .customer-inputs,
            .toast-container,
            footer {
                display: none !important;
            }

            #invoice-print-area {
                position: absolute;
                left: 0;
                top: 0;
                width: 58mm;
                /* Standard Thermal Size */
                margin: 0;
                padding: 5px;
                border: none;
                box-shadow: none;
                font-size: 12px;
            }

            .receipt-header,
            .receipt-footer {
                border-color: black;
            }

            .invoice-brand-footer {
                background: transparent !important;
                color: black !important;
                border: 2px dashed black !important;
            }

            .invoice-brand-footer * {
                color: black !important;
                opacity: 1 !important;
            }
        }

        /* Mobile Adjustments */
        @media (max-width: 768px) {
            .invoice-container {
                height: auto;
                position: static;
                margin-top: 20px;
            }

            .category-scroll {
                overflow-x: auto;
                padding-bottom: 10px;
            }
        }

        @media (min-width: 769px) {
            #fab-top {
                display: none !important;
            }
        }

        /* ── Status selector btn-group ── */
        #receipt-status-options .btn { font-size: 0.72rem; padding: 0.2rem 0.35rem; }
        #receipt-status-options .btn.active { font-weight: 700; }

        /* ── Landing buttons ── */
        #pos-landing .btn { border-radius: 12px; }
    </style>
</head>

<body>

    <!-- ================= GLOBAL LOADER ================= -->
    <div id="global-loader">
        <svg class="coffee-cup-svg" viewBox="0 0 100 100" fill="none" stroke="var(--primary-color)" stroke-width="4"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M25 40 C25 40, 25 80, 50 80 C75 80, 75 40, 75 40 Z" fill="var(--secondary-color)" />
            <path d="M75 50 C90 50, 90 65, 75 65" />
            <path class="steam" d="M40 30 Q35 20 40 10" stroke-width="3" />
            <path class="steam" d="M50 30 Q55 20 50 10" stroke-width="3" style="animation-delay: 0.5s" />
            <path class="steam" d="M60 30 Q55 20 60 10" stroke-width="3" style="animation-delay: 1s" />
            <line x1="20" y1="80" x2="80" y2="80" />
        </svg>
        <h5 class="mt-3 text-primary-theme fw-bold">Brewing Data...</h5>
    </div>

    <!-- ================= NAVBAR ================= -->
    <nav class="navbar navbar-expand-lg bg-gradient-primary sticky-top shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand text-white" href="#">
                <i class="bi bi-cup-hot-fill me-2"></i><span id="navbar-cafe-name">Hangout Hub Café</span>
            </a>
            <div class="d-flex align-items-center no-print">
                <!-- Animated SVG Cart Bucket -->
                <div id="cart-nav-btn" class="position-relative me-3 text-white" style="cursor: pointer;"
                    onclick="scrollToBill()" title="View Bill">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    <span id="cart-badge"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                        style="font-size: 0.65rem;">
                        0
                    </span>
                </div>

                <!-- History/Orders Icon -->
                <div class="position-relative text-white ms-3" style="cursor: pointer;"
                    onclick="openOrdersView()" title="View Orders">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>

                </div>

                <!-- Online Orders Bell Icon -->
                <div class="position-relative text-white ms-3 me-2" style="cursor: pointer;"
                    onclick="openOrdersView()" title="View Orders" id="new-orders-nav-btn">
                    <i class="bi bi-bell-fill fs-5"></i>
                    <span id="new-orders-badge"
                        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light"
                        style="font-size: 0.65rem; display:none;">0</span>
                </div>
            </div>
        </div>
    </nav>

    <!-- ================= MAIN LAYOUT ================= -->
    <div class="container-fluid py-3 flex-grow-1">
        <div class="row g-3">

            <!-- ── POS LANDING (default view) ───────────────────────────────── -->
            <div class="col-md-7 col-lg-8" id="pos-landing">
                <!-- Action buttons -->
                <div class="row g-3 mb-4">
                    <div class="col-6">
                        <button class="btn btn-primary w-100 py-4 shadow fw-bold" onclick="startNewDineIn()" style="min-height:100px">
                            <i class="bi bi-plus-circle-fill d-block fs-2 mb-1"></i>
                            New Dine-In Order
                        </button>
                    </div>
                    <div class="col-6">
                        <button class="btn btn-outline-primary w-100 py-4 shadow-sm fw-bold" onclick="openOrdersView()" style="min-height:100px">
                            <i class="bi bi-list-ul d-block fs-2 mb-1"></i>
                            View Orders
                        </button>
                    </div>
                </div>
                <!-- Today's Stats Cards -->
                <div class="row g-2" id="landing-stats">
                    <div class="col-12 text-center text-muted py-4 small">
                        <div class="spinner-border spinner-border-sm me-2"></div>Loading stats…
                    </div>
                </div>
            </div>

            <!-- ── MENU (shown after New Dine-In clicked) ────────────────────── -->
            <div class="col-md-7 col-lg-8" id="menu-section" style="display:none">
                <!-- Back + Search row -->
                <div class="bg-white p-2 p-md-3 rounded shadow-sm mb-3">
                    <div class="row g-2 align-items-center">
                        <div class="col-auto">
                            <button class="btn btn-sm btn-outline-secondary" onclick="setPosView('landing')" title="Back to Home">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                        </div>
                        <div class="col">
                            <div class="input-group input-group-sm">
                                <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
                                <input type="text" class="form-control border-start-0 ps-0" id="search-menu"
                                    placeholder="Search menu..." oninput="filterMenu()">
                            </div>
                        </div>
                        <div class="col-md-7 category-scroll d-flex gap-2" id="category-filters">
                            <!-- Categories injected via JS -->
                        </div>
                    </div>
                </div>
                <!-- Menu Items Grid -->
                <div class="row g-2" id="menu-grid">
                    <!-- Items injected via JS -->
                </div>
            </div>

            <!-- ── ORDERS VIEW (shown after View Orders clicked) ─────────────── -->
            <div class="col-md-7 col-lg-8" id="orders-section" style="display:none">
                <div class="bg-white rounded shadow-sm p-3">

                    <!-- Header -->
                    <div class="d-flex align-items-center justify-content-between mb-3">
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="setPosView('landing')" title="Back to Home">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                            <h6 class="mb-0 fw-bold" style="color:var(--primary-color)">
                                <i class="bi bi-receipt-cutoff me-1"></i>Orders
                            </h6>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <div class="form-check form-switch mb-0">
                                <input class="form-check-input" type="checkbox" id="oq-today-toggle" checked>
                                <label class="form-check-label small text-muted" for="oq-today-toggle">Today</label>
                            </div>
                            <button class="btn btn-outline-secondary btn-sm" id="oq-refresh-btn" onclick="fetchOrdersQueue()" title="Refresh orders">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </div>
                    </div>

                    <!-- EOD Summary strip -->
                    <div class="row g-2 mb-3" id="oq-eod-strip">
                        <div class="col"><div class="border rounded text-center py-1 px-2"><div class="fw-bold small" id="oq-eod-orders">—</div><div style="font-size:.7rem" class="text-muted">Orders</div></div></div>
                        <div class="col"><div class="border rounded text-center py-1 px-2 border-warning"><div class="fw-bold small text-warning" id="oq-eod-pending">—</div><div style="font-size:.7rem" class="text-muted">Pending</div></div></div>
                        <div class="col"><div class="border rounded text-center py-1 px-2 border-info"><div class="fw-bold small text-info" id="oq-eod-confirmed">—</div><div style="font-size:.7rem" class="text-muted">Confirmed</div></div></div>
                        <div class="col"><div class="border rounded text-center py-1 px-2 border-success"><div class="fw-bold small text-success" id="oq-eod-completed">—</div><div style="font-size:.7rem" class="text-muted">Completed</div></div></div>
                        <div class="col"><div class="border rounded text-center py-1 px-2 border-success"><div class="fw-bold small text-success" id="oq-eod-revenue">—</div><div style="font-size:.7rem" class="text-muted">Revenue</div></div></div>
                        <div class="col"><div class="border rounded text-center py-1 px-2"><div class="fw-bold small text-success" id="oq-eod-cash">—</div><div style="font-size:.7rem" class="text-muted">Cash</div></div></div>
                        <div class="col"><div class="border rounded text-center py-1 px-2"><div class="fw-bold small text-primary" id="oq-eod-online">—</div><div style="font-size:.7rem" class="text-muted">Online</div></div></div>
                    </div>

                    <!-- Filter chips -->
                    <div class="d-flex flex-wrap gap-1 mb-2 align-items-center">
                        <span class="small text-muted me-1">Type:</span>
                        <button class="btn btn-sm py-0 px-2 btn-primary oq-chip" data-filter="type" data-val="all">All</button>
                        <button class="btn btn-sm py-0 px-2 btn-outline-primary oq-chip" data-filter="type" data-val="online"><i class="bi bi-globe me-1"></i>Online</button>
                        <button class="btn btn-sm py-0 px-2 btn-outline-primary oq-chip" data-filter="type" data-val="dinein"><i class="bi bi-person-standing me-1"></i>Dine-In</button>
                        <span class="small text-muted ms-3 me-1">Status:</span>
                        <button class="btn btn-sm py-0 px-2 btn-secondary oq-chip" data-filter="status" data-val="all">All</button>
                        <button class="btn btn-sm py-0 px-2 btn-outline-warning oq-chip" data-filter="status" data-val="pending">Pending</button>
                        <button class="btn btn-sm py-0 px-2 btn-outline-info oq-chip" data-filter="status" data-val="confirmed">Confirmed</button>
                        <button class="btn btn-sm py-0 px-2 btn-outline-success oq-chip" data-filter="status" data-val="completed">Completed</button>
                        <button class="btn btn-sm py-0 px-2 btn-outline-secondary oq-chip" data-filter="status" data-val="cancelled">Cancelled</button>
                    </div>

                    <!-- Orders table -->
                    <div id="orders-queue-body">
                        <div class="text-center text-muted py-5">
                            <i class="bi bi-arrow-clockwise fs-3 opacity-40 d-block mb-2"></i>
                            Click <strong>refresh</strong> to load orders
                        </div>
                    </div>
                </div>
            </div>

            <!-- ── RIGHT COLUMN: RECEIPT (always visible) ───────────────────── -->
            <div class="col-md-5 col-lg-4" id="invoice-container-wrapper">
                <div class="invoice-container p-3 d-flex flex-column">

                    <!-- Customer Details (billing mode) -->
                    <div id="receipt-customer-inputs" class="customer-inputs mb-2 position-relative">
                        <div class="input-group input-group-sm mb-2">
                            <span class="input-group-text"><i class="bi bi-telephone"></i></span>
                            <input type="tel" class="form-control" id="cust-phone"
                                placeholder="Phone Number (10 digits)" autocomplete="off">
                        </div>
                        <div id="phone-suggestions" class="suggestions-box"></div>
                        <div class="input-group input-group-sm mb-2">
                            <span class="input-group-text"><i class="bi bi-person"></i></span>
                            <input type="text" class="form-control" id="cust-name"
                                placeholder="Customer Name (Optional)">
                        </div>
                        <div class="input-group input-group-sm mb-2">
                            <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                            <input type="email" class="form-control" id="cust-email" placeholder="Email Address">
                        </div>
                    </div>

                    <!-- Order Status Selector (always shown) -->
                    <div id="receipt-status-options" class="mb-2">
                        <div class="btn-group w-100 btn-group-sm" role="group">
                            <button type="button" class="btn btn-outline-secondary" id="status-btn-pending" data-order-status="pending"   onclick="setReceiptStatus('pending')">Pending</button>
                            <button type="button" class="btn btn-outline-secondary" data-order-status="confirmed" onclick="setReceiptStatus('confirmed')">Confirmed</button>
                            <button type="button" class="btn btn-outline-secondary" data-order-status="completed" onclick="setReceiptStatus('completed')">Completed</button>
                            <button type="button" class="btn btn-outline-secondary" data-order-status="cancelled" onclick="setReceiptStatus('cancelled')">Cancelled</button>
                        </div>
                    </div>

                    <!-- Payment Options (always shown) -->
                    <div class="payment-options mb-2">
                        <div class="btn-group w-100 btn-group-sm payment-btn-group" role="group">
                            <button type="button" class="btn btn-outline-secondary" data-mode="Cash"
                                onclick="setPaymentMode('Cash')">Cash</button>
                            <button type="button" class="btn btn-outline-secondary" data-mode="Online"
                                onclick="setPaymentMode('Online')">Online</button>
                            <button type="button" class="btn btn-outline-secondary active" data-mode="Pending"
                                onclick="setPaymentMode('Pending')">Pending</button>
                        </div>
                    </div>

                    <!-- Receipt Preview Area -->
                    <div class="receipt-paper d-flex flex-column" id="invoice-print-area">
                        <div class="receipt-header">
                            <h4 class="mb-0 fw-bold" id="receipt-cafe-name">HANGOUT HUB CAFE</h4>
                            <small class="text-muted" id="receipt-cafe-subline">Cafe & Roastery</small><br>
                            <small class="text-muted" id="receipt-date">-- --- ----, --:-- --</small><br>
                            <small class="text-muted fw-semibold" id="receipt-order-number" style="display:none"></small><br id="receipt-order-number-br" style="display:none">
                            <small class="text-muted no-print" id="receipt-cust-info"></small>
                        </div>
                        <div class="receipt-items flex-grow-1" id="cart-items-container">
                            <!-- Cart items injected via JS -->
                        </div>
                        <div class="receipt-footer mt-auto">
                            <div class="d-flex justify-content-between mb-1" style="font-size:0.9rem;">
                                <span>Subtotal</span><span id="cart-subtotal">₹0.00</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2 pb-2 border-bottom" style="font-size:0.9rem;" id="tax-row">
                                <span id="tax-label">Tax</span><span id="cart-tax">₹0.00</span>
                            </div>
                            <div class="d-flex justify-content-between fw-bold fs-5 text-primary-theme invoice-total-row">
                                <span>TOTAL</span><span id="cart-total">₹0.00</span>
                            </div>
                            <div class="text-center mt-2 fw-bold fs-6" id="receipt-order-status" style="display:none">Status – Pending</div>
                            <div class="text-center mt-1 fw-bold fs-6" id="receipt-payment-mode">Payment - Pending</div>
                            <div class="invoice-brand-footer text-center">
                                <i class="bi bi-cup-hot fs-5 mb-1 d-inline-block opacity-75"></i>
                                <div id="invoice-quote" class="fst-italic" style="font-size: 0.85rem;">"Where there's tea, there's hope."</div>
                            </div>
                        </div>
                    </div>

                    <!-- ── Action Buttons (unified) ─────────────────────── -->
                    <div class="action-buttons mt-2 no-print" id="receipt-actions">

                        <!-- Primary action row -->
                        <div class="d-flex gap-2 mb-2">
                            <button id="btn-save" class="btn btn-success flex-fill fw-bold py-2 shadow-sm"
                                onclick="processPrimaryAction()">
                                <i class="bi bi-check-circle me-1"></i>
                                <span id="btn-save-label">Create Order</span>
                            </button>
                            <button id="btn-clear" class="btn btn-outline-danger fw-bold py-2 px-3 shadow-sm"
                                onclick="confirmClearCart()" title="Clear">
                                <i class="bi bi-trash3"></i>
                            </button>
                            <button id="btn-back" class="btn btn-outline-secondary py-2 px-3 shadow-sm"
                                onclick="exitManageMode()" title="Back" style="display:none">
                                <i class="bi bi-arrow-left"></i>
                            </button>
                        </div>

                        <!-- Post-save / post-update sharing options -->
                        <div class="d-flex gap-2" id="post-save-actions" style="display:none">
                            <button id="btn-print" class="btn btn-outline-secondary flex-fill btn-sm py-2"
                                onclick="printBill()" title="Print Receipt" style="display:none">
                                <i class="bi bi-printer fs-6"></i>
                            </button>
                            <button id="btn-whatsapp" class="btn btn-outline-success flex-fill btn-sm py-2"
                                onclick="shareAnyWhatsApp()" title="Share WhatsApp" disabled>
                                <i class="bi bi-whatsapp fs-6"></i>
                            </button>
                            <button id="btn-email" class="btn btn-outline-info flex-fill btn-sm py-2"
                                onclick="sendEmail()" title="Send Email" disabled>
                                <i class="bi bi-envelope fs-6"></i>
                            </button>
                            <button class="btn btn-outline-primary flex-fill btn-sm py-2"
                                onclick="downloadInvoiceImage()" title="Save Image">
                                <i class="bi bi-download fs-6"></i>
                            </button>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

    <!-- ================= FOOTER ================= -->
    <footer class="main-footer bg-gradient-primary text-white text-center py-4 px-3 mt-4 no-print shadow-lg">
        <div class="container">
            <i class="bi bi-cup-hot fs-2 mb-2 d-inline-block text-white opacity-75"></i>
            <h5 id="footer-quote" class="fst-italic mb-3 fw-light" style="letter-spacing: 0.5px;">"Where there's tea,
                there's hope."</h5>
            <hr class="w-25 mx-auto border-light opacity-25">
            <p id="footer-dev-credit" class="mb-0 small text-white opacity-75">
                Designed &amp; Developed with ♥ by
                <a href="mailto:sharik.madhyapradeshi@gmail.com"
                    class="text-white fw-bold text-decoration-none border-bottom border-light pb-1">Sharik M.</a>
            </p>
        </div>
    </footer>

    <!-- ================= FAB (Scroll to Top) ================= -->
    <button id="fab-top" class="btn btn-primary bg-gradient-primary text-white shadow-lg no-print"
        onclick="window.scrollTo({top:0, behavior:'smooth'})" title="Back to top">
        <i class="bi bi-arrow-up fs-5"></i>
    </button>

    <!-- ================= MODALS & TOASTS ================= -->
    <div class="toast-container"></div>

    <!-- Clear Cart Modal -->
    <div class="modal fade" id="clearCartModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content border-0 shadow-lg">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title text-danger fw-bold"><i
                            class="bi bi-exclamation-triangle-fill me-2"></i>Clear Order?</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center py-4 text-muted">
                    Are you sure you want to remove all items from the current order?
                </div>
                <div class="modal-footer border-0 pt-0 justify-content-center gap-2">
                    <button type="button" class="btn btn-light px-4 border" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger px-4" onclick="executeClearCart()">Clear All</button>
                </div>
            </div>
        </div>
    </div>

    <!-- ── Variant Picker Modal ─────────────────────────────────────────────── -->
    <div class="modal fade" id="variantPickerModal" tabindex="-1" aria-labelledby="variant-picker-title" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-header py-2">
                    <h6 class="modal-title fw-bold text-primary-theme" id="variant-picker-title">Choose Variant</h6>
                    <button type="button" class="btn-close btn-sm" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body py-2" id="variant-picker-list">
                    <!-- populated by openVariantPicker() -->
                </div>
                <div class="modal-footer py-2">
                    <button type="button" class="btn btn-sm btn-secondary" data-bs-dismiss="modal">Done</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS (CDN) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- =========================================================
         SCRIPT 1: CONFIG, STATE MANAGEMENT & CSRF
         ========================================================= -->
    <script>
        // --- CSRF token injected server-side ---
        const CSRF = "<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>";

        // --- App Configuration ---
        const CONFIG = {
            cafeName: "The Hangout Hub cafe",  // Change to update the cafe name everywhere
            cafeSubline: "GOOD FOOD • GOOD MOOD • GOOD TIMES", // Short description for receipt header
            enableTax: false,           // Set to true to show tax calculation
            enablePrint: false          // Set to true to show the thermal print button
        };

        // --- Developer Info ---
        const DEV = {
            name: "Sharik M.",
            email: "sharik.madhyapradeshi@gmail.com",
            phone: "8697908896",
            siteName: `${CONFIG.cafeName} - Cafe POS`
        };

        // 1. Menu data — loaded from DB via fetchMenu() on page load
        let menuData = [];
        let categories = ['All'];

        // 2. Global State Objects (Defaulting to Pending)
        let STATE = {
            cart: [],
            paymentMode: 'Pending',
            activeCategory: 'All',
            taxRate: 0.05, // 5% Tax
        };


        const cafeQuotes = [
            "Tea is quiet wisdom in a cup.",
            "Coffee first, questions later.",
            "Life happens, tea helps.",
            "Behind every successful day is a substantial amount of coffee.",
            "A cup of tea is a cup of peace.",
            "Espresso yourself.",
            "Tea: because it's always the right time.",
            "Coffee — because adulting is hard.",
            "Sip happens. Stay calm and drink tea.",
            "Good ideas start with coffee.",
            "Tea is the magic key to the vault where my brain is kept.",
            "Decaf? No thanks, I choose life.",
            "Tea is liquid tranquility.",
            "Coffee is a hug in a mug.",
            "You can't buy happiness, but you can buy coffee — and that's close.",
            "Tea first. Schemes later.",
            "I like my coffee like my mornings: strong and essential.",
            "Tea is the answer. Who cares what the question is?",
            "Coffee: turning 'leave me alone' into 'good morning'.",
            "One cup closer to sanity.",
            "Tea — a pause button for life.",
            "Coffee solves most problems. The rest need more coffee.",
            "Keep calm and put the kettle on.",
            "Life is too short for bad tea.",
            "May your coffee strong and your worries short.",
            "Tea time is me time.",
            "Coffee: because sleep is optional.",
            "Brew it. Sip it. Repeat.",
            "Tea is always a good idea.",
            "Coffee — the most important meal of the day.",
            "I like my coffee like my code: strong and without bugs."
        ];


        function quoteOfTheDay(date = new Date()) {
            const startOfYear = new Date(date.getFullYear(), 0, 0);
            const diff = date - startOfYear;
            const day = Math.floor(diff / (1000 * 60 * 60 * 24));
            return cafeQuotes[day % cafeQuotes.length];
        }
    </script>

    <!-- =========================================================
         SCRIPT 2: UTILITIES, ANIMATIONS & MOCK API CALLS
         ========================================================= -->
    <script>
        // --- Validation RegEx ---
        const phoneRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        // --- Custom Date Formatter (Fri 24 Apr 2026, 9:30 PM) ---
        function getFormattedDate() {
            const d = new Date();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

            let hours = d.getHours();
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'

            return `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${hours}:${minutes} ${ampm}`;
        }

        // --- View Controls & Resets ---
        function resetSaveState() {
            const postSaveActions = document.getElementById('post-save-actions');
            const btnSave = document.getElementById('btn-save');
            if (postSaveActions && postSaveActions.style.display !== 'none') {
                postSaveActions.style.display = 'none';
                btnSave.disabled = false;
            }
        }

        // --- UI Utilities ---
        function showLoader(show = true) {
            document.getElementById('global-loader').style.display = show ? 'flex' : 'none';
        }

        function showToast(message, type = 'info') {
            const colors = { info: 'bg-primary', success: 'bg-success', error: 'bg-danger', warn: 'bg-warning text-dark' };
            const toastHTML = `
                <div class="toast align-items-center text-white ${colors[type]} border-0 show" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body"><i class="bi bi-info-circle me-2"></i>${message}</div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>`;
            const container = document.querySelector('.toast-container');
            container.insertAdjacentHTML('beforeend', toastHTML);
            const toastEl = container.lastElementChild;
            setTimeout(() => { toastEl.classList.remove('show'); setTimeout(() => toastEl.remove(), 300); }, 3000);
        }

        // --- Cart Floating Animation ---
        function animateCartFloat(e, delta) {
            if (!e) return;
            const cartBtn = document.getElementById('cart-nav-btn');
            const cartRect = cartBtn.getBoundingClientRect();

            let startX, startY;
            if (e.clientX !== undefined && e.clientY !== undefined) {
                startX = e.clientX;
                startY = e.clientY;
            } else if (e.target && e.target.getBoundingClientRect) {
                const rect = e.target.getBoundingClientRect();
                startX = rect.left + rect.width / 2;
                startY = rect.top + rect.height / 2;
            } else {
                return;
            }

            const animEl = document.createElement('div');
            animEl.className = 'floating-num';
            animEl.style.left = `${startX}px`;
            animEl.style.top = `${startY}px`;
            animEl.style.color = delta > 0 ? 'var(--success-color)' : 'var(--pending-color)';
            animEl.innerText = delta > 0 ? '+1' : '-1';

            document.body.appendChild(animEl);

            requestAnimationFrame(() => {
                animEl.style.transform = `translate(${cartRect.left - startX + 10}px, ${cartRect.top - startY + 10}px) scale(0.5)`;
                animEl.style.opacity = '0.2';
            });

            setTimeout(() => {
                animEl.remove();
                cartBtn.classList.remove('cart-bounce');
                void cartBtn.offsetWidth;
                cartBtn.classList.add('cart-bounce');
            }, 900);
        }

        // --- View Handlers ---
        function scrollToBill() {
            const billEl = document.getElementById('invoice-container-wrapper');
            if (billEl) {
                billEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }

        window.addEventListener('scroll', () => {
            const fab = document.getElementById('fab-top');
            if (window.scrollY > 300) {
                fab.style.display = 'flex';
            } else {
                fab.style.display = 'none';
            }
        });

        // --- Fetch menu from DB ---
        async function fetchMenu() {
            const res = await fetch('/hhcpanel/api/menu.php', {
                credentials: 'same-origin'
            });
            if (!res.ok) throw new Error('Menu load failed');
            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'Menu load failed');

            menuData  = data.items;
            categories = ['All', ...data.categories.map(c => c.name)];
        }

        // --- Place order on DB ---
        async function placeOrderOnServer(payload) {
            const res = await fetch('/hhcpanel/api/pos_order.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': CSRF
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data.error || 'Order save failed');
            return data;
        }

        // --- Customer phone lookup ---
        let _custLookupTimer = null;
        async function lookupCustomer(q) {
            if (_custLookupTimer) clearTimeout(_custLookupTimer);
            return new Promise(resolve => {
                _custLookupTimer = setTimeout(async () => {
                    try {
                        const res = await fetch(`/hhcpanel/api/pos_customers.php?q=${encodeURIComponent(q)}`, {
                            credentials: 'same-origin'
                        });
                        const data = await res.json();
                        resolve(data.ok ? data.customers : []);
                    } catch { resolve([]); }
                }, 250);
            });
        }
    </script>

    <!-- =========================================================
         SCRIPT 3: UI RENDERING LOGIC
         ========================================================= -->
    <script>
        function getCategoryIcon(category) {
            if (category === 'Coffee') {
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`;
            } else if (category === 'Snacks') {
                return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a5 5 0 0 0-5 5v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a5 5 0 0 0-5-5Z"/><path d="M6 14h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2Z"/><path d="M6 10h12v4H6z"/></svg>`;
            }
            return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><path d="M8 2v3"/><path d="M12 2v3"/></svg>`;
        }

        function renderCategories() {
            const container = document.getElementById('category-filters');
            container.innerHTML = categories.map(cat => `
                <div class="category-pill ${STATE.activeCategory === cat ? 'active' : ''}" 
                     onclick="setCategory('${cat}')">${cat}</div>
            `).join('');
        }

        function setCategory(cat) {
            STATE.activeCategory = cat;
            renderCategories();
            renderMenu();
        }

        function renderMenu(searchQuery = '') {
            const grid = document.getElementById('menu-grid');
            let filtered = menuData;

            if (STATE.activeCategory !== 'All') {
                filtered = filtered.filter(item => item.category === STATE.activeCategory);
            }
            if (searchQuery) {
                filtered = filtered.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
            }

            grid.innerHTML = filtered.map(item => {
                const isSingle   = item.variants.length === 1;
                const inCart     = item.variants.some(v => STATE.cart.find(c => c.pricing_id === v.id));
                const minPrice   = Math.min(...item.variants.map(v => v.price));
                const priceLabel = isSingle ? `₹${item.variants[0].price}` : `from ₹${minPrice}`;

                let actionHtml;
                if (isSingle) {
                    const cartItem  = STATE.cart.find(c => c.pricing_id === item.variants[0].id);
                    const qty       = cartItem ? cartItem.qty : 0;
                    const cartIndex = STATE.cart.findIndex(c => c.pricing_id === item.variants[0].id);
                    if (qty > 0) {
                        actionHtml = `
                            <div class="qty-stepper" onclick="event.stopPropagation()">
                                <button class="btn-qty btn-qty-minus" onclick="updateQty(${cartIndex}, -1, event)">−</button>
                                <span class="qty-value">${qty}</span>
                                <button class="btn-qty btn-qty-plus" onclick="updateQty(${cartIndex}, 1, event)">+</button>
                            </div>`;
                    } else {
                        actionHtml = `<button class="btn-add-item" onclick="event.stopPropagation(); addToCart(${item.id}, event)">+</button>`;
                    }
                } else {
                    // Multi-variant: "+" always opens picker; show total qty in cart if any
                    const totalQty = item.variants.reduce((s, v) => {
                        const c = STATE.cart.find(ci => ci.pricing_id === v.id);
                        return s + (c ? c.qty : 0);
                    }, 0);
                    actionHtml = totalQty > 0
                        ? `<button class="btn-add-item" style="font-size:.7rem;padding:4px 10px;" onclick="event.stopPropagation(); openVariantPicker(${item.id}, event)">${totalQty} ▾</button>`
                        : `<button class="btn-add-item" onclick="event.stopPropagation(); openVariantPicker(${item.id}, event)">+</button>`;
                }

                return `
                    <div class="col-6 col-md-4 col-xl-3">
                        <div class="menu-item-card ${inCart ? 'active-in-cart' : ''}" onclick="addToCart(${item.id}, event)">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="item-icon-wrapper">
                                    ${getCategoryIcon(item.category)}
                                </div>
                                <span class="item-category-tag">${item.category}</span>
                            </div>
                            <div class="item-name" title="${item.name}">${item.name}</div>
                            <div class="item-card-footer">
                                <span class="item-price">${priceLabel}</span>
                                ${actionHtml}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        function renderCart() {
            const container = document.getElementById('cart-items-container');
            const cartBadge = document.getElementById('cart-badge');

            const totalItems = STATE.cart.reduce((sum, item) => sum + item.qty, 0);
            cartBadge.innerText = totalItems;

            if (STATE.cart.length === 0) {
                container.innerHTML = `
                    <div class="text-center text-muted mt-5 no-print" id="empty-cart-msg">
                        <i class="bi bi-cup-hot opacity-50" style="font-size: 3rem;"></i>
                        <p class="mt-2 mb-0 fw-medium">No items yet</p>
                        <p class="mb-0" style="font-size:0.75rem; opacity:0.6;">Pick something from the menu!</p>
                    </div>`;
            } else {
                container.innerHTML = STATE.cart.map((item, index) => `
                    <div class="cart-item">
                        <div style="flex:2; padding-right:10px;">
                            <div class="fw-bold text-dark text-truncate" style="font-size: 0.85rem; line-height: 1.2; max-width: 250px;" title="${item.name}">${item.name}</div>
                            <div class="text-muted mt-1" style="font-size: 0.75rem;">
                                ${item.variant_label ? `<span class="badge bg-light text-secondary border me-1">${item.variant_label}</span>` : ''}
                                ₹${item.price} <span class="fw-bold px-1 text-primary-theme bg-light rounded border ms-1">x ${item.qty}</span>
                            </div>
                        </div>
                        <div class="text-end fw-bold text-primary-theme fs-6" style="flex:1;">₹${item.price * item.qty}</div>
                    </div>
                `).join('');
            }

            calculateTotals();
        }

        function calculateTotals() {
            const subtotal = STATE.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
            const tax = CONFIG.enableTax ? subtotal * STATE.taxRate : 0;
            const total = subtotal + tax;

            document.getElementById('cart-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
            if (CONFIG.enableTax) {
                document.getElementById('tax-label').innerText = `Tax (${STATE.taxRate * 100}%)`;
                document.getElementById('cart-tax').innerText = `₹${tax.toFixed(2)}`;
            }
            document.getElementById('cart-total').innerText = `₹${Math.round(total).toFixed(2)}`;
        }


    </script>

    <!-- =========================================================
         SCRIPT 4: BUSINESS LOGIC, EVENTS & INTEGRATIONS
         ========================================================= -->
    <script>
        // --- Initialization ---
        window.onload = async () => {
            showLoader(true);

            // Apply Configurations
            if (CONFIG.enablePrint) {
                document.getElementById('btn-print').style.display = 'block';
            }
            if (!CONFIG.enableTax) {
                document.getElementById('tax-row').style.display = 'none';
            }

            // Fetch menu from DB before rendering
            try {
                await fetchMenu();
            } catch (err) {
                showToast("Menu failed to load. Please refresh.", "error");
                showLoader(false);
                return;
            }

            setTimeout(() => {
                renderCategories();
                renderMenu();
                renderCart();
                setPaymentMode(STATE.paymentMode); // Setup initial badge text
                document.getElementById('receipt-date').innerText = getFormattedDate();
                // Display daily rotating quote in footer
                const footerQuoteEl = document.getElementById('footer-quote');
                const todayQuote = quoteOfTheDay();
                if (footerQuoteEl) footerQuoteEl.innerText = `"${todayQuote}"`;
                const invoiceQuoteEl = document.getElementById('invoice-quote');
                if (invoiceQuoteEl) invoiceQuoteEl.innerText = `"${todayQuote}"`;
                // Apply cafe name to all dynamic name placeholders
                document.title = `${CONFIG.cafeName} | Cafe POS`;
                document.getElementById('navbar-cafe-name').innerText = CONFIG.cafeName;
                document.getElementById('receipt-cafe-name').innerText = CONFIG.cafeName.toUpperCase();
                document.getElementById('receipt-cafe-subline').innerText = CONFIG.cafeSubline;
                // Render footer developer info from DEV const
                const devCreditEl = document.getElementById('footer-dev-credit');
                if (devCreditEl) {
                    const waMsg = encodeURIComponent(`Hey ${DEV.name}, I saw you as developer on the ${DEV.siteName}, I'm interested in connecting for a potential project`);
                    devCreditEl.innerHTML = `Designed &amp; Developed with ♥ by <a href="mailto:${DEV.email}" class="text-white fw-bold text-decoration-none border-bottom border-light pb-1">${DEV.name}</a> <a href="https://wa.me/91${DEV.phone}?text=${waMsg}" target="_blank" rel="noopener noreferrer" class="text-white ms-1" title="Connect with ${DEV.name} on WhatsApp" style="font-size:1.1rem; vertical-align:middle;"><i class="bi bi-whatsapp"></i></a>`;
                }
                showLoader(false);
            }, 500);

            // Load landing stats (no auto-poll — manual refresh only)
            fetchLandingStats();
        };

        // --- Core Interactions ---
        function filterMenu() {
            const q = document.getElementById('search-menu').value;
            renderMenu(q);
        }

        function addToCart(itemId, e) {
            const item = menuData.find(i => i.id === itemId);
            if (!item) return;
            if (item.variants.length === 1) {
                addVariantToCart(item, item.variants[0], e);
            } else {
                openVariantPicker(itemId, e);
            }
        }

        function addVariantToCart(item, variant, e) {
            const existing = STATE.cart.find(c => c.pricing_id === variant.id);
            if (existing) {
                existing.qty += 1;
            } else {
                STATE.cart.push({
                    pricing_id:    variant.id,
                    item_id:       item.id,
                    name:          item.name,
                    variant_label: variant.variant_label,
                    price:         variant.price,
                    qty:           1
                });
            }
            animateCartFloat(e, 1);
            resetSaveState();
            renderCart();
            const searchBar = document.getElementById('search-menu');
            if (searchBar.value !== '') searchBar.value = '';
            renderMenu();
        }

        function openVariantPicker(itemId, e) {
            const item = menuData.find(i => i.id === itemId);
            if (!item) return;

            document.getElementById('variant-picker-title').innerText = item.name;

            const list = document.getElementById('variant-picker-list');
            list.innerHTML = item.variants.map(v => {
                const ci  = STATE.cart.find(c => c.pricing_id === v.id);
                const qty = ci ? ci.qty : 0;
                const idx = STATE.cart.findIndex(c => c.pricing_id === v.id);
                return `
                    <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div>
                            <span class="fw-medium">${v.variant_label}</span>
                            <span class="text-muted ms-2 small">₹${v.price}</span>
                        </div>
                        ${qty > 0
                            ? `<div class="qty-stepper">
                                   <button class="btn-qty btn-qty-minus" onclick="updateQty(${idx}, -1, event); refreshVariantPicker(${itemId})">−</button>
                                   <span class="qty-value">${qty}</span>
                                   <button class="btn-qty btn-qty-plus" onclick="updateQty(${idx}, 1, event); refreshVariantPicker(${itemId})">+</button>
                               </div>`
                            : `<button class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                       onclick="addVariantToCart(menuData.find(i=>i.id===${itemId}), {id:${v.id},variant_label:'${v.variant_label.replace(/'/g,"\\'")}',price:${v.price}}, event); refreshVariantPicker(${itemId})">Add</button>`
                        }
                    </div>`;
            }).join('');

            new bootstrap.Modal(document.getElementById('variantPickerModal')).show();
        }

        function refreshVariantPicker(itemId) {
            const item = menuData.find(i => i.id === itemId);
            if (!item) return;
            const list = document.getElementById('variant-picker-list');
            list.innerHTML = item.variants.map(v => {
                const ci  = STATE.cart.find(c => c.pricing_id === v.id);
                const qty = ci ? ci.qty : 0;
                const idx = STATE.cart.findIndex(c => c.pricing_id === v.id);
                return `
                    <div class="d-flex align-items-center justify-content-between py-2 border-bottom">
                        <div>
                            <span class="fw-medium">${v.variant_label}</span>
                            <span class="text-muted ms-2 small">₹${v.price}</span>
                        </div>
                        ${qty > 0
                            ? `<div class="qty-stepper">
                                   <button class="btn-qty btn-qty-minus" onclick="updateQty(${idx}, -1, event); refreshVariantPicker(${itemId})">−</button>
                                   <span class="qty-value">${qty}</span>
                                   <button class="btn-qty btn-qty-plus" onclick="updateQty(${idx}, 1, event); refreshVariantPicker(${itemId})">+</button>
                               </div>`
                            : `<button class="btn btn-sm btn-outline-secondary rounded-pill px-3"
                                       onclick="addVariantToCart(menuData.find(i=>i.id===${itemId}), {id:${v.id},variant_label:'${v.variant_label.replace(/'/g,"\\'")}',price:${v.price}}, event); refreshVariantPicker(${itemId})">Add</button>`
                        }
                    </div>`;
            }).join('');
        }

        function updateQty(index, delta, e) {
            STATE.cart[index].qty += delta;
            if (STATE.cart[index].qty <= 0) {
                STATE.cart.splice(index, 1);
            }

            animateCartFloat(e, delta);
            resetSaveState();
            renderCart();
            renderMenu();
        }

        function setPaymentMode(mode) {
            STATE.paymentMode = mode;
            document.querySelectorAll('.payment-btn-group .btn').forEach(b => b.classList.remove('active'));
            document.querySelector(`.payment-btn-group .btn[data-mode="${mode}"]`).classList.add('active');

            const pmtText = document.getElementById('receipt-payment-mode');
            pmtText.innerText = 'Payment - ' + mode;

            // Determine text color based on pending status
            if (mode === 'Pending') pmtText.style.color = "var(--pending-color)";
            else pmtText.style.color = "var(--success-color)";

            // In manage mode: trigger immediate API update
            if (_receiptMode === 'manage' && _managedOrder) {
                markManagedOrderPaid(mode.toLowerCase());
                return;
            }

            resetSaveState();
        }

        // --- Live Input Validation ---
        const phoneInput = document.getElementById('cust-phone');
        const emailInput = document.getElementById('cust-email');
        const nameInput = document.getElementById('cust-name');
        const suggestBox = document.getElementById('phone-suggestions');

        const btnWhatsapp = document.getElementById('btn-whatsapp');
        const btnEmail = document.getElementById('btn-email');

        phoneInput.addEventListener('input', async (e) => {
            const val = e.target.value;

            // Format validation & Button Toggle
            if (val && phoneRegex.test(val)) {
                e.target.classList.remove('glow-error');
                btnWhatsapp.disabled = false;
            } else {
                if (val) e.target.classList.add('glow-error');
                else e.target.classList.remove('glow-error');
                btnWhatsapp.disabled = true;
            }

            // Autocomplete logic — real DB lookup
            if (val.length > 2) {
                const matches = await lookupCustomer(val);
                if (matches.length > 0) {
                    suggestBox.innerHTML = matches.map(m => `
                        <div class="suggestion-item" onclick="selectCustomer('${m.whatsapp}', '${m.name.replace(/'/g, "\\'")}')">
                            <i class="bi bi-person text-muted me-2"></i>${m.whatsapp} - ${m.name}
                        </div>
                    `).join('');
                    suggestBox.style.display = 'block';
                } else {
                    suggestBox.style.display = 'none';
                }
            } else {
                suggestBox.style.display = 'none';
            }
            updateReceiptHeader();
            resetSaveState();
        });

        emailInput.addEventListener('input', (e) => {
            const val = e.target.value;

            // Format validation & Button Toggle
            if (val && emailRegex.test(val)) {
                e.target.classList.remove('glow-error');
                btnEmail.disabled = false;
            } else {
                if (val) e.target.classList.add('glow-error');
                else e.target.classList.remove('glow-error');
                btnEmail.disabled = true;
            }

            updateReceiptHeader();
            resetSaveState();
        });

        nameInput.addEventListener('input', (e) => {
            updateReceiptHeader();
            resetSaveState();
        });

        function selectCustomer(phone, name) {
            phoneInput.value = phone;
            phoneInput.classList.remove('glow-error');
            if (phone && phoneRegex.test(phone)) {
                btnWhatsapp.disabled = false;
            }

            nameInput.value = name;
            suggestBox.style.display = 'none';
            updateReceiptHeader();
            resetSaveState();
        }

        document.addEventListener('click', (e) => {
            if (!suggestBox.contains(e.target) && e.target !== phoneInput) {
                suggestBox.style.display = 'none';
            }
        });

        function updateReceiptHeader() {
            const infoArea = document.getElementById('receipt-cust-info');
            const p = phoneInput.value;
            const n = nameInput.value;
            const em = emailInput.value;

            let html = '';
            if (n) html += `Cust: ${n} <br>`;
            if (p && phoneRegex.test(p)) html += `Ph: ${p} <br>`;
            if (em && emailRegex.test(em)) html += `Em: ${em}`;
            infoArea.innerHTML = html;
        }

        // --- Clear Cart Logic ---
        const clearModal = new bootstrap.Modal(document.getElementById('clearCartModal'));

        function confirmClearCart() {
            if (STATE.cart.length === 0) return;
            clearModal.show();
        }

        function executeClearCart() {
            STATE.cart = [];

            // Reset Contact Input Validations
            phoneInput.value = '';
            emailInput.value = '';
            nameInput.value = '';
            phoneInput.classList.remove('glow-error');
            emailInput.classList.remove('glow-error');
            btnWhatsapp.disabled = true;
            btnEmail.disabled = true;

            updateReceiptHeader();
            setPaymentMode('Pending');
            resetSaveState();

            renderCart();
            renderMenu();
            clearModal.hide();
            showToast("Order cleared.", "info");
        }

        // --- Checkout & Export Operations ---
        async function processOrder() {
            if (STATE.cart.length === 0) {
                showToast("Cart is empty!", "warn");
                return;
            }

            const pVal = phoneInput.value;
            const eVal = emailInput.value;

            // Required contact validation
            if (!pVal && !eVal) {
                showToast("Please provide at least a Phone Number or Email.", "warn");
                phoneInput.classList.add('glow-error');
                emailInput.classList.add('glow-error');
                setTimeout(() => {
                    if (!phoneInput.value) phoneInput.classList.remove('glow-error');
                    if (!emailInput.value) emailInput.classList.remove('glow-error');
                }, 2000);
                return;
            }

            // Format validation
            if (pVal && !phoneRegex.test(pVal)) {
                showToast("Invalid phone number format.", "error"); return;
            }
            if (eVal && !emailRegex.test(eVal)) {
                showToast("Invalid email address format.", "error"); return;
            }

            const totalAmountStr = document.getElementById('cart-total').innerText.replace('₹', '');

            const orderPayload = {
                customer_phone: pVal,
                customer_email: eVal,
                customer_name:  nameInput.value,
                payment_mode:   STATE.paymentMode.toLowerCase(),
                total:          parseFloat(totalAmountStr),
                notes:          document.getElementById('order-notes')?.value?.trim() || '',
                timestamp:      new Date().toISOString(),
                cart: STATE.cart.map(i => ({
                    item_id:       i.item_id,
                    pricing_id:    i.pricing_id,
                    item_name:     i.name,
                    variant_label: i.variant_label,
                    unit_price:    i.price,
                    quantity:      i.qty,
                    subtotal:      i.price * i.qty
                }))
            };

            showLoader(true);
            try {
                const res = await placeOrderOnServer(orderPayload);
                showLoader(false);

                // Track saved order id for Mark Paid flow
                _activeOrderIdForPay = res.order_id || null;
                const isPending = (STATE.paymentMode || '').toLowerCase() === 'pending';

                showToast(`Order ${res.order_number} saved!`, "success");

                // Show order number in receipt
                const orderNumEl = document.getElementById('receipt-order-number');
                const orderNumBr = document.getElementById('receipt-order-number-br');
                if (orderNumEl) { orderNumEl.textContent = `Order #${res.order_number}`; orderNumEl.style.display = ''; }
                if (orderNumBr) orderNumBr.style.display = '';

                // Show post-save sharing options, set sharing button states
                document.getElementById('btn-save').disabled = true;
                const pVal2  = document.getElementById('cust-phone').value;
                const eVal2  = document.getElementById('cust-email').value;
                const bWA    = document.getElementById('btn-whatsapp');
                const bEmail = document.getElementById('btn-email');
                if (bWA)    bWA.disabled    = !pVal2;
                if (bEmail) bEmail.disabled = !eVal2;
                document.getElementById('post-save-actions').style.display = 'flex';

            } catch (err) {
                showLoader(false);
                showToast("Failed to save order. Check connection.", "error");
            }
        }

        function printBill() {
            if (STATE.cart.length === 0 && !_managedOrder) { showToast("Empty order cannot be printed.", "warn"); return; }
            window.print();
        }

        function sendEmail() {
            if (STATE.cart.length === 0 && !_managedOrder) { showToast("Empty order cannot be sent.", "warn"); return; }
            const em = emailInput.value;
            if (!em || !emailRegex.test(em)) {
                emailInput.classList.add('glow-error');
                showToast("Please provide a valid email address.", "warn");
                return;
            }

            showLoader(true);
            // Simulate Email Send
            setTimeout(() => {
                showLoader(false);
                showToast(`Receipt emailed to ${em}`, "success");
            }, 1200);
        }

        async function shareWhatsApp() {
            if (STATE.cart.length === 0) { showToast("Cart is empty!", "warn"); return; }

            const phone = document.getElementById('cust-phone').value;
            if (phone && !phoneRegex.test(phone)) {
                showToast("Fix phone number before sending.", "warn");
                return;
            }
            const targetPhone = phone ? `91${phone}` : '';

            const subtotal = document.getElementById('cart-subtotal').innerText;
            const tax = document.getElementById('cart-tax').innerText;
            const total = document.getElementById('cart-total').innerText;
            const dateStr = getFormattedDate();

            let text = `*${CONFIG.cafeName.toUpperCase()}*\n_${dateStr}_\n------------------------\n*Receipt Details:*\n\n`;
            STATE.cart.forEach((i, idx) => {
                const variant = i.variant_label ? ` (${i.variant_label})` : '';
                text += `${idx + 1}. ${i.name}${variant}\n   x ${i.qty}  -  Rs. ${i.price * i.qty}\n`;
            });
            text += `------------------------\nSubtotal: ${subtotal}\n`;
            if (CONFIG.enableTax) {
                text += `Tax (${STATE.taxRate * 100}%): ${tax}\n`;
            }
            const pmtStr = STATE.paymentMode === 'Online' ? 'Payment Via - Online' : 'Payment - ' + STATE.paymentMode;
            text += `*TOTAL: ${total}*\n${pmtStr}\n\nThank you for visiting!`;

            showLoader(true);
            let clone = null;
            try {
                const printArea = document.getElementById('invoice-print-area');

                // Clone for robust full-height capture (prevents truncation)
                clone = printArea.cloneNode(true);
                clone.style.position = 'absolute';
                clone.style.top = '-9999px';
                clone.style.left = '-9999px';
                clone.style.height = 'auto';
                clone.style.overflow = 'visible';
                clone.style.border = 'none';
                clone.style.width = printArea.offsetWidth + 'px';
                document.body.appendChild(clone);

                const canvas = await html2canvas(clone, { scale: 2, backgroundColor: "#ffffff", windowHeight: clone.scrollHeight });
                if (document.body.contains(clone)) document.body.removeChild(clone);

                canvas.toBlob(async (blob) => {
                    const file = new File([blob], `Receipt_${new Date().getTime()}.png`, { type: 'image/png' });

                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        try {
                            await navigator.share({ files: [file], title: `${CONFIG.cafeName} Receipt` });
                            showLoader(false);
                            return;
                        } catch (err) {
                            if (err.name !== 'AbortError') fallbackWhatsAppText(targetPhone, text);
                            showLoader(false);
                            return;
                        }
                    }
                    fallbackWhatsAppText(targetPhone, text);
                    showLoader(false);
                }, 'image/png');

            } catch (e) {
                if (clone && document.body.contains(clone)) document.body.removeChild(clone);
                fallbackWhatsAppText(targetPhone, text);
                showLoader(false);
            }
        }

        function fallbackWhatsAppText(phone, text) {
            const encodedText = encodeURIComponent(text);
            const whatsappUrl = phone
                ? `https://wa.me/${phone}?text=${encodedText}`
                : `https://wa.me/?text=${encodedText}`;
            window.open(whatsappUrl, '_blank');
            showToast("Opening WhatsApp with text receipt...", "info");
        }

        function downloadInvoiceImage() {
            if (STATE.cart.length === 0 && !_managedOrder) { showToast("Cart is empty!", "warn"); return; }
            showLoader(true);

            const printArea = document.getElementById('invoice-print-area');

            // Clone for robust full-height capture (prevents truncation)
            const clone = printArea.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.top = '-9999px';
            clone.style.left = '-9999px';
            clone.style.height = 'auto';
            clone.style.overflow = 'visible';
            clone.style.border = 'none';
            clone.style.width = printArea.offsetWidth + 'px';
            document.body.appendChild(clone);

            html2canvas(clone, { scale: 2, backgroundColor: "#ffffff", windowHeight: clone.scrollHeight }).then(canvas => {
                if (document.body.contains(clone)) document.body.removeChild(clone);

                const link = document.createElement('a');
                link.download = `Receipt_${new Date().getTime()}.png`;
                link.href = canvas.toDataURL('image/png');
                link.click();
                showLoader(false);
                showToast("Receipt Image Downloaded!", "success");
            }).catch(err => {
                if (document.body.contains(clone)) document.body.removeChild(clone);
                showLoader(false);
                showToast("Error generating image.", "error");
            });
        }

        // ============================================================
        // VIEW STATE MANAGEMENT
        // ============================================================

        let _posView            = 'landing'; // 'landing' | 'new-order' | 'orders'
        let _receiptMode        = 'billing'; // 'billing' | 'manage'
        let _managedOrder       = null;      // order currently in manage mode
        let _activeBillOrder    = null;      // legacy compat alias
        let _activeOrderIdForPay = null;     // just-saved dine-in order id

        const _oqFilter = { type: 'all', status: 'all' };

        function setPosView(view) {
            document.getElementById('pos-landing').style.display    = view === 'landing'   ? '' : 'none';
            document.getElementById('menu-section').style.display   = view === 'new-order' ? '' : 'none';
            document.getElementById('orders-section').style.display = view === 'orders'    ? '' : 'none';
            _posView = view;
        }

        function startNewDineIn() {
            setPosView('new-order');
            setReceiptMode('billing');
        }

        function openOrdersView() {
            setPosView('orders');
            fetchOrdersQueue();
            fetchOrdersEOD();
        }

        // ── Receipt mode: billing vs manage ──────────────────────────────────
        function setReceiptMode(mode) {
            _receiptMode = mode;
            const isBilling = mode === 'billing';

            // Unified customer inputs: always visible, just update label/state
            document.getElementById('receipt-customer-inputs').style.display = '';

            // Toggle action buttons
            document.getElementById('btn-save-label').textContent = isBilling ? 'Create Order' : 'Update Order';
            document.getElementById('btn-clear').style.display    = isBilling ? '' : 'none';
            document.getElementById('btn-back').style.display     = isBilling ? 'none' : '';

            // Order status row: always visible, hide Pending for billing (dine-in) mode
            document.getElementById('receipt-order-status').style.display = isBilling ? 'none' : '';
            const pendingBtn = document.getElementById('status-btn-pending');
            if (pendingBtn) pendingBtn.style.display = isBilling ? 'none' : '';

            // Reset status buttons to default (Confirmed) in billing mode
            if (isBilling) {
                const statusColors = { pending:'warning', confirmed:'info', completed:'success', cancelled:'danger' };
                document.querySelectorAll('#receipt-status-options [data-order-status]').forEach(b => {
                    const isActive = b.dataset.orderStatus === 'confirmed';
                    const c = statusColors[b.dataset.orderStatus] || 'secondary';
                    b.className = `btn btn-${isActive ? '' : 'outline-'}${c}`;
                });
            }

            // Hide post-save actions when switching to billing
            if (isBilling) {
                document.getElementById('post-save-actions').style.display = 'none';
                document.getElementById('btn-save').disabled = false;
            }
        }

        // ── Load single order into receipt for management ─────────────────────
        async function loadOrderInReceipt(orderId) {
            document.getElementById('cart-items-container').innerHTML =
                `<div class="text-center py-4"><div class="spinner-border spinner-border-sm text-primary"></div>
                 <span class="ms-2 small">Loading…</span></div>`;
            setReceiptMode('manage');
            try {
                const res  = await fetch(`/hhcpanel/api/orders.php?id=${orderId}`);
                const data = await res.json();
                if (!data.ok || !data.order) { showToast('Failed to load order', 'error'); setReceiptMode('billing'); return; }
                _managedOrder    = data.order;
                _activeBillOrder = data.order;
                const o = data.order;

                // Populate unified customer input fields
                document.getElementById('cust-phone').value = o.whatsapp || '';
                document.getElementById('cust-name').value  = o.customer_name || '';
                document.getElementById('cust-email').value = o.email || '';

                // Show order number in receipt
                const orderNumEl = document.getElementById('receipt-order-number');
                const orderNumBr = document.getElementById('receipt-order-number-br');
                orderNumEl.textContent = `Order #${o.order_number}`;
                orderNumEl.style.display = '';
                if (orderNumBr) orderNumBr.style.display = '';

                // If dine-in: hide Pending status button
                const pendingBtn = document.getElementById('status-btn-pending');
                if (pendingBtn) pendingBtn.style.display = o.order_type === 'dinein' ? 'none' : '';

                // Status btn-group
                const statusColors = { pending:'warning', confirmed:'info', completed:'success', cancelled:'danger' };
                document.querySelectorAll('#receipt-status-options [data-order-status]').forEach(b => {
                    const isActive = b.dataset.orderStatus === o.status;
                    const c = statusColors[b.dataset.orderStatus] || 'secondary';
                    b.className = `btn btn-${isActive ? '' : 'outline-'}${c}`;
                });
                const statusLabel = { pending:'Pending', confirmed:'Confirmed', completed:'Completed', cancelled:'Cancelled' };
                document.getElementById('receipt-order-status').textContent = 'Status – ' + (statusLabel[o.status] || o.status);

                // Payment mode
                const pmMode = o.payment_mode ? (o.payment_mode.charAt(0).toUpperCase() + o.payment_mode.slice(1)) : 'Pending';
                document.querySelectorAll('.payment-btn-group .btn').forEach(b => b.classList.remove('active'));
                const pmBtn = document.querySelector(`.payment-btn-group .btn[data-mode="${pmMode}"]`);
                if (pmBtn) pmBtn.classList.add('active');
                document.getElementById('receipt-payment-mode').textContent = 'Payment – ' + pmMode;
                document.getElementById('receipt-payment-mode').style.color = pmMode === 'Pending' ? 'var(--pending-color)' : 'var(--success-color)';

                renderManagedItems(o.items || [], o.total_amount);

                // Read-only mode for completed/cancelled orders
                const isReadOnly = (o.status === 'completed' || o.status === 'cancelled');
                document.getElementById('btn-save').disabled = isReadOnly;
                document.querySelectorAll('#receipt-status-options .btn').forEach(b => b.disabled = isReadOnly);
                document.querySelectorAll('.payment-btn-group .btn').forEach(b => b.disabled = isReadOnly);
                document.getElementById('cust-phone').disabled = isReadOnly;
                document.getElementById('cust-name').disabled  = isReadOnly;
                document.getElementById('cust-email').disabled = isReadOnly;

                // Show sharing options immediately for manage mode
                const btnWhatsapp = document.getElementById('btn-whatsapp');
                const btnEmail    = document.getElementById('btn-email');
                if (btnWhatsapp) btnWhatsapp.disabled = !o.whatsapp;
                if (btnEmail)    btnEmail.disabled    = !o.email;
                document.getElementById('post-save-actions').style.display = 'flex';
            } catch(e) { showToast('Network error', 'error'); setReceiptMode('billing'); }
        }

        function renderManagedItems(items, total) {
            const container = document.getElementById('cart-items-container');
            if (!items.length) { container.innerHTML = `<div class="text-center text-muted py-3 small">No items</div>`; return; }
            container.innerHTML = items.map(i => `
                <div class="cart-item">
                    <div style="flex:2;padding-right:10px;">
                        <div class="fw-bold text-dark text-truncate" style="font-size:.85rem;line-height:1.2">${escapeHtml(i.item_name)}</div>
                        <div class="text-muted mt-1" style="font-size:.75rem;">
                            ${i.variant_label ? `<span class="badge bg-light text-secondary border me-1">${escapeHtml(i.variant_label)}</span>` : ''}
                            ₹${parseFloat(i.unit_price).toFixed(0)}
                            <span class="fw-bold px-1 text-primary-theme bg-light rounded border ms-1">x ${i.quantity}</span>
                        </div>
                    </div>
                    <div class="text-end fw-bold text-primary-theme fs-6" style="flex:1;">₹${parseFloat(i.subtotal || i.unit_price * i.quantity).toFixed(0)}</div>
                </div>
            `).join('');
            const t = parseFloat(total);
            document.getElementById('cart-subtotal').textContent = `₹${t.toFixed(2)}`;
            document.getElementById('cart-tax').textContent      = `₹0.00`;
            document.getElementById('cart-total').textContent    = `₹${t.toFixed(2)}`;
        }

        // ── Update status via receipt status btn-group ────────────────────────
        async function setReceiptStatus(status) {
            if (!_managedOrder) return;

            // Read-only guard
            if (_managedOrder.status === 'completed' || _managedOrder.status === 'cancelled') {
                showToast('Order is read-only and cannot be updated', 'warn'); return;
            }
            // Unpaid cannot be completed
            if (status === 'completed' && _managedOrder.payment_mode === 'pending') {
                showToast('Pay the order before marking it as Completed', 'warn'); return;
            }
            // Dine-in cannot be set to pending
            if (_managedOrder.order_type === 'dinein' && status === 'pending') {
                showToast('Dine-in orders cannot be set to Pending', 'warn'); return;
            }

            const statusColors = { pending:'warning', confirmed:'info', completed:'success', cancelled:'danger' };
            const statusLabel  = { pending:'Pending', confirmed:'Confirmed', completed:'Completed', cancelled:'Cancelled' };
            document.querySelectorAll('#receipt-status-options [data-order-status]').forEach(b => {
                const isActive = b.dataset.orderStatus === status;
                const c = statusColors[b.dataset.orderStatus] || 'secondary';
                b.className = `btn btn-${isActive ? '' : 'outline-'}${c}`;
            });
            document.getElementById('receipt-order-status').textContent = 'Status – ' + (statusLabel[status] || status);
            _managedOrder.status = status;

            try {
                const res  = await fetch('/hhcpanel/api/orders.php', {
                    method:  'POST',
                    headers: { 'Content-Type':'application/json', 'X-CSRF-Token': CSRF },
                    body:    JSON.stringify({ action:'update_status', id: _managedOrder.id, status })
                });
                const data = await res.json();
                if (data.ok) {
                    showToast(`Status → ${statusLabel[status] || status}`, 'success');
                    // If cancelled, set total to ₹0 in UI
                    if (status === 'cancelled') {
                        _managedOrder.total_amount = 0;
                        document.getElementById('cart-subtotal').textContent = '₹0.00';
                        document.getElementById('cart-tax').textContent      = '₹0.00';
                        document.getElementById('cart-total').textContent    = '₹0.00';
                    }
                    // Disable controls for completed/cancelled
                    if (status === 'completed' || status === 'cancelled') {
                        document.getElementById('btn-save').disabled = true;
                        document.querySelectorAll('#receipt-status-options .btn').forEach(b => b.disabled = true);
                        document.querySelectorAll('.payment-btn-group .btn').forEach(b => b.disabled = true);
                        document.getElementById('cust-phone').disabled = true;
                        document.getElementById('cust-name').disabled  = true;
                        document.getElementById('cust-email').disabled = true;
                    }
                } else { showToast(data.error || 'Update failed', 'error'); }
            } catch(e) { showToast('Network error', 'error'); }
        }

        // ── Mark managed order as paid (via payment-options btn-group) ────────
        async function markManagedOrderPaid(mode) {
            if (!_managedOrder) return;
            try {
                const res  = await fetch('/hhcpanel/api/orders.php', {
                    method:  'POST',
                    headers: { 'Content-Type':'application/json', 'X-CSRF-Token': CSRF },
                    body:    JSON.stringify({ action:'update_payment', id: _managedOrder.id, payment_mode: mode })
                });
                const data = await res.json();
                if (data.ok) {
                    showToast(`Marked as paid (${mode})`, 'success');
                    _managedOrder.payment_mode = mode;
                    const pmLabel = mode.charAt(0).toUpperCase() + mode.slice(1);
                    document.querySelectorAll('.payment-btn-group .btn').forEach(b => b.classList.remove('active'));
                    const pmBtn = document.querySelector(`.payment-btn-group .btn[data-mode="${pmLabel}"]`);
                    if (pmBtn) pmBtn.classList.add('active');
                    document.getElementById('receipt-payment-mode').textContent = `Payment – ${pmLabel}`;
                    document.getElementById('receipt-payment-mode').style.color = 'var(--success-color)';
                } else { showToast(data.error || 'Update failed', 'error'); }
            } catch(e) { showToast('Network error', 'error'); }
        }

        // ── Exit manage mode ──────────────────────────────────────────────────
        function exitManageMode() {
            _managedOrder    = null;
            _activeBillOrder = null;

            // Clear customer inputs
            document.getElementById('cust-phone').value    = '';
            document.getElementById('cust-name').value     = '';
            document.getElementById('cust-email').value    = '';
            document.getElementById('cust-phone').disabled = false;
            document.getElementById('cust-name').disabled  = false;
            document.getElementById('cust-email').disabled = false;

            // Hide order number
            const orderNumEl = document.getElementById('receipt-order-number');
            const orderNumBr = document.getElementById('receipt-order-number-br');
            if (orderNumEl) { orderNumEl.style.display = 'none'; orderNumEl.textContent = ''; }
            if (orderNumBr) orderNumBr.style.display = 'none';

            // Re-enable controls
            document.getElementById('btn-save').disabled = false;
            document.querySelectorAll('#receipt-status-options .btn').forEach(b => b.disabled = false);
            document.querySelectorAll('.payment-btn-group .btn').forEach(b => b.disabled = false);

            setReceiptMode('billing');
            renderCart();
            setPaymentMode('Pending');
        }

        // ── WhatsApp for managed order ────────────────────────────────────────
        function sendManagedWhatsApp() {
            if (!_managedOrder) return;
            const o = _managedOrder;
            const itemsText = (o.items||[]).map(i =>
                `  ${i.item_name}${i.variant_label?' ('+i.variant_label+')':''} x${i.quantity} ₹${parseFloat(i.subtotal||i.unit_price*i.quantity).toFixed(0)}`
            ).join('\n');
            const msg = `*${CONFIG.cafeName}*\nOrder: #${o.order_number}\nStatus: ${o.status}\nPayment: ${o.payment_mode}\n\n${itemsText}\n\n*Total: ₹${parseFloat(o.total_amount).toFixed(0)}*\nThank you! 🙏`;
            const phone = (o.whatsapp||'').replace(/\D/g,'');
            window.open(`https://wa.me/${phone.length>=10?'91'+phone.slice(-10):''}?text=${encodeURIComponent(msg)}`, '_blank');
        }

        // ── Landing stats ─────────────────────────────────────────────────────
        async function fetchLandingStats() {
            try {
                const res  = await fetch('/hhcpanel/api/stats.php?period=today');
                const data = await res.json();
                if (!data.ok) return;
                const s = data.summary;
                const cards = [
                    { label:'Total',     value: s.order_count,    color:'secondary', icon:'bi-receipt' },
                    { label:'Pending',   value: s.pending_count,  color:'warning',   icon:'bi-hourglass-split' },
                    { label:'Confirmed', value: s.confirmed_count, color:'info',     icon:'bi-check-circle' },
                    { label:'Completed', value: s.completed_count, color:'success',  icon:'bi-bag-check' },
                    { label:'Cancelled', value: s.cancelled_count, color:'danger',   icon:'bi-x-circle' },
                ];
                document.getElementById('landing-stats').innerHTML =
                    cards.map(c => `
                        <div class="col-6 col-sm-4 col-md">
                            <div class="card text-center shadow-sm py-2 h-100" style="border-top:3px solid var(--bs-${c.color})">
                                <div class="card-body py-1 px-2">
                                    <i class="bi ${c.icon} fs-4 text-${c.color} mb-1 d-block"></i>
                                    <div class="fw-bold fs-4 text-${c.color}">${c.value}</div>
                                    <div class="text-muted" style="font-size:.75rem">${c.label}</div>
                                </div>
                            </div>
                        </div>
                    `).join('') + `
                    <div class="col-12 mt-2">
                        <div class="card shadow-sm py-2" style="border-top:3px solid #388e3c">
                            <div class="card-body py-1 d-flex justify-content-around text-center flex-wrap gap-2">
                                <div><div class="fw-bold fs-5 text-success">₹${parseFloat(s.revenue||0).toFixed(0)}</div><div class="text-muted small">Revenue</div></div>
                                <div><div class="fw-bold fs-5 text-success">₹${parseFloat(s.cash_revenue||0).toFixed(0)}</div><div class="text-muted small">Cash</div></div>
                                <div><div class="fw-bold fs-5 text-primary">₹${parseFloat(s.online_revenue||0).toFixed(0)}</div><div class="text-muted small">Online</div></div>
                            </div>
                        </div>
                    </div>`;
                updateOnlineBadge(s.pending_count);
            } catch(e) {}
        }

        // ── Orders section EOD strip ──────────────────────────────────────────
        async function fetchOrdersEOD() {
            try {
                const res  = await fetch('/hhcpanel/api/stats.php?period=today');
                const data = await res.json();
                if (!data.ok) return;
                const s = data.summary;
                document.getElementById('oq-eod-orders').textContent    = s.order_count;
                document.getElementById('oq-eod-pending').textContent   = s.pending_count;
                document.getElementById('oq-eod-confirmed').textContent = s.confirmed_count;
                document.getElementById('oq-eod-completed').textContent = s.completed_count;
                document.getElementById('oq-eod-revenue').textContent   = '₹' + parseFloat(s.revenue||0).toFixed(0);
                document.getElementById('oq-eod-cash').textContent      = '₹' + parseFloat(s.cash_revenue||0).toFixed(0);
                document.getElementById('oq-eod-online').textContent    = '₹' + parseFloat(s.online_revenue||0).toFixed(0);
            } catch(e) {}
        }

        // ── Filter chip clicks ────────────────────────────────────────────────
        document.querySelectorAll('.oq-chip').forEach(btn => {
            btn.addEventListener('click', function() {
                const filter = this.dataset.filter;
                const val    = this.dataset.val;
                document.querySelectorAll(`.oq-chip[data-filter="${filter}"]`).forEach(b => {
                    b.classList.forEach(c => {
                        if (c.startsWith('btn-') && !c.startsWith('btn-outline-') && !c.startsWith('btn-sm')) b.classList.remove(c);
                    });
                    if (!b.className.includes('btn-outline-')) b.classList.add('btn-outline-secondary');
                });
                this.classList.forEach(c => { if (c.startsWith('btn-outline-')) this.classList.remove(c); });
                const colorMap = { all:'secondary', online:'primary', dinein:'primary', pending:'warning', confirmed:'info', completed:'success', cancelled:'secondary' };
                this.classList.add('btn-' + (colorMap[val] || 'secondary'));
                _oqFilter[filter] = val;
                fetchOrdersQueue();
            });
        });

        // ── Fetch orders from server ──────────────────────────────────────────
        async function fetchOrdersQueue() {
            const today   = document.getElementById('oq-today-toggle')?.checked;
            const params  = new URLSearchParams({ per_page: 50, view: today ? 'today' : 'all' });
            if (_oqFilter.type   !== 'all') params.set('order_type', _oqFilter.type);
            if (_oqFilter.status !== 'all') params.set('status',     _oqFilter.status);

            const refreshBtn = document.getElementById('oq-refresh-btn');
            if (refreshBtn) { refreshBtn.disabled = true; refreshBtn.querySelector('i').style.transform = 'rotate(360deg)'; }

            try {
                const res  = await fetch('/hhcpanel/api/orders.php?' + params.toString());
                const data = await res.json();
                if (data.ok) {
                    renderOrdersQueue(data.orders || []);
                    const pendingOnline = (data.orders||[]).filter(o => o.status==='pending' && o.order_type==='online').length;
                    updateOnlineBadge(pendingOnline);
                } else {
                    document.getElementById('orders-queue-body').innerHTML =
                        `<div class="alert alert-warning py-2 small">${escapeHtml(data.error || 'Failed to load')}</div>`;
                }
            } catch(e) {
                document.getElementById('orders-queue-body').innerHTML =
                    `<div class="alert alert-danger py-2 small">Network error — check connection</div>`;
            } finally {
                if (refreshBtn) { refreshBtn.disabled = false; refreshBtn.querySelector('i').style.transform = ''; }
            }
        }

        function updateOnlineBadge(count) {
            const badge = document.getElementById('new-orders-badge');
            if (!badge) return;
            badge.textContent = count;
            badge.style.display = count > 0 ? '' : 'none';
        }

        function timeAgo(dtStr) {
            const diff = Math.floor((Date.now() - new Date(dtStr)) / 1000);
            if (diff < 60)   return diff + 's ago';
            if (diff < 3600) return Math.floor(diff/60) + 'm ago';
            return Math.floor(diff/3600) + 'h ago';
        }

        // ── Render orders table with inline updates ───────────────────────────
        function renderOrdersQueue(orders) {
            const el = document.getElementById('orders-queue-body');
            if (!orders.length) {
                el.innerHTML = `<div class="text-center text-muted py-5">
                    <i class="bi bi-inbox fs-2 opacity-40 d-block mb-2"></i>No orders found</div>`;
                return;
            }
            const rows = orders.map(o => {
                const typeBadge = o.order_type === 'online'
                    ? `<span class="badge" style="font-size:.6rem;background:#e3f2fd;color:#0d47a1;border:1px solid #90caf9">Online</span>`
                    : `<span class="badge" style="font-size:.6rem;background:#fff8e1;color:#6d4c41;border:1px solid #ffcc80">Dine-In</span>`;
                const payColors = { pending:'warning text-dark', cash:'success text-white', online:'primary text-white' };
                const isPending   = o.payment_mode === 'pending';
                const isReadOnly  = (o.status === 'completed' || o.status === 'cancelled');
                const isDineIn    = o.order_type === 'dinein';

                // Status select: disabled for completed/cancelled; pending option hidden for dine-in
                const pendingOpt = isDineIn ? '' : `<option value="pending" ${o.status==='pending'?'selected':''}>Pending</option>`;
                const statusSelect = `<select class="form-select form-select-sm py-0"
                    style="font-size:.75rem;width:auto;min-width:90px"
                    data-payment="${escapeHtml(o.payment_mode)}"
                    data-order-type="${escapeHtml(o.order_type)}"
                    data-cur-status="${escapeHtml(o.status)}"
                    ${isReadOnly ? 'disabled' : ''}
                    onchange="updateOrderStatusInline(${o.id}, this.value, this)">
                    ${pendingOpt}
                    <option value="confirmed" ${o.status==='confirmed'?'selected':''}>Confirmed</option>
                    <option value="completed" ${o.status==='completed'?'selected':''}>Completed</option>
                    <option value="cancelled" ${o.status==='cancelled'?'selected':''}>Cancelled</option>
                </select>`;

                // Payment cell: no buttons for completed/cancelled; buttons with confirm for pending
                const paymentCell = isReadOnly
                    ? `<span class="badge bg-${(payColors[o.payment_mode]||'warning text-dark').split(' ')[0]}" style="font-size:.7rem">${o.payment_mode}</span>`
                    : (isPending
                        ? `<button class="btn btn-success btn-sm py-0 me-1" style="font-size:.72rem" onclick="updateOrderPaymentInline(${o.id},'cash',this)" title="Cash Paid"><i class="bi bi-cash"></i></button>
                           <button class="btn btn-primary btn-sm py-0" style="font-size:.72rem" onclick="updateOrderPaymentInline(${o.id},'online',this)" title="Online Paid"><i class="bi bi-qr-code"></i></button>`
                        : `<span class="badge bg-${(payColors[o.payment_mode]||'warning text-dark').split(' ')[0]}" style="font-size:.7rem">${o.payment_mode}</span>`
                    );

                return `<tr ${isReadOnly ? 'class="table-secondary opacity-75"' : ''}>
                    <td style="white-space:nowrap">
                        <strong style="font-size:.78rem">${escapeHtml(o.order_number)}</strong>
                        <div class="mt-1">${typeBadge}</div>
                    </td>
                    <td>
                        <div style="font-size:.82rem">${escapeHtml(o.customer_name||'—')}</div>
                        <div style="font-size:.72rem;color:#888">${escapeHtml(o.whatsapp||'')}</div>
                    </td>
                    <td class="text-center" style="font-size:.82rem">${parseInt(o.item_count)||0}</td>
                    <td style="font-size:.82rem;font-weight:600">₹${parseFloat(o.total_amount||0).toFixed(0)}</td>
                    <td>${statusSelect}</td>
                    <td style="white-space:nowrap">${paymentCell}</td>
                    <td style="font-size:.72rem;color:#888;white-space:nowrap">${o.created_at ? timeAgo(o.created_at) : ''}</td>
                    <td>
                        <button class="btn btn-outline-primary btn-sm py-0 px-2" style="font-size:.75rem"
                                onclick="loadOrderInReceipt(${o.id})">
                            <i class="bi bi-receipt me-1"></i>Manage
                        </button>
                    </td>
                </tr>`;
            }).join('');

            el.innerHTML = `<div class="table-responsive">
                <table class="table table-sm table-hover align-middle mb-0" style="font-size:.83rem">
                    <thead class="table-light">
                        <tr>
                            <th>Order #</th><th>Customer</th><th class="text-center">Items</th>
                            <th>Total</th><th>Status</th><th>Payment</th><th>Time</th><th></th>
                        </tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
        }

        // ── Inline row updates ────────────────────────────────────────────────
        async function updateOrderStatusInline(orderId, status, selectEl) {
            const payment   = selectEl.dataset.payment;
            const orderType = selectEl.dataset.orderType;
            const curStatus = selectEl.dataset.curStatus;

            // Guard: read-only
            if (curStatus === 'completed' || curStatus === 'cancelled') {
                showToast('Completed/Cancelled orders are read-only', 'warn');
                selectEl.value = curStatus; return;
            }
            // Guard: dine-in cannot be pending
            if (orderType === 'dinein' && status === 'pending') {
                showToast('Dine-in orders cannot be set to Pending', 'warn');
                selectEl.value = curStatus; return;
            }
            // Guard: unpaid cannot be completed
            if (status === 'completed' && payment === 'pending') {
                showToast('Pay the order before marking it as Completed', 'warn');
                selectEl.value = curStatus; return;
            }

            try {
                const res  = await fetch('/hhcpanel/api/orders.php', {
                    method:  'POST',
                    headers: { 'Content-Type':'application/json', 'X-CSRF-Token': CSRF },
                    body:    JSON.stringify({ action:'update_status', id: orderId, status })
                });
                const data = await res.json();
                if (data.ok) { showToast(`Status → ${status}`, 'success'); fetchOrdersQueue(); fetchOrdersEOD(); }
                else { showToast(data.error || 'Update failed', 'error'); fetchOrdersQueue(); }
            } catch(e) { showToast('Network error', 'error'); }
        }

        async function updateOrderPaymentInline(orderId, mode, btnEl) {
            if (!confirm(`Mark this order as paid via ${mode}?`)) return;
            btnEl.disabled = true;
            try {
                const res  = await fetch('/hhcpanel/api/orders.php', {
                    method:  'POST',
                    headers: { 'Content-Type':'application/json', 'X-CSRF-Token': CSRF },
                    body:    JSON.stringify({ action:'update_payment', id: orderId, payment_mode: mode })
                });
                const data = await res.json();
                if (data.ok) { showToast(`Paid (${mode})`, 'success'); fetchOrdersQueue(); fetchOrdersEOD(); }
                else { showToast(data.error || 'Update failed', 'error'); btnEl.disabled = false; }
            } catch(e) { showToast('Network error', 'error'); btnEl.disabled = false; }
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        }

        // ── Dispatch primary action based on receipt mode ──────────────────
        function processPrimaryAction() {
            if (_receiptMode === 'manage') {
                updateManagedOrder();
            } else {
                processOrder();
            }
        }

        // ── Update customer details for a managed order ───────────────────────
        async function updateManagedOrder() {
            if (!_managedOrder) return;
            const name  = document.getElementById('cust-name').value.trim();
            const phone = document.getElementById('cust-phone').value.trim();
            const email = document.getElementById('cust-email').value.trim();
            try {
                const res  = await fetch('/hhcpanel/api/orders.php', {
                    method:  'POST',
                    headers: { 'Content-Type':'application/json', 'X-CSRF-Token': CSRF },
                    body:    JSON.stringify({ action:'update_customer', id: _managedOrder.id, customer_name: name, whatsapp: phone, email })
                });
                const data = await res.json();
                if (data.ok) {
                    showToast('Order updated!', 'success');
                    _managedOrder.customer_name = name;
                    _managedOrder.whatsapp      = phone;
                    _managedOrder.email         = email;
                    const btnWA    = document.getElementById('btn-whatsapp');
                    const btnEmail = document.getElementById('btn-email');
                    if (btnWA)    btnWA.disabled    = !phone;
                    if (btnEmail) btnEmail.disabled = !email;
                    document.getElementById('post-save-actions').style.display = 'flex';
                } else { showToast(data.error || 'Update failed', 'error'); }
            } catch(e) { showToast('Network error', 'error'); }
        }

        // ── Share WhatsApp (billing or manage mode) ───────────────────────────
        function shareAnyWhatsApp() {
            if (_receiptMode === 'manage') {
                sendManagedWhatsApp();
            } else {
                shareWhatsApp();
            }
        }
    </script>
</body>

</html>
