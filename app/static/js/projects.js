document.addEventListener('DOMContentLoaded', () => {
    const openProjectsModal = document.getElementById('openProjectsModal');
    const modalContainer = document.getElementById('dynamic-modal-container');
    
    const audioElement = document.getElementById('audio');
    

    openProjectsModal.addEventListener('click', () => {
        // Запрос данных о проектах
        fetch('projects_list')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Ошибка загрузки списка проектов');
                }
                return response.json();
            })
            
            .then(projects => {
                
                // Формируем HTML модального окна
                const modalHTML = `
                <div class="modal fade" id="projectsModal" tabindex="-1" aria-labelledby="projectsModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="projectsModalLabel">Список проектов</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div class="list-group" >
                                    ${projects.map(project => `
                                        <div onclick=${audioElement.src = project.audio_files}></div>
                                        <a href="/static/audio/${project.audio_files}" class="list-group-item list-group-item-action" >
                                            ${project.name}
                                        </a>`).join('')}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                            </div>
                        </div>
                    </div>
                </div>
                `;

                // Вставляем модальное окно в контейнер
                
                modalContainer.innerHTML = modalHTML;
                
                // Инициализируем модальное окно с помощью Bootstrap
                const projectsModal = new bootstrap.Modal(document.getElementById('projectsModal'));
                projectsModal.show();
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Не удалось загрузить проекты');
            });
    });
});
