// theme.js

function initializeTheme() {
    const themeSelector = document.getElementById('themeSelector');
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        themeSelector.value = savedTheme;
        applyTheme(savedTheme);
    }
    themeSelector.addEventListener('change', handleThemeChange);
}

function handleThemeChange(event) {
    const selectedTheme = event.target.value;
    applyTheme(selectedTheme);
    localStorage.setItem('selectedTheme', selectedTheme);
}

function applyTheme(theme) {
    const themes = {
        romantic: { '--primary-color': '#b76e79', '--secondary-color': '#fff8f0' },
        royalPurple: { '--primary-color': '#7d3c98', '--secondary-color': '#f5eef8' },
        elegantGreen: { '--primary-color': '#4a7c59', '--secondary-color': '#fefcf6' },
        sunsetBlush: { '--primary-color': '#e07a5f', '--secondary-color': '#fdf0e3' }
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
        Object.keys(selectedTheme).forEach(variable => {
            document.documentElement.style.setProperty(variable, selectedTheme[variable]);
        });
    }
}
