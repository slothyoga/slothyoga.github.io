let timer;
let timeLeft = 120; // 2 minutes in seconds
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const message = document.getElementById('message');
const startBtn = document.getElementById('start-btn');

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
}

startBtn.addEventListener('click', startTimer);

// Detect any interaction
document.addEventListener('mousemove', () => {
    if (isRunning) {
        clearInterval(timer);
        message.classList.remove('hidden');
        resetTimer();
    }
});

document.addEventListener('keydown', () => {
    if (isRunning) {
        clearInterval(timer);
        message.classList.remove('hidden');
        resetTimer();
    }
}); 