document.addEventListener("DOMContentLoaded", () => {
    const rotators = document.querySelectorAll('.rotator');

    rotators.forEach(rotator => {
        const cases = rotator.querySelectorAll('.rotator__case');
        let currentIndex = 0;

        const changeCase = () => {
            // Убираем активный класс с текущего элемента
            const currentCase = cases[currentIndex];
            currentCase.classList.remove('rotator__case_active');
            
            // Переходим к следующему элементу
            currentIndex = (currentIndex + 1) % cases.length;
            const nextCase = cases[currentIndex];
            
            // Устанавливаем активный класс и цвет
            nextCase.classList.add('rotator__case_active');
            nextCase.style.color = nextCase.dataset.color || '#000'; // Если цвет не указан, используем черный

            // Получаем скорость или используем дефолтное значение 1000ms
            const speed = parseInt(nextCase.dataset.speed, 10) || 1000;
            
            // Устанавливаем таймер для следующей смены
            setTimeout(changeCase, speed);
        };

        // Инициализация первого элемента
        const initialCase = cases[currentIndex];
        const initialSpeed = parseInt(initialCase.dataset.speed, 10) || 1000;
        
        // Запускаем первую смену через заданное время
        setTimeout(changeCase, initialSpeed);
    });
});