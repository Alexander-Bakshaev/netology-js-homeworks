document.addEventListener("DOMContentLoaded", () => {
    // Получаем элементы формы, поля ввода и списка задач
    const tasksForm = document.getElementById("tasks__form");
    const tasksInput = document.getElementById("task__input");
    const tasksList = document.getElementById("tasks__list");

    // Функция для создания задачи на основе переданного текста
    function createTaskElement(taskText) {
        // Создаем контейнер для задачи
        const task = document.createElement("div");
        task.className = "task";

        // Создаем элемент для отображения текста задачи
        const taskTitle = document.createElement("div");
        taskTitle.className = "task__title";
        taskTitle.textContent = taskText;

        // Создаем ссылку для удаления задачи
        const taskRemove = document.createElement("a");
        taskRemove.href = "#";
        taskRemove.className = "task__remove";
        taskRemove.innerHTML = "&times;";
        
        // Добавляем обработчик события для удаления задачи при клике на "×"
        taskRemove.addEventListener("click", (e) => {
            e.preventDefault();
            task.remove();
            saveTasks();
        });

        // Добавляем текст задачи и кнопку удаления в контейнер задачи
        task.appendChild(taskTitle);
        task.appendChild(taskRemove);

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

        if (taskText) {
            createTaskElement(taskText);
            saveTasks();
            tasksInput.value = "";
        }
    });

    // Загружаем задачи из localStorage при загрузке страницы
    loadTasks();
});