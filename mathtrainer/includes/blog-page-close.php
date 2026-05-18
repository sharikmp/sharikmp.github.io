<?php
/**
 * includes/blog-page-close.php
 * ─────────────────────────────────────────────────────────────
 * Closes the blog/content page shell opened by blog-page-open.php.
 * Renders the shared CTA block, minimal galaxy background, and
 * closes all open tags.
 * ─────────────────────────────────────────────────────────────
 */
?>

        <!-- ── Shared CTA ──────────────────────────── -->
        <div class="cta-box">
            <p>Put your math skills to the test — free, no sign-up needed.</p>
            <a href="<?= url() ?>" class="btn-gold-page">
                <i class="fas fa-bolt"></i> Play MathTrainer Free
            </a>
        </div>

    </div><!-- /.container -->
</div><!-- /#page-content -->

<?php
$galaxy_mode = 'minimal';
require_once PATH_INCLUDES . '/galaxy.php';
?>
</body>
</html>
