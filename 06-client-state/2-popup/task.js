document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на модальное окно по id и крестик закрытия окна по классу
    const modal = document.getElementById('subscribe-modal');
    const modalClose = document.querySelector('.modal__close_times');
    
    // Проверяем, есть ли cookie, которое говорит о том, что окно было закрыто
    const isModalClosed = document.cookie.includes('modalClosed=true');
    
    // Если cookie не существует (окно не было закрыто ранее), то показываем окно
    if (!isModalClosed) {
        modal.classList.add('modal_active');
    }

    // Обрабатываем событие закрытия окна по клику на крестик. Устанавливаем cookie
    modalClose.addEventListener('click', function() {
        modal.classList.remove('modal_active');
        document.cookie = "modalClosed=true; max-age=" + 60 * 60 * 24 * 365;
    });
});