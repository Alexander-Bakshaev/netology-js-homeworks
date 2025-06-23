document.addEventListener("DOMContentLoaded", () => {
    // Находим все элементы, которые должны иметь подсказки
    const tooltips = document.querySelectorAll(".has-tooltip");

    // Добавляем обработчик событий для каждого элемента с подсказкой
    tooltips.forEach((tooltip) => {
        tooltip.addEventListener("click", (event) => {
            event.preventDefault();

            // Проверяем, есть ли уже активная подсказка
            const activeTooltip = document.querySelector(".tooltip_active");
            if (activeTooltip && activeTooltip.dataset.tooltipFor === tooltip.getAttribute("title")) {
                activeTooltip.remove();
                return;
            }

            // Удаляем все другие активные подсказки, если они есть
            document.querySelectorAll(".tooltip_active").forEach((otherTooltip) => {
                otherTooltip.remove();
            });

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

            // Добавляем обработчик для закрытия подсказки
            function closeTooltip(e) {
                if (!tooltipElement.contains(e.target) && e.target !== tooltip) {
                    tooltipElement.remove();
                    document.removeEventListener('click', closeTooltip);
                }
            }
            
            // Небольшая задержка, чтобы не сработало сразу
            setTimeout(() => {
                document.addEventListener('click', closeTooltip);
            }, 0);
        });
    });
});