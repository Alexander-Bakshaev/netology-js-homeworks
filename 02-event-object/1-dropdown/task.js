// Основная функция инициализации выпадающих списков
document.addEventListener('DOMContentLoaded', () => {
    // Получаем все выпадающие списки на странице
    const dropdowns = document.querySelectorAll('.dropdown');

    // Инициализируем каждый выпадающий список
dropdowns.forEach(dropdown => {
    const dropdownValue = dropdown.querySelector('.dropdown__value');
    const dropdownList = dropdown.querySelector('.dropdown__list');
    const dropdownItems = dropdown.querySelectorAll('.dropdown__item');

    // Обработчик клика на кнопке выпадающего списка
    dropdownValue.addEventListener('click', () => {
        dropdownList.classList.toggle('dropdown__list_active');
    });

    // Обработчик навигации по клавиатуре
    dropdownValue.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            dropdownList.classList.toggle('dropdown__list_active');
        }
        
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            dropdownList.classList.add('dropdown__list_active');
            dropdownItems[0].querySelector('.dropdown__link').focus();
        }
    });

    // Управление фокусом в списке
    dropdownList.addEventListener('keydown', (event) => {
        const links = dropdown.querySelectorAll('.dropdown__link');
        const currentIndex = Array.from(links).indexOf(document.activeElement);

        if (event.key === 'Escape') {
            event.preventDefault();
            dropdownList.classList.remove('dropdown__list_active');
            dropdownValue.focus();
        }

        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            const selectedValue = event.target.textContent;
            dropdownValue.textContent = selectedValue;
            dropdownList.classList.remove('dropdown__list_active');
            dropdownValue.focus();
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            const nextIndex = (currentIndex + 1) % links.length;
            links[nextIndex].focus();
        }

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            const prevIndex = (currentIndex - 1 + links.length) % links.length;
            links[prevIndex].focus();
        }
    });

    // Используем делегирование событий для пунктов меню
    dropdownList.addEventListener('click', (event) => {
        // Ищем ближайший элемент .dropdown__item
        const item = event.target.closest('.dropdown__item');
        if (item) {
            event.preventDefault();
            const selectedValue = item.querySelector('.dropdown__link').textContent;
            
            // Обновляем значение в кнопке и закрываем список
            dropdownValue.textContent = selectedValue;
            dropdownList.classList.remove('dropdown__list_active');
            dropdownValue.focus();
        }
    });
});
});