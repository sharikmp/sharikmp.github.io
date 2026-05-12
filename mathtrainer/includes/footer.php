<?php
/**
 * includes/footer.php
 * ─────────────────────────────────────────────────────────────
 * Shared site footer — used only on the main index.php game page.
 * Inner pages (about, contact, howitworks) use their own minimal CTAs.
 * Requires: config/config.php loaded (uses url() helper).
 * ─────────────────────────────────────────────────────────────
 */
?>
<footer class="site-footer interactive-layer" id="site-footer">
    <div class="container">
        <div class="row">
            <div class="col-lg-6 mb-4 mb-lg-0">
                <div class="footer-brand">
                    <i class="fas fa-bolt"></i> MATH TRAINER
                </div>
                <p class="mb-4 pe-lg-4 text-muted">
                    Train Speed. Sharpen Precision. The ultimate mental math galaxy experience.
                </p>
                <div class="footer-socials">
                    <a href="#" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
                    <a href="#" aria-label="Discord"><i class="fab fa-discord"></i></a>
                </div>
            </div>

            <div class="col-lg-3 col-md-6 mb-4 mb-lg-0 footer-links">
                <h6>Quick Links</h6>
                <ul>
                    <li><a href="#" onclick="window.scrollTo({top:0,behavior:'smooth'});return false;">Play Now</a></li>
                    <li><a href="<?= url('howitworks.php') ?>">How It Works</a></li>
                    <li><a href="<?= url('about/') ?>">About</a></li>
                </ul>
            </div>

            <div class="col-lg-3 col-md-6 footer-links">
                <h6>Support</h6>
                <ul>
                    <li><a href="<?= url('contact/') ?>">Contact Us</a></li>
                </ul>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-12 footer-brand-gradient-wrap">
                <div class="huge-brand-text">MATH<br>TRAINER</div>
                <div class="footer-brand-glow-strip"></div>
            </div>
        </div>

        <div class="footer-bottom mt-2">
            <div>&copy; <?= date('Y') ?> <?= APP_NAME ?>. All rights reserved.</div>
            <div class="d-flex gap-3 align-items-center mt-3 mt-md-0">
                <a href="#" class="text-muted text-decoration-none">Terms</a>
                <a href="#" class="text-muted text-decoration-none">Privacy</a>
                <button class="scroll-top-btn ms-2" onclick="window.scrollTo({top:0,behavior:'smooth'})">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
        </div>
    </div>
</footer>
