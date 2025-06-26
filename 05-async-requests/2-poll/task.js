// Асинхронная функция для получения данных опроса
async function fetchPoll() { 
    try {
        // Выполняем запрос к API для получения данных. Преобразуем ответ в JSON
        const response = await fetch('https://students.netoservices.ru/nestjs-backend/poll'); 
        const data = await response.json(); 
        displayPoll(data); 
    } catch (error) { 
        // Обрабатываем ошибки, если запрос не удался
        console.error('Ошибка при получении опроса:', error); 
    }
} 

// Функция для отображения опроса на странице
function displayPoll(data) { 
    // Получаем элементы заголовка и ответов из DOM
    const titleElement = document.getElementById('poll__title'); 
    const answersElement = document.getElementById('poll__answers'); 
 
    // Устанавливаем заголовок опроса. Очищаем предыдущие ответы
    titleElement.textContent = data.data.title; 
    answersElement.innerHTML = ''; 

    // Создаем кнопки для каждого варианта ответа
    data.data.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'poll__answer'; 
        button.textContent = answer;

         // Добавляем обработчик события (отправка ответа при нажатии на кнопку)
        button.addEventListener('click', () => submitVote(data.id, index));

        // Добавляем кнопку в элемент ответов
        answersElement.appendChild(button); 
    }); 
} 

// Асинхронная функция для отправки голоса
async function submitVote(voteId, answerIndex) { 
    // Выполняем POST-запрос для отправки голоса
    const response = await fetch('https://students.netoservices.ru/nestjs-backend/poll', { 
        method: 'POST', 
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
        body: `vote=${voteId}&answer=${answerIndex}` 
    }); 
 
    // Выводим результат голосования в формате JSON
    const result = await response.json();

    // Отображаем результаты голосования. Показываем сообщение пользователю
    displayResults(result.stat); 
    alert('Спасибо, ваш голос засчитан!');
} 

// Функция для отображения результатов голосования 
function displayResults(stat) {
    // Получаем элемент ответов из DOM. Очищаем предыдущие ответы 
    const answersElement = document.getElementById('poll__answers'); 
    answersElement.innerHTML = '';
 
    // Считаем общее количество голосов 
    const totalVotes = stat.reduce((total, answerStat) => total + answerStat.votes, 0); 
 
    // Отображаем процент голосов для каждого варианта ответа
    stat.forEach(answerStat => { 
        const percentage = totalVotes > 0 ? ((answerStat.votes / totalVotes) * 100).toFixed(2) : 0; 
        const resultDiv = document.createElement('div');
        resultDiv.innerHTML = `${answerStat.answer}: <strong>${percentage}%</strong>`;
        answersElement.appendChild(resultDiv); 
    });
} 

// Запускаем опрос при загрузке страницы 
fetchPoll();