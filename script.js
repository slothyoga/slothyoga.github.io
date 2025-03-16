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
    'en';

function updateLanguage() {
    const lang = translations[currentLang];
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
            alert("Congratulations! You did nothing for 2 minutes.");
            resetTimer();
        }
    }, 1000);
}

function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 120;
    updateTimer();
    isRunning = false;
    startBtn.disabled = false;
    message.classList.remove('hidden');
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

    document.getElementById('lang-zh').addEventListener('click', () => {
        currentLang = 'zh';
        updateLanguage();
    });

    document.getElementById('lang-zh_HK').addEventListener('click', () => {
        currentLang = 'zh_HK';
        updateLanguage();
    });
}); 