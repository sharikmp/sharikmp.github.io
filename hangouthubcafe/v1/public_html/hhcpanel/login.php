<?php
/**
 * Hangout Hub Cafe — Admin Panel Login
 */
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/../includes/db.php';

hhc_session_start();
security_headers();

// Already authenticated → redirect
if (_hhc_session_valid()) {
    $returnUrl = $_GET['r'] ?? '';
    $goto = (strlen($returnUrl) > 1 && $returnUrl[0] === '/' && ($returnUrl[1] ?? '') !== '/')
        ? $returnUrl : '/hhcpanel/';
    header('Location: ' . $goto);
    exit;
}

$error    = '';
$username = '';

// ── POST: process login ───────────────────────────────────────────────────────
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Inline CSRF check (form POST — don't output JSON)
    $submittedToken = $_POST['csrf_token'] ?? '';
    $storedToken    = $_SESSION['csrf_token'] ?? '';
    if (!$storedToken || !hash_equals($storedToken, $submittedToken)) {
        $error = 'Invalid form token. Please refresh and try again.';
    } else {
        $username = trim(strip_tags($_POST['username'] ?? ''));
        $password = $_POST['password'] ?? '';

        if ($username === '' || $password === '') {
            $error = 'Please enter both username and password.';
        } else {
            try {
                $pdo  = get_db();
                $stmt = $pdo->prepare(
                    'SELECT id, username, password_hash, role, login_attempts, locked_until
                     FROM hhc_users WHERE username = ? LIMIT 1'
                );
                $stmt->execute([$username]);
                $user = $stmt->fetch();

                // Check lockout before anything else
                if ($user && !empty($user['locked_until'])) {
                    $lockTime = strtotime($user['locked_until']);
                    if ($lockTime > time()) {
                        $lockMins = (int)ceil(($lockTime - time()) / 60);
                        $error    = "Account temporarily locked. Try again in {$lockMins} min.";
                        $user     = null;
                    }
                }

                if ($error === '') {
                    if (!$user) {
                        // Equalize timing to prevent username enumeration
                        password_hash('timing_equalization_dummy', PASSWORD_BCRYPT, ['cost' => 12]);
                        $error = 'Invalid username or password.';
                    } elseif (!password_verify($password, $user['password_hash'])) {
                        $newAttempts = (int)$user['login_attempts'] + 1;
                        if ($newAttempts >= HHC_MAX_ATTEMPTS) {
                            $pdo->prepare(
                                "UPDATE hhc_users
                                 SET login_attempts = ?, locked_until = DATE_ADD(NOW(), INTERVAL ? MINUTE)
                                 WHERE id = ?"
                            )->execute([$newAttempts, HHC_LOCKOUT_MIN, $user['id']]);
                            $error = 'Too many failed attempts. Account locked for ' . HHC_LOCKOUT_MIN . ' minutes.';
                        } else {
                            $pdo->prepare(
                                'UPDATE hhc_users SET login_attempts = ? WHERE id = ?'
                            )->execute([$newAttempts, $user['id']]);
                            $error = 'Invalid username or password.';
                        }
                    } else {
                        // ── SUCCESS ──────────────────────────────────────────
                        $pdo->prepare(
                            'UPDATE hhc_users SET login_attempts = 0, locked_until = NULL, last_login_at = NOW() WHERE id = ?'
                        )->execute([$user['id']]);

                        session_regenerate_id(true);
                        $_SESSION['hhc_uid']         = (int)$user['id'];
                        $_SESSION['hhc_username']    = $user['username'];
                        $_SESSION['hhc_role']        = $user['role'];
                        $_SESSION['hhc_last_active'] = time();
                        unset($_SESSION['csrf_token']); // rotate CSRF on login

                        $returnUrl = $_POST['return_url'] ?? '';
                        $goto = (strlen($returnUrl) > 1 && $returnUrl[0] === '/' && ($returnUrl[1] ?? '') !== '/')
                            ? $returnUrl : '/hhcpanel/';
                        header('Location: ' . $goto);
                        exit;
                    }
                }
            } catch (Exception $e) {
                $error = 'System error. Please try again.';
            }
        }
    }
}

$csrf       = csrf_token();
$returnParam = htmlspecialchars($_GET['r'] ?? '', ENT_QUOTES, 'UTF-8');
?><!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>HHC Panel — Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet">
    <style>
        :root {
            --gold: #c8a45a;
            --gold-dark: #a88640;
            --dark-bg: #050505;
            --card-bg: #111111;
            --border: #252525;
            --text: #ddd8c8;
            --text-muted: #777770;
        }
        *, *::before, *::after { box-sizing: border-box; }
        body {
            margin: 0;
            background: var(--dark-bg);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Montserrat', sans-serif;
            color: var(--text);
        }
        .login-wrap {
            width: 100%;
            max-width: 380px;
            padding: 1rem;
        }
        .login-card {
            background: var(--card-bg);
            border: 1px solid var(--border);
            border-radius: 12px;
            padding: 2.5rem 2rem;
        }
        .brand {
            font-family: 'Cinzel', serif;
            color: var(--gold);
            font-size: 1.35rem;
            letter-spacing: 0.12em;
            margin-bottom: 0.25rem;
        }
        .subtitle {
            color: var(--text-muted);
            font-size: 0.78rem;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            margin-bottom: 2rem;
        }
        .form-label {
            color: var(--text-muted);
            font-size: 0.78rem;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 0.35rem;
        }
        .form-control {
            background: #0a0a0a;
            border: 1px solid var(--border);
            color: var(--text);
            border-radius: 6px;
            padding: 0.6rem 0.85rem;
            font-size: 0.9rem;
            transition: border-color .2s;
        }
        .form-control:focus {
            background: #0a0a0a;
            color: var(--text);
            border-color: var(--gold);
            box-shadow: 0 0 0 3px rgba(200,164,90,.12);
            outline: none;
        }
        .form-control::placeholder { color: #444; }
        .btn-login {
            width: 100%;
            padding: 0.65rem;
            background: var(--gold);
            color: #050505;
            border: none;
            border-radius: 6px;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            letter-spacing: 0.1em;
            font-weight: 600;
            cursor: pointer;
            transition: background .2s;
            margin-top: 0.5rem;
        }
        .btn-login:hover { background: var(--gold-dark); }
        .alert-error {
            background: rgba(239,68,68,.12);
            border: 1px solid rgba(239,68,68,.35);
            color: #fca5a5;
            border-radius: 6px;
            padding: 0.65rem 0.85rem;
            font-size: 0.82rem;
            margin-bottom: 1.25rem;
        }
        .divider {
            border-color: var(--border);
            margin: 1.75rem 0 1.5rem;
        }
    </style>
</head>
<body>
    <div class="login-wrap">
        <div class="login-card">
            <div class="text-center">
                <div class="brand">Hangout Hub Café</div>
                <div class="subtitle">Admin Panel</div>
            </div>

            <?php if ($error !== ''): ?>
            <div class="alert-error">
                <i class="fas fa-exclamation-circle me-1"></i>
                <?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?>
            </div>
            <?php endif; ?>

            <form method="post" autocomplete="off" novalidate>
                <input type="hidden" name="csrf_token"  value="<?= htmlspecialchars($csrf, ENT_QUOTES, 'UTF-8') ?>">
                <input type="hidden" name="return_url"  value="<?= $returnParam ?>">

                <div class="mb-3">
                    <label class="form-label" for="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        class="form-control"
                        value="<?= htmlspecialchars($username, ENT_QUOTES, 'UTF-8') ?>"
                        autocomplete="username"
                        required
                        autofocus
                    >
                </div>

                <div class="mb-4">
                    <label class="form-label" for="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        class="form-control"
                        autocomplete="current-password"
                        required
                    >
                </div>

                <button type="submit" class="btn-login">
                    <i class="fas fa-sign-in-alt me-1"></i> Login
                </button>
            </form>
        </div>
    </div>
</body>
</html>
