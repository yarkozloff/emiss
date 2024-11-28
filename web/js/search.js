document.addEventListener('DOMContentLoaded', () => {

    // поиск рубрики
    document.getElementById('class-input').addEventListener('input', async (event) => {
        const query = event.target.value;
        if (query.length >= 3) {
            try {
                const response = await fetch('http://localhost:3000/api/search-classifier', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при выполнении поиска');
                }

                const data = await response.json();
                displayClass(data.results);
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при выполнении поиска.');
            }
        } else {
            document.getElementById('results-class-list').style.display = 'none';
        }
    });

    // поиск по найденной рубрике
    function displayClass(results) {
        const resultsList = document.getElementById('results-class-list');
        resultsList.innerHTML = ''; // Очистка предыдущих результатов
    
        if (results.length > 0) {
            results.forEach(item => {
                const listItem = document.createElement('li');
                listItem.setAttribute('classid', item.id);
                listItem.classList.add('class-button'); // Используем class вместо id
                listItem.textContent = item.name; // Предполагается, что item - это строка
                resultsList.appendChild(listItem);
            });
            resultsList.style.display = 'block'; // Отображение списка
        } else {
            resultsList.style.display = 'none'; // Скрытие списка, если нет результатов
        }
    }

    // Обработчик события для поиска датасета по рубрике 'class-button'
    document.getElementById('results-class-list').addEventListener('click', async (event) => {
        if (event.target.classList.contains('class-button')) {
            const classid = event.target.getAttribute('classid');
            try {
                const response = await fetch('http://localhost:3000/api/search-by-class', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ classid }) // Передаем classid
                });
                if (!response.ok) {
                    throw new Error('Ошибка при выполнении поиска');
                }
                const data = await response.json();
                displayResults(data);
                const searchResults = document.getElementById('search-results');
                if (searchResults) {
                    searchResults.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при выполнении поиска.');
            }
        }
    });
    

    // поиск классификатора
    document.getElementById('search-input').addEventListener('input', async (event) => {
        const query = event.target.value;
        if (query.length >= 3) {
            try {
                const response = await fetch('http://localhost:3000/api/search-codes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при выполнении поиска');
                }

                const data = await response.json();
                displayCodes(data.results);
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при выполнении поиска.');
            }
        } else {
            document.getElementById('results-codes-list').style.display = 'none';
        }
    });

    // поиск по найденному классификатору
    function displayCodes(results) {
        const resultsList = document.getElementById('results-codes-list');
        resultsList.innerHTML = ''; // Очистка предыдущих результатов
    
        if (results.length > 0) {
            results.forEach(item => {
                const listItem = document.createElement('li');
                listItem.setAttribute('codeid', item.id);
                listItem.classList.add('code-button'); // Используем class вместо id
                listItem.textContent = item.name; // Предполагается, что item - это строка
                resultsList.appendChild(listItem);
            });
            resultsList.style.display = 'block'; // Отображение списка
        } else {
            resultsList.style.display = 'none'; // Скрытие списка, если нет результатов
        }
    }
    
    // Обработчик события для поиска датасета по классификатору 'code-button'
    document.getElementById('results-codes-list').addEventListener('click', async (event) => {
        if (event.target.classList.contains('code-button')) {
            const codeid = event.target.getAttribute('codeid');
            try {
                const response = await fetch('http://localhost:3000/api/search-by-codes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ codeid }) // Передаем codeid
                });
                if (!response.ok) {
                    throw new Error('Ошибка при выполнении поиска');
                }
                const data = await response.json();
                displayResults(data);
                const searchResults = document.getElementById('search-results');
                if (searchResults) {
                    searchResults.scrollIntoView({ behavior: 'smooth' });
                }
            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при выполнении поиска.');
            }
        }
    });
    

    document.getElementById('fulltext-button').addEventListener('click', async () => {
        const query = document.getElementById('fulltext-input').value;
        if (!query) {
            alert('Пожалуйста, введите запрос для поиска.');
            return;
        }
    
        // Заменяем " или " (с пробелами до и после) на знак |
        // Затем заменяем все пробелы на знак &
        const modifiedQuery = query.replace(/\sили\s/g, '|').replace(/\s+/g, '&');
    
        try {
            const response = await fetch('http://localhost:3000/api/search-by-fulltext', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query: modifiedQuery })
            });
            if (!response.ok) {
                throw new Error('Ошибка при выполнении поиска');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Ошибка:', error);
            alert('Произошла ошибка при выполнении поиска.');
        }
    });
    
    

    // Функция вывода результатов 
    function displayResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>Результаты не найдены.</p>';
        } else {
            const resultDataContainer = document.createElement('div');
            resultDataContainer.classList.add('result-data');
    
            // Добавляем блок с длиной массива results
            const resultsLengthBlockCount = document.createElement('div');
            resultsLengthBlockCount.classList.add('results-length-count');
            resultsLengthBlockCount.textContent = `Найдено показателей: ${results.length}`;
            resultDataContainer.appendChild(resultsLengthBlockCount);
                if (results.length >=100) {
                    const resultsLengthBlockDisplay = document.createElement('div');
                    resultsLengthBlockDisplay.classList.add('results-length-display');
                    resultsLengthBlockDisplay.textContent = 'Отображается показателей: 100';
                    resultDataContainer.appendChild(resultsLengthBlockDisplay);
                }
    
            const resultBlock = document.createElement('div');
            resultBlock.classList.add('result-block');
    
            // Ограничиваем количество обрабатываемых элементов до 50
            const limitedResults = results.slice(0, 100);
            limitedResults.forEach(item => {
                const additionalDataContainer = document.createElement('div');
                additionalDataContainer.classList.add('dataset-result');
    
                // Релеватность
                const hasRank = item.rank;
                if (hasRank) {
                    const itemDivRank = document.createElement('div');
                    itemDivRank.classList.add('dataset-rank');
                    itemDivRank.textContent = hasRank;
                    additionalDataContainer.appendChild(itemDivRank);
                }
    
                const details = [
                    { className: 'dataset-name', label: 'Название показателя: ', value: item.dataset_name },
                    { className: 'dataset-classifier', label: 'Раздел ФПСР: ', value: item.dataset_classifier },
                    { className: 'dataset-class', label: 'Классификатор: ', value: item.dataset_class },
                    { className: 'dataset-agencie', label: 'Ведомство: ', value: item.dataset_agencie },
                    { className: 'dataset-dep', label: 'Департамент: ', value: item.dataset_dep },
                    { className: 'dataset-empl', label: 'Ответственный: ', value: item.dataset_empl },
                    { className: 'dataset-date', label: 'Длина временного ряда: ', value: item.dataset_date }
                ];
                details.forEach(({ className, label, value }) => {
                    const div = document.createElement('div');
                    div.classList.add(className);
                    const span = document.createElement('span');
                    span.classList.add('highlight');
                    span.textContent = label;
                    div.appendChild(span);
                    div.appendChild(document.createTextNode(value));
                    additionalDataContainer.appendChild(div);
                });
    
                // Модальное окно для методики рассчета

                // Кнопка
                const itemDescButton = document.createElement('div');
                itemDescButton.setAttribute('id', 'dataset-desc-button');
                itemDescButton.setAttribute('cdv-code-id', item.code_id);
                itemDescButton.setAttribute('cdv-dataset-id', item.dataset_id);
                itemDescButton.textContent = 'Методика рассчета';
                additionalDataContainer.appendChild(itemDescButton);
                // Окно
                const itemDescModal = document.createElement('div');
                itemDescModal.classList.add('dataset-desc-modal');
                itemDescModal.setAttribute('id', 'dataset-desc-modal');
                // Блок контента
                const itemDescContent = document.createElement('div');
                itemDescContent.classList.add('dataset-desc-content');
                itemDescContent.setAttribute('id', 'dataset-desc-content');
                // Крестик закрыть
                const itemDescClose = document.createElement('span');
                itemDescClose.classList.add('dataset-desc-close');
                // Заголовок методики рассчета
                const itemDescH1 = document.createElement('h2');
                itemDescH1.classList.add('dataset-cdv-header1');
                itemDescH1.textContent = 'Методика расчета';
                // Текст методики рассчета
                const itemDescText = document.createElement('div');
                itemDescText.classList.add('dataset-desc-text');
                itemDescText.textContent = item.dataset_desc;
                // Заголовок показателей
                const itemDescH2 = document.createElement('h2');
                itemDescH2.classList.add('dataset-cdv-header2');
                itemDescH2.textContent = 'Доступные показатели';
                // Добавляем все в родителя
                itemDescContent.appendChild(itemDescH1);
                itemDescContent.appendChild(itemDescText);
                itemDescContent.appendChild(itemDescH2);
                itemDescContent.appendChild(itemDescClose);
                itemDescModal.appendChild(itemDescContent);
                additionalDataContainer.appendChild(itemDescModal);
                // Слушатель для получения показателей через запрос
                itemDescButton.addEventListener('click', async (event) => {
                    event.preventDefault();
                    const codeId = itemDescButton.getAttribute('cdv-code-id');
                    const datasetId = itemDescButton.getAttribute('cdv-dataset-id');
                    try {
                        const response = await fetch('http://localhost:3000/api/get-methodic', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ codeId, datasetId })
                        });
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        const data = await response.json();
                        const methodics = data.methodics;
                        if (Array.isArray(methodics)) {
                            const itemMethodicTab = document.createElement('table');
                            itemMethodicTab.classList.add('table-methodic');
                            const headerRow = document.createElement('tr');
                            itemMethodicTab.appendChild(headerRow);
                            methodics.forEach(item => {
                                const itemMethodicTr = document.createElement('tr');
                                const itemMethodicTd = document.createElement('td');
                                itemMethodicTd.classList.add('td');
                                itemMethodicTd.textContent = item.legend;
                                itemMethodicTr.appendChild(itemMethodicTd);
                                itemMethodicTab.appendChild(itemMethodicTr);
                            });
                            itemDescContent.appendChild(itemMethodicTab);
                        } else {
                            itemDescContent.textContent = 'Нет данных';
                        }
                    } catch (error) {
                        console.error('Ошибка при получении данных:', error);
                        itemDescContent.textContent = 'Ошибка загрузки данных';
                    }
                    // Отображаем модальное окно методик
                    itemDescModal.style.display = 'block';
                });
                // Закрываем модальное окно методик
                itemDescClose.addEventListener('click', () => {
                    itemDescModal.style.display = 'none';
                    removeMethodicTable();
                });
                // Функция для удаления контента при выходе из него
                function removeMethodicTable() {
                    const methodicTable = document.querySelector('.table-methodic');
                    if (methodicTable) {
                        methodicTable.remove();
                    }
                };

                // OBS
                // Кнопка получить данные
                const itemDivObs = document.createElement('div');
                itemDivObs.classList.add('dataset-obs-buttom');
                itemDivObs.textContent = 'Получить данные';
                itemDivObs.setAttribute('code-id', item.code_id);
                itemDivObs.setAttribute('dataset-id', item.dataset_id);
                additionalDataContainer.appendChild(itemDivObs);
                // Окно и его контент
                const itemDivObsContent = document.createElement('div');
                itemDivObsContent.classList.add('dataset-obs-content');
                itemDivObsContent.setAttribute('id', 'dataset-obs-content');
                const itemDivObsModal = document.createElement('div');
                itemDivObsModal.classList.add('dataset-obs-modal');
                itemDivObsModal.setAttribute('id', 'dataset-obs-modal');
                const itemObsClose = document.createElement('span');
                itemObsClose.classList.add('dataset-obs-close');
                itemDivObsContent.appendChild(itemObsClose);
                // Вкладки
                const itemDivObsTabs = document.createElement('div');
                itemDivObsTabs.setAttribute('id', 'tabs');
                // Вкладка Таблица
                const itemDivObsTabs1 = document.createElement('div');
                itemDivObsTabs1.classList.add('tab');
                itemDivObsTabs1.setAttribute('data-tab', `table-${item.code_id}-${item.dataset_id}`);
                itemDivObsTabs1.textContent = 'Таблица';
                itemDivObsTabs.appendChild(itemDivObsTabs1);
                // Вкладка Легенда
                const itemDivObsTabs2 = document.createElement('div');
                itemDivObsTabs2.classList.add('tab');
                itemDivObsTabs2.setAttribute('data-tab', `legend-${item.code_id}-${item.dataset_id}`);
                itemDivObsTabs2.textContent = 'Line Chart';
                itemDivObsTabs.appendChild(itemDivObsTabs2);
                // Вкладка Бар
                const itemDivObsTabs3 = document.createElement('div');
                itemDivObsTabs3.classList.add('tab');
                itemDivObsTabs3.setAttribute('data-tab', `bar-${item.code_id}-${item.dataset_id}`);
                itemDivObsTabs3.textContent = 'Bar Chart';
                itemDivObsTabs.appendChild(itemDivObsTabs3);
                // Вкладка Радар
                const itemDivObsTabs4 = document.createElement('div');
                itemDivObsTabs4.classList.add('tab');
                itemDivObsTabs4.setAttribute('data-tab', `radar-${item.code_id}-${item.dataset_id}`);
                itemDivObsTabs4.textContent = 'Radar Chart';
                itemDivObsTabs.appendChild(itemDivObsTabs4);
                // Имя рубрики
                const itemDivObsContentHeader = document.createElement('div');
                itemDivObsContentHeader.classList.add('content-header');
                itemDivObsContentHeader.textContent = item.dataset_classifier;
                itemDivObsTabs.appendChild(itemDivObsContentHeader);
                itemDivObsContent.appendChild(itemDivObsTabs);
    
                // Контенты (метрики)
                const itemDivObsContents = document.createElement('div');
                itemDivObsContents.setAttribute('id', 'content');
                // Контент Таблицы
                const itemDivObsXlsx = document.createElement('div');
                itemDivObsXlsx.textContent = 'Выгрузка в Excel';
                itemDivObsXlsx.setAttribute('id', 'download-excel');
                const itemDivObsContent1 = document.createElement('div');
                itemDivObsContent1.classList.add('tab');
                itemDivObsContent1.setAttribute('data-tab', `table-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent1.setAttribute('id', `table-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent1.style.display = 'block';
                itemDivObsContents.appendChild(itemDivObsXlsx);
                itemDivObsContents.appendChild(itemDivObsContent1);
                // Слушатель для кнопки скачать excel
                itemDivObsXlsx.addEventListener('click', async (event) => {
                    if (savedData) {
                        downloadExcel(savedData, item.dataset_name); // Вызываем функцию выгрузки с сохраненными данными
                    } else {
                        alert('Сначала получите данные для выгрузки.');
                    }
                });
                // Контент Легенды
                const itemDivObsContent2 = document.createElement('div');
                itemDivObsContent2.classList.add('tab');
                itemDivObsContent2.setAttribute('data-tab', `legend-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent2.setAttribute('id', `legend-${item.code_id}-${item.dataset_id}`);
                const itemDivObsContent2Legend = document.createElement('canvas');
                itemDivObsContent2Legend.setAttribute('id',`canvas-legend-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent2.appendChild(itemDivObsContent2Legend);
                itemDivObsContents.appendChild(itemDivObsContent2);
                // Контент Бара
                const itemDivObsContent3 = document.createElement('div');
                itemDivObsContent3.classList.add('tab');
                itemDivObsContent3.setAttribute('data-tab', `bar-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent3.setAttribute('id', `bar-${item.code_id}-${item.dataset_id}`);
                const itemDivObsContent3Bar = document.createElement('canvas');
                itemDivObsContent3Bar.setAttribute('id',`canvas-bar-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent3.appendChild(itemDivObsContent3Bar);
                itemDivObsContents.appendChild(itemDivObsContent3);
                // Контент Радара
                const itemDivObsContent4 = document.createElement('div');
                itemDivObsContent4.classList.add('tab');
                itemDivObsContent4.setAttribute('data-tab', `radar-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent4.setAttribute('id', `radar-${item.code_id}-${item.dataset_id}`);
                const itemDivObsContent4Radar = document.createElement('canvas');
                itemDivObsContent4Radar.setAttribute('id',`canvas-radar-${item.code_id}-${item.dataset_id}`);
                itemDivObsContent4.appendChild(itemDivObsContent4Radar);
                itemDivObsContents.appendChild(itemDivObsContent4);
                // Добавляем в родителя
                itemDivObsContent.appendChild(itemDivObsContents);
                itemDivObsModal.appendChild(itemDivObsContent);
                // Обработчик для кнопки "Получить данные"
                itemDivObs.addEventListener('click', (event) => {
                    event.preventDefault();
                    itemDivObsModal.style.display = 'block';
                });
                // Обработчик для закрытия модального окна
                itemObsClose.addEventListener('click', () => {
                    itemDivObsModal.style.display = 'none';
                    removeAllChildElements();
                });
                // Функция для удаления контента при выходе из него
                function removeAllChildElements() {
                    const tabElements = document.querySelectorAll('#content .tab');
                    tabElements.forEach(tabElement => {
                        const children = Array.from(tabElement.childNodes);
                        children.forEach(child => {
                            if (child.nodeName !== 'CANVAS') { // canvas не удаляем, нужен для charts.js
                                tabElement.removeChild(child);
                            }
                        });
                    });
                }
                additionalDataContainer.appendChild(itemDivObsModal);
                // Добавляем блок в родителя
                resultBlock.appendChild(additionalDataContainer);
            });

            // Добавляем блок в родителя
            resultDataContainer.appendChild(resultBlock);
            resultsContainer.appendChild(resultDataContainer);
        }
        resultsContainer.style.display = 'block';
    }

    let savedData = null;
   // Обработчик клика по кнопке получения данных
    document.getElementById('search-results').addEventListener('click', async (event) => {
        if (event.target.classList.contains('dataset-obs-buttom')) {
            event.preventDefault();
            const codeId = event.target.getAttribute('code-id');
            const datasetId = event.target.getAttribute('dataset-id');

            if (!codeId || !datasetId) {
                alert('Не удалось получить код или dataset.');
                return;
            }
            try {
                const response = await fetch('http://localhost:3000/api/get-obs', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ codeId, datasetId })
                });

                if (!response.ok) {
                    throw new Error('Ошибка при выполнении запроса');
                }

                const dataobs = await response.json();
                console.log(dataobs);
                savedData = dataobs.results; // Сохраняем данные
                
                // Заполнение содержимого таблицы
                generateTable(dataobs.results, codeId, datasetId);
                createChartLegend(dataobs.results, codeId, datasetId);
                createChartBar(dataobs.results, codeId, datasetId);
                createChartRadar(dataobs.results, codeId, datasetId);
                //downloadExcel(dataobs.results);
                

            } catch (error) {
                console.error('Ошибка:', error);
                alert('Произошла ошибка при выполнении запроса.');
            }
        }
    });

    // Функция генерации XLSX
    function downloadExcel(results,dataset_name) {
        const formattedData = results.map(item => ({
            "Показатель": item.legend,
            "Дата": item.val_period,
            "Единица": item.name_obs,
            "Значение": item.val_obs
        }));
        console.log(formattedData);
        const contentHeader = dataset_name;
        console.log(contentHeader);
        let fileName = 'данные.xlsx'; // Значение по умолчанию
    
        if (contentHeader) {
            
            // Удаляем знаки препинания и разбиваем строку на слова
            const words = contentHeader.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").split(/\s+/);
            console.log(words);
            
            // Получаем первые 5 слов
            const firstFiveWords = words.slice(0, 5).join(' ');
            console.log(firstFiveWords);
            
            // Формируем имя файла
            fileName = firstFiveWords + '.xlsx';
            console.log(fileName);
        }
    
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(formattedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Данные');
    
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName; // Используем извлеченное имя файла
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Функция для генерации таблицы
    function generateTable(results, codeId, datasetId) {
        const contentObs = document.getElementById(`table-${codeId}-${datasetId}`);
        contentObs.innerHTML = '';
        correctDate(results);
        const table = document.createElement('table');
        const periods = [...new Set(results.map(item => item.val_period))];
        const namePeriod = 'Период';
        const nameObs = results.length > 0 ? results[0].name_obs : 'default_obs';
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = [`Метрика (${namePeriod}, ${nameObs})`, ...periods];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        const tbody = document.createElement('tbody');
        const groupedResults = results.reduce((acc, item) => {
            if (!acc[item.legend]) {
                acc[item.legend] = { legend: item.legend, values: {} };
            }
            acc[item.legend].values[item.val_period] = item.val_obs;
            return acc;
        }, {});
        const sortedLegends = Object.keys(groupedResults).sort();
        sortedLegends.forEach(legend => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${groupedResults[legend].legend}</td>`;
            periods.forEach(period => {
                const value = groupedResults[legend].values[period] || '';
                row.innerHTML += `<td>${value}</td>`;
            });
            tbody.appendChild(row);
        });
        table.appendChild(tbody);
        contentObs.appendChild(table);
    
        // Вызов функции инициализации вкладок
        initializeTabs();
    }
    
    // Функция переключения вкладок в диаграммах
    function initializeTabs() {
        const activeModal = document.querySelector('.dataset-obs-modal[style*="display: block;"]');
        if (activeModal) {
          const tabs = activeModal.querySelectorAll('#tabs .tab');
          const contentTabs = activeModal.querySelectorAll('#content .tab');
      
          function switchTab(selectedTab) {
            const selectedTabData = selectedTab.getAttribute('data-tab');
            tabs.forEach(tab => tab.classList.remove('active'));
            contentTabs.forEach(contentTab => {
              contentTab.style.display = 'none';
            });
            selectedTab.classList.add('active');
            const activeContent = activeModal.querySelector(`#content .tab[data-tab="${selectedTabData}"]`);
            if (activeContent) {
              activeContent.style.display = 'block';
            }
          }
          tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab));
          });
      
          // Переключение на первую вкладку по умолчанию
          if (tabs.length > 0) {
            switchTab(tabs[0]);
          }
        }
      }
    
    // Сортировка даты
    function correctDate(results) {
        results.sort((a, b) => {
            return new Date(a.val_period) - new Date(b.val_period);
        });
    }

    // График легенда
    let chartInstanceLegend = null;
    function createChartLegend(results, codeId, datasetId) {
        const datasets = {};
        const labels = [];
        results.forEach(item => {
            if (!labels.includes(item.val_period)) {
                labels.push(item.val_period);
            }
            if (!datasets[item.legend]) {
                datasets[item.legend] = {
                    label: item.legend,
                    data: new Array(labels.length).fill(0),
                    borderColor: getRandomColor(),
                    fill: false
                };
            }
            const index = labels.indexOf(item.val_period);
            if (index !== -1) {
                datasets[item.legend].data[index] = item.val_obs;
            }
        });
        const chartData = Object.values(datasets);
        if (chartInstanceLegend) {
            chartInstanceLegend.destroy();
        }
        const ctx = document.getElementById(`canvas-legend-${codeId}-${datasetId}`).getContext('2d');
        chartInstanceLegend = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: chartData
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'left',
                    },
                    title: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: results.length > 0 ? results[0].name_obs : 'Значение'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Период'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }
                }
            }
        });
    }

    // График Бар
    let chartInstanceBar = null;
    function createChartBar(results, codeId, datasetId) {
        const datasets = {};
        const labels = [];
        results.forEach(item => {
            if (!labels.includes(item.val_period)) {
                labels.push(item.val_period);
            }
            if (!datasets[item.legend]) {
                datasets[item.legend] = {
                    label: item.legend,
                    data: new Array(labels.length).fill(0),
                    backgroundColor: getRandomColor(),
                    borderColor: getRandomColor(),
                    borderWidth: 1,
                };
            }
            const index = labels.indexOf(item.val_period);
            if (index !== -1) {
                datasets[item.legend].data[index] = item.val_obs;
            }
        });
        const chartData = Object.values(datasets);
        if (chartInstanceBar) {
            chartInstanceBar.destroy();
        }
        const ctx = document.getElementById(`canvas-bar-${codeId}-${datasetId}`).getContext('2d');
        chartInstanceBar = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: chartData
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'left',
                    },
                    title: {
                        display: true
                    }
                },
                scales: {
                    y: {
                        stacked: true,
                        title: {
                            display: true,
                            text: results.length > 0 ? results[0].name_obs : 'Значение'
                        }
                    },
                    x: {stacked: true,
                        title: {
                            text: 'Период'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 20
                        }
                    }
                }
            }
        });
    }

    // График Радар
    let chartInstanceRadar = null;
    function createChartRadar(results, codeId, datasetId) {
        const datasets = {};
        const labels = [];
        results.forEach(item => {
            if (!labels.includes(item.val_period)) {
                labels.push(item.val_period);
            }
            if (!datasets[item.legend]) {
                datasets[item.legend] = {
                    label: item.legend,
                    data: new Array(labels.length).fill(0),
                    backgroundColor: getRandomColor(),
                    borderColor: getRandomColor(),
                    borderWidth: 1,
                };
            }
            const index = labels.indexOf(item.val_period);
            if (index !== -1) {
                datasets[item.legend].data[index] = item.val_obs;
            }
        });
        const chartData = Object.values(datasets);
        if (chartInstanceRadar) {
            chartInstanceRadar.destroy();
        }
        const ctx = document.getElementById(`canvas-radar-${codeId}-${datasetId}`).getContext('2d');
        chartInstanceRadar = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: labels,
                datasets: chartData
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'left',
                    },
                    title: {
                        display: true,
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: results.length > 0 ? results[0].name_obs : 'Значение'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10
                        }
                    }
                }
            }
        });
    }
    
    // Функция для генерации случайного цвета (для всех графиков)
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    document.getElementById('card-toggle').addEventListener('click', async (event) => {
        event.preventDefault();
        try {
            const mainBody = document.getElementsByClassName("Main")[0]; // Получаем первый элемент с классом Main
            const itemSchemaModal = document.createElement('div');
            itemSchemaModal.classList.add('schema-modal');
            itemSchemaModal.setAttribute('id', 'schema-modal');
            const itemSchemaContent = document.createElement('div');
            itemSchemaContent.classList.add('schema-content');
            itemSchemaContent.setAttribute('id', 'schema-content');
            const itemSchemaClose = document.createElement('span');
            itemSchemaClose.classList.add('schema-close');
            itemSchemaClose.addEventListener('click', () => {
                itemSchemaModal.remove();
            });
            const itemSchemaH1 = document.createElement('h2');
            itemSchemaH1.classList.add('schema-header1');
            itemSchemaH1.textContent = 'Схема данных';

            // Блок с контентом
            const itemSchemaTables = document.createElement('div');
            itemSchemaTables.classList.add('schema-text');

            // Вкладки контента
            const itemDivSchemaTabs = document.createElement('div');
            itemDivSchemaTabs.setAttribute('id', 'tabs');
            // Вкладка 1 Общая схема
            const itemDivSchemaTabs1 = document.createElement('div');
            itemDivSchemaTabs1.classList.add('tab');
            itemDivSchemaTabs1.textContent = 'Общая схема';
            itemDivSchemaTabs.appendChild(itemDivSchemaTabs1);
            // Вкладка 2 Поиск по рубрике
            const itemDivSchemaTabs2 = document.createElement('div');
            itemDivSchemaTabs2.classList.add('tab');
            itemDivSchemaTabs2.textContent = 'Поиск по рубрике';
            itemDivSchemaTabs.appendChild(itemDivSchemaTabs2);
            // Вкладка 3 Поиск по классификатору
            const itemDivSchemaTabs3 = document.createElement('div');
            itemDivSchemaTabs3.classList.add('tab');
            itemDivSchemaTabs3.textContent = 'Поиск по классификатору';
            itemDivSchemaTabs.appendChild(itemDivSchemaTabs3);
            // Вкладка 4 Поиск по полнотексту
            const itemDivSchemaTabs4 = document.createElement('div');
            itemDivSchemaTabs4.classList.add('tab');
            itemDivSchemaTabs4.textContent = 'Полнотекстовый поиск';
            itemDivSchemaTabs.appendChild(itemDivSchemaTabs4);

            // Контенты
            const itemDivSchemaContents = document.createElement('div');
            itemDivSchemaContents.setAttribute('id', 'content');
            // Контент 1 Общая схема
            const itemDivSchemaContent1 = document.createElement('div');
            itemDivSchemaContent1.classList.add('tab');
            itemDivSchemaContent1.style.display = 'block';
            itemDivSchemaContents.appendChild(itemDivSchemaContent1);
            const itemDivSchemaImg1 = document.createElement('img');
            itemDivSchemaImg1.classList.add('diag-001');
            itemDivSchemaContent1.appendChild(itemDivSchemaImg1);
            // Контент 2 Поиск по рубрике
            const itemDivSchemaContent2 = document.createElement('div');
            itemDivSchemaContent2.classList.add('tab');
            itemDivSchemaContent2.style.display = 'block';
            itemDivSchemaContents.appendChild(itemDivSchemaContent2);
            const itemDivSchemaImg2 = document.createElement('img');
            itemDivSchemaImg2.classList.add('diag-002');
            itemDivSchemaContent2.appendChild(itemDivSchemaImg2);
            // Контент 3 Поиск по классификатору
            const itemDivSchemaContent3 = document.createElement('div');
            itemDivSchemaContent3.classList.add('tab');
            itemDivSchemaContent3.style.display = 'block';
            itemDivSchemaContents.appendChild(itemDivSchemaContent3);
            const itemDivSchemaImg3 = document.createElement('img');
            itemDivSchemaImg3.classList.add('diag-003');
            itemDivSchemaContent3.appendChild(itemDivSchemaImg3);
            // Контент 4 Поиск по полнотексту
            const itemDivSchemaContent4 = document.createElement('div');
            itemDivSchemaContent4.classList.add('tab');
            itemDivSchemaContent4.style.display = 'block';
            itemDivSchemaContents.appendChild(itemDivSchemaContent4);
            const itemDivSchemaImg4 = document.createElement('img');
            itemDivSchemaImg4.classList.add('diag-004');
            itemDivSchemaContent4.appendChild(itemDivSchemaImg4);

            itemSchemaContent.appendChild(itemSchemaH1);
            itemSchemaContent.appendChild(itemDivSchemaTabs);
            itemSchemaContent.appendChild(itemDivSchemaContents);
            itemSchemaContent.appendChild(itemSchemaClose);
            itemSchemaContent.appendChild(itemSchemaTables);
            itemSchemaModal.appendChild(itemSchemaContent);
            mainBody.appendChild(itemSchemaModal);
            itemSchemaModal.style.display = 'block';
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
        }
        initializeSchemaTabs();
    });

    // Функция переключения вкладок в схеме данных
    function initializeSchemaTabs() {
        const activeModal = document.querySelector('.schema-modal[style*="display: block;"]');
        if (activeModal) {
          const tabs = activeModal.querySelectorAll('#tabs .tab');
          const contentTabs = activeModal.querySelectorAll('#content .tab');
          function switchTab(selectedTab) {
            tabs.forEach(tab => tab.classList.remove('active'));
            contentTabs.forEach(contentTab => {
              contentTab.style.display = 'none';
            });
            const index = Array.from(tabs).indexOf(selectedTab);
            selectedTab.classList.add('active');
            contentTabs[index].style.display = 'block';
          }
          tabs.forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab));
          });
          if (tabs.length > 0) {
            switchTab(tabs[0]);
          }
        }
      }
      
});

    
