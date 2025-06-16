document.addEventListener('DOMContentLoaded', () => {
    // Находим все контейнеры с вкладками на странице
    document.querySelectorAll('.tabs').forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const contents = container.querySelectorAll('.tab__content');
        
        // Обработчик клика по вкладке
        container.querySelector('.tab__navigation').addEventListener('click', (event) => {
            const clickedTab = event.target.closest('.tab');
            if (!clickedTab) return;
            
            // Находим индекс активной вкладки
            const tabIndex = [...tabs].indexOf(clickedTab);
            
            // Обновляем активные элементы
            tabs.forEach(tab => tab.classList.remove('tab_active'));
            contents.forEach(content => content.classList.remove('tab__content_active'));
            
            clickedTab.classList.add('tab_active');
            contents[tabIndex]?.classList.add('tab__content_active');
        });
    });
});