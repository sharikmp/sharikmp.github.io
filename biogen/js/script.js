document.addEventListener('DOMContentLoaded', function () {
    initializeTheme();
    renderBiodataSections();
    setupPhotoUpload();

    document.addEventListener('click', handleRowActions);
    document.getElementById('printBtn')?.addEventListener('click', printBiodata);
});
