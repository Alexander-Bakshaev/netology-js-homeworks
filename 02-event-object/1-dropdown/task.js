// Основная функция инициализации выпадающих списков
const initDropdowns = () => {
    // Получаем все выпадающие списки на странице
    const dropdowns = document.querySelectorAll('.dropdown');

    // Инициализируем каждый выпадающий список
    dropdowns.forEach(dropdown => {
        const dropdownValue = dropdown.querySelector('.dropdown__value');
        const dropdownList = dropdown.querySelector('.dropdown__list');

        // Обработчик клика на кнопке выпадающего списка
        dropdownValue.addEventListener('click', () => {
            dropdownList.classList.toggle('dropdown__list_active');
        });

        // Используем делегирование событий для пунктов меню
        dropdownList.addEventListener('click', event => {
            const item = event.target.closest('.dropdown__item');
            if (item) {
                event.preventDefault();
                const selectedValue = item.querySelector('.dropdown__link').textContent;
                dropdownValue.textContent = selectedValue;
                dropdownList.classList.remove('dropdown__list_active');
            }
        });
    });
};

// Инициализируем выпадающие списки после загрузки DOM
document.addEventListener('DOMContentLoaded', initDropdowns);