// Получаем элементы DOM
const loadingElement = document.getElementById('loading');
const answersElement = document.getElementById('poll__answers');
const resultsElement = document.getElementById('poll__results');

// Функция для показа/скрытия загрузки
function setLoading(show) {
    loadingElement.style.display = show ? 'block' : 'none';
}

// Асинхронная функция для получения данных опроса
async function fetchPoll() { 
    try {
        setLoading(true);
        answersElement.style.display = 'none';
        resultsElement.innerHTML = '';
        
        const response = await fetch('https://students.netoservices.ru/nestjs-backend/poll');
        if (!response.ok) {
            throw new Error('Ошибка загрузки опроса');
        }
        
        const data = await response.json();
        displayPoll(data);
    } catch (error) { 
        console.error('Ошибка при получении опроса:', error);
        loadingElement.textContent = 'Ошибка загрузки опроса. Попробуйте обновить страницу.';
    } finally {
        setLoading(false);
    }
}

// Функция для отображения опроса на странице
function displayPoll(data) { 
    const titleElement = document.getElementById('poll__title'); 
    
    // Устанавливаем заголовок опроса
    titleElement.textContent = data.data.title; 
    answersElement.innerHTML = ''; 
    answersElement.style.display = 'block';

    // Создаем кнопки для каждого варианта ответа
    data.data.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'poll__answer'; 
        button.textContent = answer;
        button.addEventListener('click', () => submitVote(data, index));
        answersElement.appendChild(button);
    }); 
}

// Асинхронная функция для отправки голоса
async function submitVote(pollData, answerIndex) { 
    try {
        setLoading(true);
        answersElement.style.display = 'none';
        
        const response = await fetch('https://students.netoservices.ru/nestjs-backend/poll', { 
            method: 'POST', 
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}, 
            body: `vote=${pollData.id}&answer=${answerIndex}`
        });
        
        if (!response.ok) {
            throw new Error('Ошибка отправки голоса');
        }
        
        const result = await response.json();
        displayResults(result.stat);
    } catch (error) {
        console.error('Ошибка при отправке голоса:', error);
        alert('Произошла ошибка при отправке голоса. Пожалуйста, попробуйте снова.');
        answersElement.style.display = 'block';
    } finally {
        setLoading(false);
    }
} 

// Функция для отображения результатов голосования
function displayResults(statistics) {
    resultsElement.innerHTML = '';
    const totalVotes = statistics.reduce((sum, item) => sum + item.votes, 0);
    
    statistics.forEach(item => {
        const percentage = totalVotes > 0 ? ((item.votes / totalVotes) * 100).toFixed(1) : 0;
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div>${item.answer}: <strong>${percentage}%</strong> (${item.votes} голосов)</div>
            <div class="result-bar">
                <div class="result-fill" style="width: ${percentage}%"></div>
            </div>
        `;
        resultsElement.appendChild(resultItem);
    });
    
    // Добавляем кнопку для нового опроса
    const newPollBtn = document.createElement('button');
    newPollBtn.className = 'poll__answer';
    newPollBtn.textContent = 'Проголосовать снова';
    newPollBtn.style.marginTop = '20px';
    newPollBtn.addEventListener('click', fetchPoll);
    resultsElement.appendChild(newPollBtn);
    
    // Анимируем заполнение полос
    setTimeout(() => {
        document.querySelectorAll('.result-fill').forEach(fill => {
            fill.style.width = fill.style.width;
        });
    }, 100);
}

// Запускаем опрос при загрузке страницы 
fetchPoll();