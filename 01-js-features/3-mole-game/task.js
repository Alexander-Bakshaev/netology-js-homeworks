(() => {
    // Создаем элемент для уведомлений
    const notification = document.createElement('div');
    notification.className = 'game-notification';
    document.body.appendChild(notification);

    // Функция показа уведомления
    function showNotification(message, type) {
        notification.textContent = message;
        notification.className = `game-notification ${type}`;
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Скрываем уведомление через 2 секунды
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    }

    // Переменные для отслеживания состояния игры
    let playing = true,
        activeHole = 1,
        deadCount = 0,
        lostCount = 0;

    // Функция для получения элемента лунки по индексу
    const getHole = index => document.getElementById(`hole${index}`),
        deactivateHole = index => getHole(index).className = 'hole',
        activateHole = index => getHole(index).className = 'hole hole_has-mole';

    // Функция для обновления счетчиков на экране
    const updateScores = () => {
        document.getElementById('dead').textContent = deadCount;
        document.getElementById('lost').textContent = lostCount;
    };

    // Функция для сброса игры
    const resetGame = () => {
        deadCount = 0;
        lostCount = 0;
        updateScores();
        playing = true;
        next();
    };

    // Функция для показа следующего крота
    const next = () => {
        if (!playing) return;
        deactivateHole(activeHole);
        activeHole = Math.floor(1 + Math.random() * 9);
        activateHole(activeHole);
        setTimeout(next, 800);
    };

    // Обработчик событий для лунок
    for (let i = 1; i <= 9; i++) {
        getHole(i).onclick = function() {
            if (this.classList.contains('hole_has-mole')) {
                deadCount++;
                updateScores();

                // Проверка на победу
                if (deadCount === 10) {
                    showNotification('Победа!', 'win');
                    playing = false;
                }
            } else {
                lostCount++;
                updateScores();

                // Проверка на поражение
                if (lostCount === 5) {
                    showNotification('Вы проиграли!', 'lose');
                    playing = false;
                }
            }


            // Если игра окончена, сбрасываем. Сброс игры происходит через 1 секунду
            if (!playing) {
                setTimeout(resetGame, 1000);
            }
        };
    }


    next();
})();