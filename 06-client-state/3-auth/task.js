// Получаем ссылки на элементы
const signinForm = document.getElementById('signin__form');
const signinBtn = document.getElementById('signin__btn');
const signinBlock = document.getElementById('signin');
const welcomeBlock = document.getElementById('welcome');
const userIdSpan = document.getElementById('user_id');

document.addEventListener('DOMContentLoaded', function () {
    // Если в локальном хранилище есть user_id, показываем блок приветствия
    const userId = localStorage.getItem('user_id');
    if (userId) {
        showWelcome(userId);
    }

    // Обработчик отправки формы
    signinForm.addEventListener('submit', function (event) {
        // Собираем данные формы
        event.preventDefault();
        const formData = new FormData(signinForm);
        
        // Проверяем заполненность полей
        if (!formData.get('login') || !formData.get('password')) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        const data = new URLSearchParams(formData).toString();

        // Отправляем данные на сервер
        fetch('https://students.netoservices.ru/nestjs-backend/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })

        .then(response => response.json())

        .then(data => {
             // В случае успеха сохраняем user_id в localStorage и показываем приветствие, скрыв форму авторизации
            if (data.success) {
                localStorage.setItem('user_id', data.user_id);
                showWelcome(data.user_id);
                signinBlock.classList.remove('signin_active');
            } else {
                // В случае неудачи выводим сообщение о неверном пароле
                alert('Неверный логин/пароль');
            }
        })

        .catch(error => {
            // Обработка ошибок сети
            if (!navigator.onLine) {
                alert('Нет подключения к интернету');
            } else {
                console.error('Ошибка при отправке данных:', error);
                alert('Произошла ошибка при авторизации');
            }
        })

        .finally(() => {
            // Очищаем форму после попытки авторизации
            signinForm.reset();
        });
    });

    // Функция для отображения блока приветствия
    function showWelcome(userId) {
        userIdSpan.textContent = userId;
        welcomeBlock.classList.add('welcome_active');
        
        // Скрываем заголовок "Авторизация"
        const title = document.querySelector('.card > h1');
        if (title) {
            title.style.display = 'none';
        }
    }
});

// Функция для деавторизации
function logout() {
    if (!confirm('Вы уверены, что хотите выйти?')) {
        return;
    }
    localStorage.removeItem('user_id');
    welcomeBlock.classList.remove('welcome_active');
    signinBlock.classList.add('signin_active');
    
    // Показываем заголовок "Авторизация" при выходе
    const title = document.querySelector('.card > h1');
    if (title) {
        title.style.display = 'block';
    }
}