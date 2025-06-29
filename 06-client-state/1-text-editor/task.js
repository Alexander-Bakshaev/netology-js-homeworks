document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылку на текстовое поле из HTML-документа
    const editor = document.getElementById('editor');

    // Создаем кнопку "Очистить содержимое"
    const clearButton = document.createElement('button');
    clearButton.textContent = "Очистить содержимое";

    // Добавляем кнопку в элемент с классом card
    const card = document.querySelector('.card');
    card.appendChild(clearButton);

    // Восстанавливаем текст из localStorage, если он есть
    if (localStorage.getItem('editorContent')) {
        editor.value = localStorage.getItem('editorContent');
    }

    // Сохраняем текст в localStorage при каждом его изменении в текстовом поле
    editor.addEventListener('input', () => {
        localStorage.setItem('editorContent', editor.value);
    });

    // Очищаем содержимое текстового поля и localStorage при клике на кнопку
    clearButton.addEventListener('click', () => {
        editor.value = '';
        localStorage.removeItem('editorContent');
    });
});