document.addEventListener('DOMContentLoaded', function() {
    // Получаем ссылки на элементы
    const editor = document.getElementById('editor');
    const clearButton = document.getElementById('clearButton');
    
    // Функция для обновления состояния кнопки
    function updateButtonState() {
        clearButton.disabled = !editor.value.trim();
    }

    // Восстанавливаем текст из localStorage, если он есть
    if (localStorage.getItem('editorContent')) {
        editor.value = localStorage.getItem('editorContent');
        updateButtonState();
    }

    // Сохраняем текст в localStorage при каждом изменении
    editor.addEventListener('input', () => {
        localStorage.setItem('editorContent', editor.value);
        updateButtonState();
    });

    // Обработчик кнопки очистки
    clearButton.addEventListener('click', function() {
        if (editor.value && confirm('Вы уверены, что хотите очистить текст?')) {
            editor.value = '';
            localStorage.removeItem('editorContent');
            updateButtonState();
            editor.focus();
        }
    });

    // Устанавливаем начальное состояние кнопки
    updateButtonState();
});