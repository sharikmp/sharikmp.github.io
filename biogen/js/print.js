// print.js

function printBiodata() {
    const printContent = document.querySelector('.print');
    const originalContent = document.body.innerHTML;

    convertInputsToText(printContent);
    printSection(printContent);
    restoreOriginalContent(originalContent);
}

function convertInputsToText(container) {
    const inputs = container.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        const value = input.value || input.innerText;
        const span = document.createElement('span');
        span.textContent = value;
        span.style.display = input.style.display;
        input.parentNode.replaceChild(span, input);
    });
}

function printSection(content) {
    const printHTML = content.innerHTML;
    document.body.innerHTML = `<div class='print'>${printHTML}</div>`;
    window.print();
}

function restoreOriginalContent(original) {
    setTimeout(() => {
        document.body.innerHTML = original;
        window.location.reload();
    }, 500);
}
