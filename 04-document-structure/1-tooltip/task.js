document.addEventListener("DOMContentLoaded", () => {
    let activeTooltip = null;
    
    // Функция для закрытия активной подсказки
    function closeActiveTooltip() {
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
            // Удаляем обработчики событий
            document.removeEventListener('click', handleDocumentClick);
            window.removeEventListener('scroll', handleScroll);
        }
    }
    
    // Обработчик клика по документу
    function handleDocumentClick(e) {
        if (activeTooltip && !activeTooltip.contains(e.target) && 
            !e.target.classList.contains("has-tooltip")) {
            closeActiveTooltip();
        }
    }
    
    // Обработчик скролла
    function handleScroll() {
        closeActiveTooltip();
    }
    
    // Находим все элементы, которые должны иметь подсказки
    const tooltips = document.querySelectorAll(".has-tooltip");

    // Добавляем обработчик событий для каждого элемента с подсказкой
    tooltips.forEach((tooltip) => {
        tooltip.addEventListener("click", (event) => {
            event.preventDefault();

            // Закрываем текущую подсказку, если кликаем по тому же элементу
            if (activeTooltip && activeTooltip.dataset.tooltipFor === tooltip.getAttribute("title")) {
                closeActiveTooltip();
                return;
            }
            
            // Закрываем предыдущую подсказку, если она есть
            closeActiveTooltip();

             // Получаем текст подсказки из атрибута title
            const tooltipText = tooltip.getAttribute("title");

            // Создаем новый элемент для отображения подсказки
            const tooltipElement = document.createElement("div");
            tooltipElement.className = "tooltip";
            tooltipElement.textContent = tooltipText;
            tooltipElement.dataset.tooltipFor = tooltipText;

            // Определяем позицию подсказки (по умолчанию позиция будет "bottom")
            const position = tooltip.getAttribute("data-position") || "bottom";
            document.body.appendChild(tooltipElement);
            
            // Принудительный рефлоу перед добавлением класса анимации
            void tooltipElement.offsetWidth;
            tooltipElement.classList.add('tooltip_active');

            // Получаем координаты элемента, к которому привязана подсказка
            const coords = tooltip.getBoundingClientRect();
            let left = coords.left;
            let top = coords.top;

            // Рассчитываем позицию подсказки относительно элемента в зависимости от значения position
            switch (position) {
                case "top":
                    left = coords.left;
                    top = coords.top - tooltipElement.offsetHeight;
                    break;
                case "left":
                    left = coords.left - tooltipElement.offsetWidth;
                    top = coords.top;
                    break;
                case "right":
                    left = coords.right;
                    top = coords.top;
                    break;
                case "bottom":
                default:
                    left = coords.left;
                    top = coords.bottom;
                    break;
            }

            // Устанавливаем рассчитанные координаты подсказки
            tooltipElement.style.left = `${left}px`;
            tooltipElement.style.top = `${top}px`;

            // Сохраняем ссылку на активную подсказку
            activeTooltip = tooltipElement;
            
            // Добавляем обработчики событий
            setTimeout(() => {
                document.addEventListener('click', handleDocumentClick);
                window.addEventListener('scroll', handleScroll, { passive: true });
            }, 0);
        });
    });
});