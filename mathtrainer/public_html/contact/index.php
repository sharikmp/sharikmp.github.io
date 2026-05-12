<?php
/**
 * public_html/contact/index.php
 * Contact page with CSRF-protected form.
 */
require_once __DIR__ . '/../../config/config.php';
define('PATH_INCLUDES', __DIR__ . '/../../includes');

$page = [
    'title'       => 'Contact | MathTrainer',
    'description' => 'Get in touch with the MathTrainer team — suggestions, feedback, bug reports or partnership enquiries. We\'d love to hear from you.',
    'canonical'   => url('contact/'),
    'og_title'    => 'Contact | MathTrainer',
    'og_desc'     => 'Get in touch with the MathTrainer team.',
];

// ── CSRF token (session-based) ────────────────────────────────
$csrf = csrf_token();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <?php require_once PATH_INCLUDES . '/head.php'; ?>
    <style>
        :root {
            --primary-accent: #d4af37;
            --secondary-accent: #f9d77e;
            --glass-bg: rgba(20, 20, 20, 0.65);
            --glass-border: rgba(212, 175, 55, 0.2);
            --neon-cyan: #00f3ff;
            --error-glow: #ff3366;
            --success-glow: #00ff80;
        }
        * { box-sizing: border-box; }
        body { margin:0; padding:0; background:radial-gradient(circle at bottom, #1a0b2e 0%, #000000 100%); color:#fff; font-family:'Inter',sans-serif; overflow-x:hidden; min-height:100vh; }
        h1,h2,h3,h4 { font-family:'Space Grotesk',sans-serif; }
        #bg-canvas { position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:1; pointer-events:none; }
        #page-content { position:relative; z-index:10; padding:1.5rem 1rem 5rem; }
        .page-nav { display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0 1.5rem; }
        .page-nav .brand { font-family:'Space Grotesk',sans-serif; font-size:1.1rem; font-weight:800; color:var(--primary-accent); text-shadow:0 0 12px rgba(212,175,55,0.5); text-decoration:none; letter-spacing:2px; }
        .btn-back { background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:rgba(255,255,255,0.55); border-radius:50px; padding:6px 16px; font-size:0.82rem; display:flex; align-items:center; gap:6px; text-decoration:none; transition:all 0.2s; }
        .btn-back:hover { background:rgba(255,255,255,0.12); color:#fff; }
        .page-card { background:var(--glass-bg); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border:1px solid var(--glass-border); border-radius:20px; padding:1.75rem; margin-bottom:1.2rem; }
        .section-badge { display:inline-flex; align-items:center; gap:7px; background:rgba(212,175,55,0.1); border:1px solid rgba(212,175,55,0.28); border-radius:50px; padding:4px 13px; font-size:0.72rem; font-weight:700; text-transform:uppercase; letter-spacing:1.4px; color:var(--primary-accent); margin-bottom:1rem; }
        .form-label { font-size:0.78rem; text-transform:uppercase; letter-spacing:1px; color:rgba(255,255,255,0.4); margin-bottom:6px; display:block; }
        .form-control-dark { width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); border-radius:12px; color:#fff; font-family:'Inter',sans-serif; font-size:0.9rem; padding:11px 15px; transition:border-color 0.2s,box-shadow 0.2s; outline:none; -webkit-appearance:none; appearance:none; }
        .form-control-dark::placeholder { color:rgba(255,255,255,0.22); }
        .form-control-dark:focus { border-color:rgba(212,175,55,0.5); box-shadow:0 0 0 3px rgba(212,175,55,0.1); background:rgba(255,255,255,0.07); }
        textarea.form-control-dark { resize:vertical; min-height:110px; }
        .form-group { margin-bottom:1rem; }
        .btn-submit { width:100%; background:linear-gradient(135deg,var(--primary-accent),#b8901b); color:#000; font-family:'Space Grotesk',sans-serif; font-weight:800; border:none; border-radius:50px; padding:0.9rem 2rem; text-transform:uppercase; letter-spacing:2px; font-size:1rem; cursor:pointer; box-shadow:0 0 20px rgba(212,175,55,0.4); transition:all 0.3s; display:flex; align-items:center; justify-content:center; gap:8px; }
        .btn-submit:hover:not(:disabled) { transform:scale(1.02); box-shadow:0 0 30px rgba(212,175,55,0.7); }
        .btn-submit:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
        .form-msg { display:none; border-radius:12px; padding:12px 16px; font-size:0.88rem; font-weight:600; margin-top:0.75rem; }
        .form-msg.success { background:rgba(0,255,128,0.1); border:1px solid rgba(0,255,128,0.28); color:var(--success-glow); }
        .form-msg.error { background:rgba(255,51,102,0.1); border:1px solid rgba(255,51,102,0.28); color:var(--error-glow); }
        .contact-row { display:flex; align-items:center; gap:14px; padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.06); }
        .contact-row:last-child { border-bottom:none; }
        .contact-icon { width:38px; height:38px; border-radius:10px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
        .contact-label { font-size:0.78rem; color:rgba(255,255,255,0.38); margin-bottom:1px; }
        .contact-value { font-size:0.9rem; color:#fff; font-weight:600; text-decoration:none; transition:color 0.2s; }
        .contact-value:hover { color:var(--primary-accent); }
        @media (max-width:480px) { .page-card { padding:1.25rem; } }
    </style>
</head>
<body>

<canvas id="bg-canvas"></canvas>

<div id="page-content">
    <div class="container" style="max-width:580px;">

        <!-- Nav -->
        <nav class="page-nav">
            <a href="<?= url() ?>" class="brand"><i class="fas fa-bolt"></i> MATH TRAINER</a>
            <a href="<?= url() ?>" class="btn-back"><i class="fas fa-chevron-left"></i> Play</a>
        </nav>

        <!-- Hero -->
        <div class="text-center mb-4">
            <h1 style="font-size:clamp(2rem,7vw,3rem); color:var(--primary-accent); text-shadow:0 0 20px rgba(212,175,55,0.5); margin-bottom:0.4rem;">
                Get in Touch
            </h1>
            <p style="color:rgba(255,255,255,0.45); font-size:0.9rem; margin:0;">
                Suggestions, bugs, feedback or just saying hi — all welcome.
            </p>
        </div>

        <!-- Contact Form -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-paper-plane"></i> Send a Message</div>

            <form id="contact-form" action="<?= url('contact/send.php') ?>" method="POST" novalidate>
                <!-- CSRF token — prevents cross-site request forgery -->
                <input type="hidden" name="csrf_token" value="<?= e($csrf) ?>">

                <div class="form-group">
                    <label class="form-label" for="f-name">Your Name</label>
                    <input class="form-control-dark" type="text" id="f-name" name="name"
                           placeholder="e.g. Alex Johnson" required maxlength="100" autocomplete="name">
                </div>

                <div class="form-group">
                    <label class="form-label" for="f-email">Email Address</label>
                    <input class="form-control-dark" type="email" id="f-email" name="email"
                           placeholder="you@example.com" required maxlength="254" autocomplete="email">
                </div>

                <div class="form-group">
                    <label class="form-label" for="f-subject">Subject</label>
                    <select class="form-control-dark" id="f-subject" name="subject" required style="cursor:pointer;">
                        <option value="" disabled selected>Choose a topic…</option>
                        <option value="feedback">Feedback &amp; Suggestions</option>
                        <option value="bug">Bug Report</option>
                        <option value="feature">Feature Request</option>
                        <option value="partnership">Partnership / Collaboration</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label" for="f-message">Message</label>
                    <textarea class="form-control-dark" id="f-message" name="message"
                              placeholder="Write your message here…" required maxlength="2000"></textarea>
                </div>

                <button type="submit" class="btn-submit" id="btn-submit">
                    <i class="fas fa-paper-plane"></i> Send Message
                </button>

                <div class="form-msg success" id="form-success">
                    <i class="fas fa-circle-check"></i> Message sent! We'll get back to you soon.
                </div>
                <div class="form-msg error" id="form-error">
                    <i class="fas fa-triangle-exclamation"></i>
                    <span id="form-error-text">Something went wrong. Please try again.</span>
                </div>
            </form>
        </div>

        <!-- Direct contact -->
        <div class="page-card">
            <div class="section-badge"><i class="fas fa-address-card"></i> Direct Contact</div>
            <div id="contact-links-container"></div>
        </div>

    </div>
</div>

<script>
    /* ── Contact info (rendered client-side) ──────────────────── */
    var contactConfig = {
        email: "hello@mathtrainer.net",
        social: [
            { icon: "fab fa-twitter",   label: "Twitter / X",           value: "@MathTrainerNet",        href: "https://twitter.com/MathTrainerNet",      color: "#bfa3ff", bg: "rgba(191,163,255,0.1)" },
            { icon: "fab fa-instagram", label: "Instagram",             value: "@mathtrainer.net",       href: "https://instagram.com/mathtrainer.net",   color: "#ffb3c6", bg: "rgba(255,179,198,0.1)" },
            { icon: "fab fa-discord",   label: "Discord",               value: "MathTrainer Community",  href: "#",                                       color: "#7289da", bg: "rgba(114,137,218,0.1)" }
        ]
    };

    (function () {
        var container = document.getElementById('contact-links-container');
        var html = '';
        html += '<div class="contact-row"><div class="contact-icon" style="background:rgba(212,175,55,0.1);"><i class="fas fa-envelope" style="color:var(--primary-accent);"></i></div><div><div class="contact-label">Email</div><a class="contact-value" href="mailto:' + contactConfig.email + '">' + contactConfig.email + '</a></div></div>';
        contactConfig.social.forEach(function (s) {
            html += '<div class="contact-row"><div class="contact-icon" style="background:' + s.bg + ';"><i class="' + s.icon + '" style="color:' + s.color + ';"></i></div><div><div class="contact-label">' + s.label + '</div><a class="contact-value" href="' + s.href + '" target="_blank" rel="noopener noreferrer">' + s.value + '</a></div></div>';
        });
        container.innerHTML = html;
    })();

    /* ── Client-side form validation + AJAX submit ───────────── */
    (function () {
        var form       = document.getElementById('contact-form');
        var btn        = document.getElementById('btn-submit');
        var msgSuccess = document.getElementById('form-success');
        var msgError   = document.getElementById('form-error');
        var msgErrText = document.getElementById('form-error-text');

        function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
        function clearMessages() { msgSuccess.style.display = 'none'; msgError.style.display = 'none'; }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearMessages();

            var name    = document.getElementById('f-name').value.trim();
            var email   = document.getElementById('f-email').value.trim();
            var subject = document.getElementById('f-subject').value;
            var message = document.getElementById('f-message').value.trim();

            if (!name || name.length < 2)      { return showErr('Please enter your name.'); }
            if (!isValidEmail(email))           { return showErr('Please enter a valid email address.'); }
            if (!subject)                       { return showErr('Please choose a subject.'); }
            if (message.length < 10)            { return showErr('Message is too short (min 10 characters).'); }

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

            var formData = new FormData(form);
            fetch(form.action, { method: 'POST', body: formData })
                .then(function (r) { return r.json(); })
                .then(function (data) {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    if (data.success) {
                        form.reset();
                        msgSuccess.style.display = 'block';
                    } else {
                        showErr(data.message || 'Something went wrong.');
                    }
                })
                .catch(function () {
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
                    showErr('Network error. Please try again.');
                });
        });

        function showErr(msg) {
            msgErrText.textContent = msg;
            msgError.style.display = 'block';
        }
    })();
</script>

<?php
$galaxy_mode = 'minimal';
require_once PATH_INCLUDES . '/galaxy.php';
?>
</body>
</html>
