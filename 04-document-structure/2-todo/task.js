document.addEventListener("DOMContentLoaded", () => {
    // Получаем элементы формы, поля ввода и списка задач
    const tasksForm = document.getElementById("tasks__form");
    const tasksInput = document.getElementById("task__input");
    const tasksList = document.getElementById("tasks__list");
    const notification = document.getElementById("notification");
    
    // Функция для показа уведомления
    function showNotification(message, isError = false) {
        notification.textContent = message;
        notification.style.display = 'block';
        notification.style.backgroundColor = isError ? '#ff4444' : '#4CAF50';
        notification.style.animation = 'fadeIn 0.3s ease forwards';
        
        // Скрываем уведомление через 3 секунды
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 300);
        }, 3000);
    }

    // Функция для создания задачи на основе переданного текста
    function createTaskElement(taskText) {
        // Создаем HTML-разметку с помощью шаблонных строк
        const taskHTML = `
            <div class="task">
                <div class="task__title">
                    ${taskText}
                </div>
                <a href="#" class="task__remove">&times;</a>
            </div>
        `;
        
        // Создаем элемент из HTML-строки
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = taskHTML.trim();
        const task = tempDiv.firstChild;
        
        // Находим кнопку удаления и добавляем обработчик
        const removeButton = task.querySelector('.task__remove');
        removeButton.addEventListener('click', (e) => {
            e.preventDefault();
            // Добавляем анимацию удаления
            task.classList.add('removing');
            
            // Удаляем элемент после завершения анимации
            setTimeout(() => {
                task.remove();
                saveTasks();
                showNotification('Задача удалена');
            }, 300);
        });

        // Добавляем задачу в список задач на странице
        tasksList.appendChild(task);
    }

    // Функция для сохранения всех задач в localStorage
    function saveTasks() {
        const tasks = [];
        document.querySelectorAll(".task__title").forEach(task => {
            tasks.push(task.textContent);
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Функция для загрузки задач из localStorage при загрузке страницы
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(taskText => {
            createTaskElement(taskText);
        });
    }

    // Обработчик события добавления новой задачи
    tasksForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskText = tasksInput.value.trim();

        // Проверка на пустую строку
        if (!taskText) {
            tasksInput.classList.add('input-error');
            showNotification('Пожалуйста, введите текст задачи', true);
            
            // Удаляем класс ошибки через 0.5 секунды
            setTimeout(() => {
                tasksInput.classList.remove('input-error');
            }, 500);
            return;
        }

        createTaskElement(taskText);
        saveTasks();
        tasksInput.value = "";
        showNotification('Задача успешно добавлена!');
    });

    // Загружаем задачи из localStorage при загрузке страницы
    loadTasks();
});