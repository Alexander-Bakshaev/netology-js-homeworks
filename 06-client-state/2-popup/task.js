document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на модальное окно по id и крестик закрытия окна по классу
    const modal = document.getElementById('subscribe-modal');
    const modalContent = modal.querySelector('.modal__content');
    const modalClose = modal.querySelector('.modal__close_times');
    let isClosing = false;
    
    // Функция для закрытия модального окна
    function closeModal() {
        if (isClosing) return;
        
        isClosing = true;
        modal.classList.remove('modal_active');
        document.cookie = "modalClosed=true; max-age=" + 60 * 60 * 24 * 365;
        
        // Разрешаем повторное закрытие после анимации
        setTimeout(() => {
            isClosing = false;
        }, 300);
    }
    
    // Проверяем, есть ли cookie, которое говорит о том, что окно было закрыто
    const isModalClosed = document.cookie.includes('modalClosed=true');
    
    // Если cookie не существует (окно не было закрыто ранее), то показываем окно
    if (!isModalClosed) {
        setTimeout(() => {
            modal.classList.add('modal_active');
        }, 1000);
    }

    // Обработчик клика по кнопке закрытия
    modalClose.addEventListener('click', closeModal);
    
    // Закрытие при клике на подложку
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Закрытие по клавише ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('modal_active')) {
            e.preventDefault();
            closeModal();
        }
    });
    
    // Предотвращаем закрытие при клике внутри контента
    modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
    });
});