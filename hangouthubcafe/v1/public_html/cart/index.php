<?php /* Hangout Hub Cafe v1 — cart/index.php */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart &amp; Checkout | HANGOUT HUB CAFE</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css">

    <style>
        :root {
            --color-bg: #050505;
            --color-surface: #0a0a0a;
            --color-surface-light: #111111;
            --color-primary: #D4AF37;
            --color-primary-light: #F4D03F;
            --color-primary-dark: #997A00;
            --color-primary-glow: rgba(212, 175, 55, 0.2);
            --text-primary: #F8F9FA;
            --text-secondary: #A0A0A0;
            --border-color: rgba(212, 175, 55, 0.15);
            --font-heading: 'Cinzel', serif;
            --font-body: 'Montserrat', sans-serif;
            --transition-fast: 0.2s ease;
            --transition-medium: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            --shadow-glow: 0 0 20px var(--color-primary-glow);
        }

        * { box-sizing: border-box; }

        body {
            background-color: var(--color-bg);
            color: var(--text-primary);
            font-family: var(--font-body);
            min-height: 100vh;
            -webkit-font-smoothing: antialiased;
        }

        h1, h2, h3, h4, h5, h6, .font-heading {
            font-family: var(--font-heading);
            font-weight: 500;
            letter-spacing: 1px;
        }

        a { color: var(--text-primary); text-decoration: none; transition: color var(--transition-fast); }
        a:hover { color: var(--color-primary); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: var(--color-bg); }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }

        /* ── Navbar ─────────────────────────────────────────────────────── */
        #navbar {
            background: rgba(5, 5, 5, 0.90);
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
            border-bottom: 1px solid var(--border-color);
            padding: 12px 0;
        }
        .navbar-brand {
            font-family: var(--font-heading);
            font-size: clamp(1rem, 1.5vw, 1.5rem);
            letter-spacing: clamp(1.6px, 0.38vw, 4px);
            text-transform: uppercase;
            background: linear-gradient(135deg, #fff2b0 0%, #f4d03f 32%, #d4af37 58%, #b8860b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .back-link {
            font-size: 0.78rem;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--text-secondary);
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color var(--transition-fast);
        }
        .back-link:hover { color: var(--color-primary); }

        /* ── Page Layout ────────────────────────────────────────────────── */
        .page-wrap {
            max-width: 960px;
            margin: 0 auto;
            padding: 100px 16px 60px;
        }
        .section-title {
            font-size: clamp(1.25rem, 2.5vw, 1.8rem);
            text-transform: uppercase;
            letter-spacing: 3px;
            color: var(--text-primary);
            margin-bottom: 1.5rem;
        }

        /* ── Cart Item Cards ──────────────────────────────────────────── */

        /* Shared across breakpoints */
        .cart-item-card {
            background: var(--color-surface-light);
            border: 1px solid var(--border-color);
            margin-bottom: 6px;
            overflow: hidden;
            transition: background var(--transition-fast), border-color var(--transition-fast);
        }
        .cart-item-card:hover {
            background: #141414;
            border-color: rgba(212,175,55,0.3);
        }
        .cart-item-name {
            font-family: var(--font-heading);
            font-size: 0.95rem;
            color: var(--color-primary-light);
            margin-bottom: 4px;
            white-space: normal;
            word-break: break-word;
            line-height: 1.3;
        }
        .cart-item-variant {
            font-size: 0.73rem;
            color: var(--text-secondary);
            letter-spacing: 0.3px;
        }
        .qty-btn {
            width: 30px; height: 30px;
            background: transparent;
            border: 1px solid var(--border-color);
            color: var(--color-primary);
            font-size: 0.75rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all var(--transition-fast);
            cursor: pointer;
        }
        .qty-btn:hover {
            border-color: var(--color-primary);
            background: rgba(212,175,55,0.12);
        }
        .qty-value {
            min-width: 28px;
            text-align: center;
            font-family: var(--font-heading);
            font-weight: 700;
            font-size: 1rem;
        }
        .item-subtotal {
            font-family: var(--font-heading);
            font-size: 1.05rem;
            color: var(--color-primary);
            white-space: nowrap;
        }

        /* ── Desktop: single horizontal grid row (≥576px) ── */
        @media (min-width: 576px) {
            .cart-list-header {
                display: grid;
                grid-template-columns: 96px 1fr 90px 120px 90px 48px;
                padding: 8px 0 10px;
                border-bottom: 1px solid rgba(212,175,55,0.2);
                margin-bottom: 8px;
            }
            .cart-list-header > div {
                font-size: 0.6rem;
                letter-spacing: 2px;
                text-transform: uppercase;
                color: var(--color-primary);
                font-family: var(--font-heading);
                text-align: center;
            }
            .cart-list-header > div:nth-child(2) {
                text-align: left;
                padding-left: 24px;
            }
            .cart-item-card {
                display: grid;
                grid-template-columns: 96px 1fr 90px 120px 90px 48px;
                grid-template-rows: 96px;
                align-items: stretch;
            }
            .cart-item-top,
            .cart-item-bottom { display: contents; }
            .cart-item-img {
                grid-column: 1; grid-row: 1;
                width: 100%; height: 100%;
                object-fit: cover;
                display: block;
            }
            .cart-item-info {
                grid-column: 2; grid-row: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 0 24px;
                min-width: 0;
                border-left: 1px solid rgba(255,255,255,0.05);
            }
            .cart-unit-price {
                grid-column: 3; grid-row: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-left: 1px solid rgba(255,255,255,0.05);
                padding: 0 8px;
                font-size: 0.92rem;
                color: var(--text-primary);
                font-family: var(--font-heading);
            }
            .cart-unit-price span {
                display: block;
                font-size: 0.6rem;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: var(--text-secondary);
                margin-bottom: 5px;
                font-family: var(--font-body);
            }
            .cart-qty-wrap {
                grid-column: 4; grid-row: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                border-left: 1px solid rgba(255,255,255,0.05);
                padding: 0 12px;
            }
            .cart-subtotal {
                grid-column: 5; grid-row: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-left: 1px solid rgba(255,255,255,0.05);
                padding: 0 8px;
                text-align: center;
            }
            .cart-subtotal span {
                display: block;
                font-size: 0.6rem;
                letter-spacing: 1.5px;
                text-transform: uppercase;
                color: var(--text-secondary);
                margin-bottom: 5px;
                font-family: var(--font-body);
            }
            .remove-btn {
                grid-column: 6; grid-row: 1;
                width: 100%; height: 100%;
                border: none;
                border-left: 1px solid rgba(255,255,255,0.05);
                background: transparent;
                color: rgba(224,64,64,0.45);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.82rem;
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            .remove-btn:hover {
                background: rgba(224,64,64,0.1);
                color: #ff6060;
            }
        }

        /* ── Mobile: stacked card (<576px) ── */
        @media (max-width: 575px) {
            .cart-list-header { display: none; }
            .cart-item-card { padding: 14px; }
            .cart-item-top {
                display: flex;
                align-items: flex-start;
                gap: 12px;
                margin-bottom: 12px;
            }
            .cart-item-img {
                width: 80px; height: 80px;
                object-fit: cover;
                border: 1px solid var(--border-color);
                flex-shrink: 0;
            }
            .cart-item-info { flex: 1; min-width: 0; }
            .cart-item-bottom {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 8px;
                padding-top: 10px;
                border-top: 1px solid rgba(255,255,255,0.06);
            }
            .cart-unit-price {
                font-size: 0.85rem;
                color: var(--text-secondary);
                min-width: 52px;
            }
            .cart-unit-price span {
                display: block;
                font-size: 0.65rem;
                letter-spacing: 1px;
                text-transform: uppercase;
                margin-bottom: 2px;
            }
            .cart-qty-wrap { display: inline-flex; align-items: center; gap: 6px; }
            .cart-subtotal { text-align: right; min-width: 60px; }
            .cart-subtotal span {
                display: block;
                font-size: 0.65rem;
                letter-spacing: 1px;
                text-transform: uppercase;
                color: var(--text-secondary);
                margin-bottom: 2px;
            }
            .remove-btn {
                background: transparent;
                border: 1px solid rgba(224,64,64,0.35);
                color: #e04040;
                width: 32px; height: 32px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 0.85rem;
                transition: all var(--transition-fast);
                cursor: pointer;
                flex-shrink: 0;
            }
            .remove-btn:hover {
                background: rgba(224,64,64,0.12);
                border-color: #e04040;
                color: #ff6060;
            }
        }

        /* ── Summary ────────────────────────────────────────────────────── */
        .cart-summary {
            background: var(--color-surface-light);
            border: 1px solid var(--border-color);
            padding: 28px;
            margin-top: 24px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            font-size: 0.875rem;
            color: var(--text-secondary);
        }
        .summary-total {
            font-family: var(--font-heading);
            font-size: 1.4rem;
            color: var(--color-primary);
            font-weight: 700;
        }
        .summary-total-label {
            font-family: var(--font-heading);
            font-size: 1rem;
            color: var(--text-primary);
        }

        /* ── Buttons ────────────────────────────────────────────────────── */
        .btn-gold-solid {
            background: var(--color-primary);
            color: var(--color-bg);
            border: 1px solid var(--color-primary);
            padding: 12px 32px;
            font-family: var(--font-heading);
            letter-spacing: 2px;
            text-transform: uppercase;
            font-size: 0.85rem;
            font-weight: bold;
            transition: all var(--transition-medium);
            cursor: pointer;
            border-radius: 0;
            width: 100%;
        }
        .btn-gold-solid:hover {
            background: var(--color-primary-light);
            box-shadow: var(--shadow-glow);
        }
        .btn-gold-solid:disabled {
            opacity: 0.55;
            cursor: not-allowed;
        }

        /* ── Empty Cart ─────────────────────────────────────────────────── */
        .empty-cart {
            text-align: center;
            padding: 80px 20px;
        }
        .empty-cart-icon {
            font-size: 4rem;
            color: rgba(212,175,55,0.25);
            margin-bottom: 20px;
        }
        .empty-cart h3 {
            font-size: 1.4rem;
            color: var(--text-secondary);
            margin-bottom: 10px;
        }

        /* ── Checkout Form ──────────────────────────────────────────────── */
        #checkout-section {
            display: none;
            margin-top: 36px;
            padding-top: 32px;
            border-top: 1px solid var(--border-color);
        }
        #checkout-section.visible { display: block; }

        .form-label {
            font-size: 0.72rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }
        .form-control, .form-select {
            background: rgba(255,255,255,0.03) !important;
            border: 1px solid rgba(255,255,255,0.15) !important;
            color: var(--text-primary) !important;
            border-radius: 0 !important;
            padding: 10px 14px;
            font-size: 0.875rem;
            transition: border-color var(--transition-fast);
        }
        .form-control:focus, .form-select:focus {
            border-color: var(--color-primary) !important;
            box-shadow: 0 0 0 2px rgba(212,175,55,0.12) !important;
            outline: none;
        }
        .form-control::placeholder { color: rgba(245,240,230,0.4); }

        /* ── Success Card ───────────────────────────────────────────────── */
        #success-card {
            display: none;
            text-align: center;
            padding: 48px 20px;
            background: rgba(212,175,55,0.07);
            border: 1px solid rgba(212,175,55,0.30);
            margin-top: 20px;
        }
        #success-card.visible { display: block; }

        /* ── Order Success Details ──────────────────────────────────────── */
        .sod-wrap {
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(212,175,55,0.18);
            max-width: 440px;
            margin: 0 auto;
            text-align: left;
            font-size: 0.85rem;
        }
        .sod-meta {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 6px;
            padding: 9px 14px;
            border-bottom: 1px solid rgba(255,255,255,0.06);
            color: var(--text-secondary);
            font-size: 0.76rem;
        }
        .sod-items { padding: 6px 0; }
        .sod-item-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 7px 14px;
            border-bottom: 1px solid rgba(255,255,255,0.04);
            gap: 12px;
        }
        .sod-item-row:last-child { border-bottom: none; }
        .sod-item-name { color: var(--text-primary); flex: 1; line-height: 1.4; }
        .sod-item-variant { display: block; font-size: 0.7rem; color: var(--text-secondary); }
        .sod-item-right { color: var(--text-secondary); white-space: nowrap; font-size: 0.82rem; flex-shrink: 0; }
        .sod-item-price { color: var(--text-primary); margin-left: 4px; }
        .sod-total {
            display: flex;
            justify-content: space-between;
            padding: 10px 14px;
            border-top: 1px solid rgba(212,175,55,0.2);
            font-family: var(--font-heading);
            color: var(--color-primary);
            font-size: 0.95rem;
        }

        /* ── Error Alert ────────────────────────────────────────────────── */
        .error-alert {
            background: rgba(224,64,64,0.08);
            border: 1px solid rgba(224,64,64,0.25);
            color: #ff6060;
            padding: 12px 16px;
            font-size: 0.875rem;
            margin-top: 14px;
        }

        /* ── Spinner ────────────────────────────────────────────────────── */
        .spinner {
            display: inline-block;
            width: 18px; height: 18px;
            border: 2px solid rgba(5,5,5,0.3);
            border-top-color: var(--color-bg);
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
            vertical-align: middle;
            margin-right: 6px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }


    </style>
</head>
<body>

    <!-- Navbar -->
    <nav id="navbar" class="fixed-top w-100">
        <div class="container d-flex align-items-center justify-content-between py-1">
            <a class="navbar-brand" href="../">HANGOUT HUB CAFE</a>
            <a href="../" class="back-link">
                <i class="fa-solid fa-arrow-left"></i> Back to Menu
            </a>
        </div>
    </nav>

    <!-- Page -->
    <main class="page-wrap">

        <!-- Cart Section -->
        <div id="cart-section">
            <h1 class="section-title">Your Cart</h1>
            <div id="cart-body"><!-- rendered by JS --></div>
        </div>

        <!-- Checkout Section (revealed after Proceed) -->
        <section id="checkout-section">
            <h2 class="section-title" style="font-size:1.3rem;">Complete Your Order</h2>
            <form id="checkout-form" class="row g-3" novalidate>
                <!-- Honeypot -->
                <input type="text" id="co-website" name="website" style="display:none;" tabindex="-1" autocomplete="off">

                <div class="col-md-6">
                    <label for="co-name" class="form-label">Your Name <span style="color:#e04040;">*</span></label>
                    <input type="text" id="co-name" class="form-control" placeholder="Full name" autocomplete="name" required>
                </div>
                <div class="col-md-6">
                    <label for="co-whatsapp" class="form-label">WhatsApp Number <span style="color:#e04040;">*</span></label>
                    <input type="tel" id="co-whatsapp" class="form-control" placeholder="+91 98765 43210" autocomplete="tel" required>
                </div>
                <div class="col-md-6">
                    <label for="co-email" class="form-label">Email <span style="color:var(--text-secondary);font-size:0.68rem;">(optional)</span></label>
                    <input type="email" id="co-email" class="form-control" placeholder="you@example.com" autocomplete="email">
                </div>
                <div class="col-md-6">
                    <label for="co-notes" class="form-label">Order Notes <span style="color:var(--text-secondary);font-size:0.68rem;">(optional)</span></label>
                    <input type="text" id="co-notes" class="form-control" placeholder="Allergies, special requests…">
                </div>

                <div id="co-error-container" class="col-12"></div>

                <div class="col-12 mt-2">
                    <button type="submit" id="place-order-btn" class="btn-gold-solid">Place Order</button>
                </div>
            </form>
        </section>

        <!-- Order Success Card -->
        <div id="success-card">
            <div style="font-size:3rem;margin-bottom:14px;">&#9749;</div>
            <h2 class="font-heading" style="color:var(--color-primary);margin-bottom:6px;">Order Placed!</h2>
            <p style="color:var(--text-secondary);margin-bottom:4px;font-size:0.78rem;letter-spacing:1.5px;text-transform:uppercase;">Order Number</p>
            <p id="success-order-number" class="font-heading" style="font-size:1.8rem;letter-spacing:3px;color:var(--color-primary);margin:6px 0 18px;"></p>
            <div id="success-order-details"></div>
            <p style="color:var(--text-secondary);font-size:0.85rem;max-width:420px;margin:18px auto 0;">
                Our team will contact you on WhatsApp to confirm your order.<br>Thank you for choosing Hangout Hub Cafe!
            </p>
        </div>

    </main>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <script>
        const CART_KEY = 'hangouthubcafe-cart-v1';

        // ── User Info Cache ──────────────────────────────────────────────
        const UserCache = {
            save(name, email, mobile, notes) {
                try {
                    if (name)   localStorage.setItem('hhc_un',  name);
                    if (email)  localStorage.setItem('hhc_ue',  email);
                    if (mobile) localStorage.setItem('hhc_um',  mobile);
                    if (notes)  localStorage.setItem('hhc_uon', notes);
                } catch(e) {}
            },
            load() {
                try {
                    return {
                        name:   localStorage.getItem('hhc_un')  || '',
                        email:  localStorage.getItem('hhc_ue')  || '',
                        mobile: localStorage.getItem('hhc_um')  || '',
                        notes:  localStorage.getItem('hhc_uon') || ''
                    };
                } catch(e) { return { name:'', email:'', mobile:'', notes:'' }; }
            },
            saveLastOrder(orderNumber, name, whatsapp, items, total) {
                try {
                    localStorage.setItem('hhc_last_order', JSON.stringify({
                        type: 'order', orderNumber, name, whatsapp,
                        items, total,
                        savedAt: new Date().toISOString()
                    }));
                } catch(e) {}
            }
        };

        // ── Cart Store (mirrors main page) ────────────────────────────────
        const Cart = {
            items: [],
            load() {
                try {
                    const raw = localStorage.getItem(CART_KEY);
                    this.items = raw ? JSON.parse(raw) : [];
                } catch (e) { this.items = []; }
            },
            save() { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); },
            increment(key) {
                const item = this.items.find(e => e.key === key);
                if (item) { item.quantity += 1; this.save(); }
            },
            decrement(key) {
                const item = this.items.find(e => e.key === key);
                if (!item) return;
                item.quantity -= 1;
                this.items = this.items.filter(e => e.quantity > 0);
                this.save();
            },
            remove(key) {
                this.items = this.items.filter(e => e.key !== key);
                this.save();
            },
            total() {
                return this.items.reduce((sum, e) => sum + (e.unitPrice * e.quantity), 0);
            },
            clear() { this.items = []; this.save(); }
        };

        // ── Render Cart ───────────────────────────────────────────────────
        function renderCart() {
            const body = document.getElementById('cart-body');
            const checkoutSection = document.getElementById('checkout-section');

            if (!Cart.items.length) {
                body.innerHTML = `
                    <div class="empty-cart">
                        <div class="empty-cart-icon"><i class="fa-solid fa-bucket"></i></div>
                        <h3>Your cart is empty</h3>
                        <p style="color:var(--text-secondary);margin-bottom:28px;">Add some delicious items from the menu.</p>
                        <a href="../" style="display:inline-block;background:var(--color-primary);color:#050505;font-family:'Cinzel',serif;letter-spacing:2px;text-transform:uppercase;font-size:0.85rem;font-weight:bold;padding:12px 32px;">Browse Menu</a>
                    </div>
                `;
                checkoutSection.classList.remove('visible');
                return;
            }

            const rows = Cart.items.map(item => `
                <div class="cart-item-card">
                    <div class="cart-item-top">
                        <img class="cart-item-img" src="${escHtml((item.image_url || '').replace(/^\.\//,'../') || '../img/placeholder.jpeg')}" alt="${escHtml(item.name)}" onerror="this.src='../img/placeholder.jpeg'">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${escHtml(item.name)}</div>
                            <div class="cart-item-variant">${escHtml(item.variantLabel)}</div>
                        </div>
                        <button class="remove-btn" data-action="remove" data-key="${encodeURIComponent(item.key)}" title="Remove"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                    <div class="cart-item-bottom">
                        <div class="cart-unit-price">
                            <span>Price</span>
                            ₹${item.unitPrice.toFixed(0)}
                        </div>
                        <div class="cart-qty-wrap">
                            <button class="qty-btn" data-action="decrement" data-key="${encodeURIComponent(item.key)}" title="Decrease"><i class="fa-solid fa-minus"></i></button>
                            <span class="qty-value">${item.quantity}</span>
                            <button class="qty-btn" data-action="increment" data-key="${encodeURIComponent(item.key)}" title="Increase"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <div class="cart-subtotal">
                            <span>Subtotal</span>
                            <span class="item-subtotal">₹${(item.unitPrice * item.quantity).toFixed(0)}</span>
                        </div>
                    </div>
                </div>
            `).join('');

            body.innerHTML = `
                <div class="cart-list-header">
                    <div></div>
                    <div>Item</div>
                    <div>Unit Price</div>
                    <div>Qty</div>
                    <div>Subtotal</div>
                    <div></div>
                </div>
                <div>${rows}</div>

                <div class="cart-summary">
                    <div class="summary-row">
                        <span>${Cart.items.length} item${Cart.items.length !== 1 ? 's' : ''}</span>
                        <span>${Cart.items.reduce((s, e) => s + e.quantity, 0)} total qty</span>
                    </div>
                    <div style="height:1px;background:rgba(255,255,255,0.07);margin:12px 0;"></div>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="summary-total-label">Grand Total</span>
                        <span class="summary-total" id="cart-total">₹${Cart.total().toFixed(0)}</span>
                    </div>
                    <button id="proceed-btn" class="btn-gold-solid mt-4">Proceed to Checkout</button>
                </div>
            `;

            // Proceed button
            document.getElementById('proceed-btn').addEventListener('click', () => {
                checkoutSection.classList.add('visible');
                // Pre-fill from cached user info
                const cached = UserCache.load();
                if (cached.name   && !document.getElementById('co-name').value)     document.getElementById('co-name').value     = cached.name;
                if (cached.mobile && !document.getElementById('co-whatsapp').value)  document.getElementById('co-whatsapp').value = cached.mobile;
                if (cached.email  && !document.getElementById('co-email').value)     document.getElementById('co-email').value    = cached.email;
                if (cached.notes  && !document.getElementById('co-notes').value)     document.getElementById('co-notes').value    = cached.notes;
                checkoutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }

        // ── Cart event delegation ─────────────────────────────────────────
        document.getElementById('cart-body').addEventListener('click', (e) => {
            const btn = e.target.closest('[data-action]');
            if (!btn) return;
            const action = btn.dataset.action;
            const key = decodeURIComponent(btn.dataset.key);
            if (action === 'increment') Cart.increment(key);
            if (action === 'decrement') Cart.decrement(key);
            if (action === 'remove')    Cart.remove(key);
            renderCart();
        });

        // ── Checkout form submission ───────────────────────────────────────
        document.getElementById('checkout-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const name     = document.getElementById('co-name').value.trim();
            const whatsapp = document.getElementById('co-whatsapp').value.trim();
            const email    = document.getElementById('co-email').value.trim();
            const notes    = document.getElementById('co-notes').value.trim();
            const website  = document.getElementById('co-website').value; // honeypot
            const errBox   = document.getElementById('co-error-container');
            const btn      = document.getElementById('place-order-btn');

            errBox.innerHTML = '';

            const showErr = (msg) => {
                errBox.innerHTML = `<div class="error-alert">${escHtml(msg)}</div>`;
            };

            if (!name) { showErr('Please enter your name.'); return; }
            if (!whatsapp) { showErr('Please enter your WhatsApp number.'); return; }
            if (!Cart.items.length) { showErr('Your cart is empty.'); return; }

            // Build items payload (name + variantLabel + quantity only — server fetches price)
            const itemsPayload = Cart.items.map(item => ({
                name: item.name,
                variantLabel: item.variantLabel,
                quantity: item.quantity
            }));

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner"></span>Placing Order…';

            try {
                const resp = await fetch('../api/orders.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, whatsapp, email, notes, items: itemsPayload, website })
                });
                const data = await resp.json();

                if (data.ok) {
                    // Save user info to cache
                    UserCache.save(name, email, whatsapp, notes);
                    // Snapshot items before clearing
                    const orderItems = Cart.items.map(i => ({ name: i.name, variantLabel: i.variantLabel, quantity: i.quantity, unitPrice: i.unitPrice }));
                    const orderTotal = Cart.total();
                    UserCache.saveLastOrder(data.order_number, name, whatsapp, orderItems, orderTotal);
                    // Clear cart & reveal success
                    Cart.clear();
                    document.getElementById('cart-section').style.display = 'none';
                    document.getElementById('checkout-section').classList.remove('visible');
                    document.getElementById('success-order-number').textContent = data.order_number;
                    // Populate order details
                    const detailsEl = document.getElementById('success-order-details');
                    if (detailsEl) {
                        const now = new Date();
                        const dateStr = now.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
                        const timeStr = now.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
                        const itemRows = orderItems.map(item => `
                            <div class="sod-item-row">
                                <div class="sod-item-name">${escHtml(item.name)}<span class="sod-item-variant">${escHtml(item.variantLabel)}</span></div>
                                <div class="sod-item-right">&times;${item.quantity}<span class="sod-item-price"> &#8377;${(item.unitPrice * item.quantity).toFixed(0)}</span></div>
                            </div>`).join('');
                        detailsEl.innerHTML = `
                            <div class="sod-wrap">
                                <div class="sod-meta">
                                    <span><i class="fa-regular fa-user" style="margin-right:5px;"></i>${escHtml(name)}</span>
                                    <span><i class="fa-regular fa-clock" style="margin-right:5px;"></i>${dateStr}, ${timeStr}</span>
                                </div>
                                <div class="sod-items">${itemRows}</div>
                                <div class="sod-total"><span>Total</span><span>&#8377;${orderTotal.toFixed(0)}</span></div>
                            </div>`;
                    }
                    document.getElementById('success-card').classList.add('visible');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    showErr(data.msg || 'Something went wrong. Please try again.');
                    btn.disabled = false;
                    btn.textContent = 'Place Order';
                }
            } catch (err) {
                showErr('Network error. Please check your connection and try again.');
                btn.disabled = false;
                btn.textContent = 'Place Order';
            }
        });

        // ── Helpers ───────────────────────────────────────────────────────
        function escHtml(str) {
            return String(str ?? '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
        }

        // ── Boot ──────────────────────────────────────────────────────────
        Cart.load();
        renderCart();
    </script>
</body>
</html>
