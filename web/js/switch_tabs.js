const tabs = document.querySelectorAll('.tab');
    const contents = document.querySelectorAll('.content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Скрыть все контенты и убрать активный класс у всех вкладок
            contents.forEach(content => content.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Показать соответствующий контент и добавить активный класс к текущей вкладке
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            tab.classList.add('active');
        });
    });