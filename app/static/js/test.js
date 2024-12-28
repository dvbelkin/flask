
    


    /* Блок ищет аудио на страницы и считывает время есго исполнения */
    audio = document.getElementById('audio');


    audio.addEventListener('timeupdate', function() {
        const currentTime = audio.currentTime;


    /* Блок считывает json файл с данными и создает страницу*/    

    /*Блок помечает классом hightlight все блоки у текущеее время исполнения укладыветася между  страт и стоп блока*/
    const words = document.querySelectorAll('#table-text span');

    for (let i = 0; i < words.length; i++) {
            const word = words[i];
            const wordinnerElement = word.querySelector('textarea'); // Например, выбираем

            const startTime = parseFloat(word.getAttribute('data-start'));
            const endTime = parseFloat(word.getAttribute('data-end'));


            // Если текущее время в интервале начала и конца, выделяем слово
            if (currentTime >= startTime && currentTime < endTime) {
                
                wordinnerElement.classList.add('highlight');
                /*Добавляем движение страницы в зависимости от времени прослушивания. Т.е. перемещяем видимы текст  */
                word.scrollIntoView({
                    behavior: 'smooth', // Прокрутка с анимацией
                    block: 'center',   // Выровнять элемент по вертикали
                    inline: 'center'   // Выровнять элемент по горизонтали
                });
                //console.log(currentTime, startTime, endTime)
                break; // Прерываем цикл	    
            } else {
                wordinnerElement.classList.remove('highlight');
            }
    }


    });


    /* кнопочка Сохранения в файл измененных данных*/ 


    document.getElementById('saveBtn').addEventListener('click', function() {
        let dataArray = [];
        let allBlock = []
        allBlock = document.querySelectorAll('.speaker')
        
        

        // Create a new data object
        allBlock.forEach((element, index) => {
            const text = element.querySelector('textarea');
            const speaker = element.querySelector('select');
            const startTime = element.querySelector('span[data-start]')
            const endTime = element.querySelector('span[data-end]')
            
            
            dataArray.push({
                speaker: speaker.value,
                text: text.value,
                start: parseFloat(startTime.getAttribute('data-start')),
                end: parseFloat(endTime.getAttribute('data-end')),
            });
        })
            

        /* Обьединить одинаковых спикеров идущих подряд*/
        dataArray = dataArray.reduce((acc, curr) => {
            
            const last = acc[acc.length - 1];
            
            if (last && last.speaker === curr.speaker) {
                last.start = Math.min(last.start, curr.start);
                last.end = Math.max(last.end, curr.end);
                last.text= last.text + curr.text

            } else {
                acc.push(curr);
            }
            return acc;
        }, []);


        // Convert the array to JSON
        const jsonData = JSON.stringify(dataArray, null, 2);
        const filename = document.getElementById('project_name').innerHTML

        // Create a Blob from the JSON data

        const blob = new Blob([jsonData], { type: 'application/json' });
        const formData = new FormData();
        formData.append('file', blob, `${filename}_out.json`);
        

        // Отправляем POST-запрос на сервер
        fetch('/flask/api/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                Swal.fire({
                    //title: 'Полезные команды',
                    html: `<div>Проект ${filename} успешно сохранен</div>`,
                    icon: 'success', // Тип иконки: 'success', 'error', 'warning', 'info', 'question'
                    confirmButtonText: 'Ок'
                });
                console.log('File successfully uploaded');
            } else {
                Swal.fire({
                    //title: 'Полезные команды',
                    icon: 'error', // Тип иконки: 'success', 'error', 'warning', 'info', 'question'
                    confirmButtonText: 'Ок'
                });
                console.error('File upload failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });  
    });




    /*Хелп документа */
    document.getElementById('help').addEventListener('click', function() {
        Swal.fire({
            //title: 'Полезные команды',
            html: '<div><p>Ctl-Space: Запустить/остановить плейер</p><p>Ctl-Enter добавить нового спикера</p></div>',
            //icon: 'question', // Тип иконки: 'success', 'error', 'warning', 'info', 'question'
            confirmButtonText: 'Ок'
        });
    })


    
    // Функция для остановки воспроизведения аудио
    function stopAudio(audio) {
        if (!audio.paused) {
            audio.pause(); // Останавливаем воспроизведение
            //audio.currentTime = 0; // Сбрасываем воспроизведение к началу
        }   else {
            audio.play(); // Воспроизводим аудио
        }
    }

    // Добавляем обработчик событий для нажатия клавиш Ctl+Space
    document.addEventListener('keydown', function(event) {
        const audio = document.getElementById('audio');
        // Проверяем, что нажаты Ctrl и Пробел
        if (event.ctrlKey && event.code === 'Space') {
            event.preventDefault(); // Предотвращаем стандартное поведение
            stopAudio(audio); // Останавливаем аудио
        }
    });


    // Добавляем обработчик событий для нажатия клавиш Ctl+Enter
    document.addEventListener('keydown', function(event) {
        // Проверяем, что нажаты Ctrl и Пробел
        if (event.ctrlKey && event.code === 'Enter') {
            activeElemnt = document.getElementsByClassName('highlight')
            if (activeElemnt.length > 0) {
                block = activeElemnt[0].parentElement.parentElement;
                span = block.querySelector('span[data-start][data-end]');
                let end = span.getAttribute('data-end');
                let start = span.getAttribute('data-start');
            
                newElement = document.createElement('div')
                // тут одна проблема с временем начала конца. Его видимо нужно как то редактировать?? И в предидущем блоке тоже? 
                saveBlokButton = `<button class="save-button" onclick="svBlock(this)" title="Сохранить время блока">
                                <img src="img/save.png" alt="Сохранить">
                            </button>`

                editBlockButton = `<button class="edit-button" onclick="editBlock(this)" title='Редактировать'>
                                    <img src="img/edit.png" >
                                </button>`

                p = `<div style='display: flex; flex-direction'>
                        <p style="display: inline;" name="StartAndEnd"> 
                            <input type="number" name="start" value="${start}" style="width: 50px;"> -
                            <input type="number" name="end" value="${end}" style="width: 50px;">
                        </p>
                        ${editBlockButton}
                        ${saveBlokButton}
                    </div>`
                
                span =`<span  data-start="${start}" data-end="${end}">
                        <textarea rows="1"></textarea>
                    </span>`

                select = `<select name="options">
                            <option value="SPEAKER_01">SPEAKER_01</option>
                            <option value="SPEAKER_02">SPEAKER_02</option>
                            <option value="SPEAKER_03">SPEAKER_03</option>
                            <option value="SPEAKER_04">SPEAKER_04</option>
                            <option value="unknown">Unknown</option>
                        </select>`
                delBlok = `<button class="delete-button" onclick="deleteBlock(this)">
                                <img src="img/trash.png" alt="Удалить">
                            </button>`

                newElement.innerHTML = `<div class='speaker'>${select} ${span} ${p} ${delBlok} </div>`;
                block.after(newElement)
            }
            
        }
    });

    function deleteBlock(button) {
        // Удаляем родительский элемент кнопки (то есть блок div)
        button.parentElement.remove();
    }

    function editBlock(button) {
        buttonBox = button.parentElement
        speaker = button.parentElement.parentElement // два раза поднимаемся вверх по дереву 
        startEnd = speaker.querySelector('p[name=StartAndEnd]');
        
        text = startEnd.innerHTML
        const numbers = text.match(/\d+(\.\d+)?/g);

        // Парсим строки в числа
        const start = parseFloat(numbers[0]);
        const end = parseFloat(numbers[1]);
        startEnd.innerHTML = `
                <input type="number" name="start" value="${start}" style="width: 50px;"> -
                <input type="number" name="end" value="${end}" style="width: 50px;">`
        saveBlokButton = `<button class="save-button" onclick="svBlock(this)" title="Сохранить время блока">
                            <img src="img/save.png" alt="Сохранить">
                        </button>`
        buttonBox.innerHTML += saveBlokButton
        
        
    }
    function svBlock(button) {
        // Сохраняем время 
        
        speaker = button.parentElement.parentElement // два раза поднимаемся вверх по дереву 
        let end = speaker.querySelector('input[name=end]');
        let start = speaker.querySelector('input[name=start]');
        startEnd = speaker.querySelector('p[name=StartAndEnd]');
        startEnd.innerHTML = `${start.value} - ${end.value}`;

        span = speaker.querySelector('span')
        
        span.setAttribute('data-start', start.value);
        span.setAttribute('data-end', end.value);

        button.remove();
    
        
    }

    
    // Загрузка проекта 
    document.getElementById('loadProject').addEventListener('click', function(event) {
        /*Загружаем список проектов*/ 

        fetch(`project_file/project_name.json`)
        .then(response => response.json())
        .then(data => {
            select = '<select style="width: 100%; max-width: 300px" id="project_id">'
            data.forEach((item)=>{
                select +=  `<option value="${item.name}">${item.name}</option>`
            })
            select += '</select>'

            Swal.fire({
                //title: 'Полезные команды',
                html: select,
                showCancelButton: true,
                confirmButtonText: "OK",
                confirmButtonColor: "#4CAF50",
                //icon: 'question', // Тип иконки: 'success', 'error', 'warning', 'info', 'question'
                preConfirm: () => {
                    const selectedOption = document.getElementById('project_id').value;
                    return selectedOption;
                }
            }).then((result) => {
                
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {

                    openProject(result.value);

                } else if (result.isDenied) {

                    Swal.fire("Changes are not saved", "", "info");

                }
        })
        })
    })

    function openProject(file_name) {

    
        fetch(`project_file/${file_name}_out.json`)
        .then(response => response.json())
        .then(data => {
            
            let container = document.getElementById('table-text');
            let project_name = document.getElementById('project_name');
            let htmlContent = '';
            let selectedOption = '';
            

            data.forEach(item => {
                selectedOption = '';
        
                if (item.speaker === 'SPEAKER_01') {
                    selectedOption = 'SPEAKER_01';
                } else if (item.speaker === 'SPEAKER_02') {
                    selectedOption = 'SPEAKER_02';
                } else if (item.speaker === 'SPEAKER_03') {
                    selectedOption = 'SPEAKER_03';
                } else if (item.speaker === 'SPEAKER_04') {
                    selectedOption = 'SPEAKER_04';
                }  else {
                    selectedOption = 'unknown';
                }
                
                p = `<div style='display: flex'>
                        <p name="StartAndEnd"> ${item.start} - ${item.end} </p>
                            <button class="edit-button" onclick="editBlock(this)" title="Редактировать блок временни">
                                <img src="img/edit.png">
                            </button>
                    </div>`

                span =`<span  data-start="${item.start}" data-end="${item.end}">
                        <textarea rows="1">${item.text}</textarea>
                    </span>`
                delBlok = `<button class="delete-button" onclick="deleteBlock(this)" title="Удалить блок">
                                <img src="img/trash.png">
                            </button>`
                
                
                select = `<select data-speaker="${selectedOption}">
                            <option value="SPEAKER_01" ${selectedOption === 'SPEAKER_01' ? 'selected' : ''}>SPEAKER_01</option>
                            <option value="SPEAKER_02" ${selectedOption === 'SPEAKER_02' ? 'selected' : ''}>SPEAKER_02</option>
                            <option value="SPEAKER_03" ${selectedOption === 'SPEAKER_03' ? 'selected' : ''}>SPEAKER_03</option>
                            <option value="SPEAKER_04" ${selectedOption === 'SPEAKER_04' ? 'selected' : ''}>SPEAKER_04</option>
                            <option value="unknown" ${selectedOption === 'unknown' ? 'selected' : ''}>Unknown</option>
                        </select>`
                
                htmlContent += `<div class='speaker' name='${selectedOption}'>${select} ${span} ${p} ${delBlok}</div>`;
            });
            project_name.innerHTML = file_name; /*Текст названия проекта добавляем */
            
            project_name.hidden= false /*Текст названия проекта делаем видимым */
            

            container.innerHTML = htmlContent;
            
        })
    
        audio.src = `./project_file/${file_name}.mp3`;
        audio.load();

    }
