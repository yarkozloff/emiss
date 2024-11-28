const themeToggleButton = document.getElementById('theme-toggle');
const themeStylesheet = document.getElementById('theme-stylesheet');

// Проверяем сохраненную тему при загрузке страницы
if (localStorage.getItem('theme') === 'dark') {
    themeStylesheet.setAttribute('href', 'css/dark-theme.css');
}

themeToggleButton.addEventListener('click', () => {
    if (themeStylesheet.getAttribute('href') === 'css/light-theme.css') {
        themeStylesheet.setAttribute('href', 'css/dark-theme.css');
        localStorage.setItem('theme', 'dark');
    } else {
        themeStylesheet.setAttribute('href', 'css/light-theme.css');
        localStorage.setItem('theme', 'light');
    }
});
