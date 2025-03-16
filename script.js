window.dataLayer = window.dataLayer || [];

let timer;
let timeLeft = 120; // 2 minutes in seconds
let isRunning = false;
let touchStartX = null;
let touchStartY = null;
const movementThreshold = 10; // Minimum movement distance to trigger reset

const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');

let currentLang = navigator.language.startsWith('zh') ?
    (navigator.language.includes('TW') || navigator.language.includes('HK') ? 'zh_HK' : 'zh') :
    navigator.language.startsWith('fr') ? 'fr' : 'en';

function updateLanguage() {
    const lang = translations[currentLang];
    document.querySelector('title').textContent = lang.title;
    document.querySelector('h1').textContent = lang.title;
    document.getElementById('instructions').innerHTML = lang.instructions
        .map(line => `<p>${line}</p>`)
        .join('');
    document.getElementById('timer').textContent = lang.timer;
    document.getElementById('message').textContent = lang.message;
    document.getElementById('start-btn').textContent = lang.startButton;
}

function startTimer() {
    if (isRunning) return;

    dataLayer.push({
        'event': 'timerStart'
    });
    isRunning = true;
    startBtn.disabled = true;
    message.classList.add('hidden');

    timer = setInterval(() => {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            isRunning = false;
            startBtn.disabled = false;

            // 使用更友好的成功提示
            const successMessage = translations[currentLang].successMessage;
            const successAlert = document.createElement('div');
            successAlert.className = 'success-alert';
            successAlert.textContent = successMessage;
            document.body.appendChild(successAlert);

            // 6秒后自动消失
            setTimeout(() => {
                successAlert.remove();
            }, 6000);

            resetTimer(false);
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function resetTimer(showMessage = true) {
    dataLayer.push({
        'event': 'timerReset'
    });
    clearInterval(timer);
    timeLeft = 120;
    updateTimer();
    isRunning = false;
    startBtn.disabled = false;
    if (showMessage) {
        message.classList.remove('hidden');
    }
}

function handleTouchStart(e) {
    const touch = e.touches[0];
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
}

function handleTouchMove(e) {
    if (!touchStartX || !touchStartY) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartX);
    const deltaY = Math.abs(touch.clientY - touchStartY);

    const isButtonTouch = e.target === startBtn || startBtn.contains(e.target);
    if ((deltaX > movementThreshold || deltaY > movementThreshold) && !isButtonTouch) {
        resetTimer();
    }
}

document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('mousemove', (e) => {
        if (isRunning && e.target !== startBtn && !startBtn.contains(e.target)) {
            resetTimer();
        }
    });

    document.addEventListener('touchmove', (e) => {
        if (isRunning) {
            handleTouchMove(e);
        }
    });

    document.addEventListener('touchstart', handleTouchStart);
    startBtn.addEventListener('click', startTimer);

    updateLanguage();

    document.getElementById('lang-en').addEventListener('click', () => {
        currentLang = 'en';
        updateLanguage();
    });

    document.getElementById('lang-fr').addEventListener('click', () => {
        currentLang = 'fr';
        updateLanguage();
    });

    document.getElementById('lang-zh').addEventListener('click', () => {
        currentLang = 'zh';
        updateLanguage();
    });

    document.getElementById('lang-zh_HK').addEventListener('click', () => {
        currentLang = 'zh_HK';
        updateLanguage();
    });
}); 