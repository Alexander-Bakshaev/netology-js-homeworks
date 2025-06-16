// Функция для определения языка символа
function getCharLanguage(char) {
    // Проверяем, является ли символ кириллицей
    if (/^[а-яёА-ЯЁ]+$/.test(char)) {
        return 'ru';
    }
    // Проверяем, является ли символ латиницей
    if (/^[a-zA-Z]+$/.test(char)) {
        return 'en';
    }
    // Для остальных символов (цифры, спецсимволы)
    return 'other';
}

class Game {
    constructor(container) {
        this.container = container;
        this.wordElement = container.querySelector('.word');
        this.winsElement = container.querySelector('.status__wins');
        this.lossElement = container.querySelector('.status__loss');
        this.timerElement = container.querySelector('.timer');
        this.timer = null;
        this.timeLeft = 0;
        this.animationFrame = null;

        this.reset();
        this.registerEvents();
    }

    showMessage(text, type = 'success') {
        const message = document.getElementById('message');
        message.textContent = text;
        message.className = `message ${type} show`;
        
        // Скрываем сообщение через 2 секунды
        setTimeout(() => {
            message.classList.remove('show');
        }, 2000);
    }

    reset() {
        this.setNewWord();
        this.winsElement.textContent = 0;
        this.lossElement.textContent = 0;
        this.startTimer();
    }

    registerEvents() {
        document.addEventListener('keydown', (event) => {
            // Пропускаем служебные клавиши
            if (this.isLayoutSwitchKey(event)) {
                return;
            }

            const inputChar = event.key;
            const currentSymbol = this.currentSymbol.textContent;
            
            // Получаем языки для текущего и введённого символов
            const currentLang = getCharLanguage(currentSymbol);
            const inputLang = getCharLanguage(inputChar);
            
            // Проверяем совпадение символов с учётом языка и регистра
            if (this.isMatchingCharacter(inputChar, currentSymbol, currentLang, inputLang)) {
                this.success();
            } else {
                this.fail();
            }
        });
    }

    isLayoutSwitchKey(event) {
        const layoutSwitchKeys = [
            'Control', 'Shift', 'Alt', 'CapsLock', 
            'Meta', 'Tab', 'Escape', 'Enter', 'Option'
        ];
        return layoutSwitchKeys.includes(event.key) || 
               event.ctrlKey || 
               event.altKey || 
               event.metaKey;
    }

    isMatchingCharacter(inputChar, currentSymbol, currentLang, inputLang) {
        // Если языки разные и это не специальные символы, они не совпадают
        if (currentLang !== 'other' && inputLang !== 'other' && 
            currentLang !== inputLang) {
            return false;
        }
        
        // Сравниваем символы без учёта регистра
        return inputChar.toLowerCase() === currentSymbol.toLowerCase();
    }

    success() {
        this.currentSymbol.classList.remove('symbol_current');
        this.currentSymbol.classList.add('symbol_correct');
        this.currentSymbol = this.currentSymbol.nextElementSibling;

        if (this.currentSymbol) {
            this.currentSymbol.classList.add('symbol_current');
        } else {
            if (++this.winsElement.textContent === 10) {
                this.showMessage('🎉 Победа!', 'success');
                this.reset();
            } else {
                this.setNewWord();
            }
        }
    }

    fail() {
        // Визуальная обратная связь при неправильном вводе
        this.wordElement.classList.add('word_incorrect');
        
        // Удаляем класс после завершения анимации
        setTimeout(() => {
            this.wordElement.classList.remove('word_incorrect');
            
            // Обновляем счётчик проигрышей и проверяем конец игры
            if (++this.lossElement.textContent === 5) {
                this.showMessage('😢 Вы проиграли!', 'error');
                this.reset();
            } else {
                this.setNewWord();
            }
        }, 300);
    }

    setNewWord() {
        const word = this.getWord();
        this.renderWord(word);
        this.startTimer();
    }

    getWord() {
        const words = [
            // Русские слова
            'кот', 'дом', 'мама', 'папа', 'солнце', 'луна', 'звезда',
            'вода', 'огонь', 'земля', 'ветер', 'яблоко', 'банан', 'груша',
            'апельсин', 'книга', 'стол', 'стул', 'окно', 'дверь', 'стена',
            'пол', 'потолок', 'программирование', 'друзья', 'любовь', 'счастье',
            
            // Английские слова
            'cat', 'dog', 'house', 'apple', 'banana', 'orange', 'sun', 'moon',
            'star', 'water', 'fire', 'earth', 'wind', 'book', 'table', 'chair',
            'window', 'door', 'wall', 'floor', 'ceiling', 'programming', 'friends',
            'love', 'happiness',
            
            // Смешанные фразы
            'я люблю kitkat', 'мой email@example.com', 'пароль: 12345',
            'hello мир', 'привет world', 'кот cat', 'собака dog',
            'Программирование - это искусство',
            'JavaScript is awesome!'
        ];
        
        const index = Math.floor(Math.random() * words.length);
        return words[index];
    }

    renderWord(word) {
        if (!word || word.length === 0) {
            console.error('Передано пустое слово');
            return;
        }
        
        const html = [...word]
            .map((char, i) => {
                const lang = getCharLanguage(char);
                return `<span 
                    class="symbol ${i === 0 ? 'symbol_current' : ''}" 
                    data-lang="${lang}"
                >${char}</span>`;
            })
            .join('');
        
        this.wordElement.innerHTML = html;
        this.currentSymbol = this.wordElement.querySelector('.symbol_current');
        this.timeLeft = word.length * 1000; // Конвертируем в миллисекунды
        this.updateTimer();
    }

    startTimer() {
        // Отменяем существующий кадр анимации
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        // Очищаем существующий интервал
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        const startTime = Date.now();
        const duration = this.timeLeft;
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            this.timeLeft = Math.max(0, duration - elapsed);
            
            this.updateTimer();
            
            if (this.timeLeft > 0) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.fail();
            }
        };
        
        // Запускаем анимацию
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    updateTimer() {
        // Отображаем время с одним десятичным знаком
        this.timerElement.textContent = (this.timeLeft / 1000).toFixed(1);
        
        // Добавляем визуальную индикацию при заканчивающемся времени
        if (this.timeLeft < 3000) { // Меньше 3 секунд
            this.timerElement.classList.add('timer-warning');
        } else {
            this.timerElement.classList.remove('timer-warning');
        }
    }
}


new Game(document.getElementById('game'));