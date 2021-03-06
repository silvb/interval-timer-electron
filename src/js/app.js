const timeDisplay = document.querySelector('.center-time');
const roundsElement = document.querySelector('.rounds');
const startButton = document.querySelector('button#start');
const pauseButton = document.querySelector('button#pause');
const resetButton = document.querySelector('button#reset');
const progressBar = document.querySelector('.progress-bar');
const timeCircle = document.querySelector('.time-circle');

startButton.onclick = startTimer;
pauseButton.onclick = pauseTimer;
resetButton.onclick = resetTimer;

window.addEventListener('keydown', event => {
    switch (event.keyCode) {
    case 32:
        event.preventDefault();
        if (timerIsRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
        break;
    case 27:
        event.preventDefault();
        resetTimer();
        break;
    default:
        // business as usual
    }
});

const timerConfig = {
    prepTime: 10,
    workTime: 20,
    restTime: 10,
    rounds: 8
};

createProgressBar();

let runningValues = Object.assign({}, timerConfig);

timeDisplay.textContent = timerConfig.prepTime;
roundsElement.textContent = `${runningValues.rounds}/${timerConfig.rounds}`;

let intervalId = 0;
let timerIsRunning = false;
let currentPhase = 'prep';

resetTimer();

Array.from(document.querySelectorAll('input')).forEach(input => {
    input.addEventListener('change', handleInputUpdate);

    switch (input.id) {
    case 'prep':
        input.value = timerConfig.prepTime;
        break;
    case 'work':
        input.value = timerConfig.workTime;
        break;
    case 'rest':
        input.value = timerConfig.restTime;
        break;
    case 'rounds':
        input.value = timerConfig.rounds;
        break;
    default:
        input.value = 0;
    }
});

// FUNCTIONS
function handleInputUpdate() {
    switch (this.id) {
    case 'prep':
        timerConfig.prepTime = parseInt(this.value, 0);
        break;
    case 'work':
        timerConfig.workTime = parseInt(this.value, 0);
        break;
    case 'rest':
        timerConfig.restTime = parseInt(this.value, 0);
        break;
    case 'rounds':
        timerConfig.rounds = parseInt(this.value, 0);
        break;
    default:
        console.error(`I don't know what to do with input ${this.id}.`);
    }

    resetTimer();
    createProgressBar();
}

function timer() {
    if (runningValues[`${currentPhase}Time`] === 0) {
        timeCircle.classList.remove(currentPhase);
        runningValues[`${currentPhase}Time`] = timerConfig[`${currentPhase}Time`];

        switch (currentPhase) {
        case 'prep':
            currentPhase = 'work';
            break;
        case 'work':
            currentPhase = 'rest';
            break;
        case 'rest':
            currentPhase = 'work';
            runningValues.rounds -= 1;
            roundsElement.textContent = `${runningValues.rounds}/${timerConfig.rounds}`;

            if (runningValues.rounds === 0) {
                clearInterval(intervalId);
                resetTimer();
            }
            break;
        default:
            console.error('Something is wrong, dude!');
            break;
        }
    }


    timeDisplay.textContent = runningValues[`${currentPhase}Time`];
    runningValues[`${currentPhase}Time`] -= 1;
    timeCircle.classList.add(currentPhase);
}

function startTimer() {
    if (!timerIsRunning) {
        intervalId = setInterval(timer, 1000);
        timerIsRunning = true;
        startButton.classList.add('hide');
        pauseButton.classList.remove('hide');
    }
}

function pauseTimer() {
    timerIsRunning = false;
    clearInterval(intervalId);
    pauseButton.classList.add('hide');
    startButton.classList.remove('hide');
}

function resetTimer() {
    pauseTimer();
    timeDisplay.textContent = timerConfig.prepTime;
    runningValues = Object.assign({}, timerConfig);
    roundsElement.textContent = `${runningValues.rounds}/${timerConfig.rounds}`;
    timeCircle.classList.remove('work');
    timeCircle.classList.remove('rest');
    timeCircle.classList.add('prep');
    currentPhase = 'prep';
}

function createProgressBar() {
    const prepElementString = `<div class="phase prep" style="flex-grow: ${timerConfig.prepTime / timerConfig.restTime}"></div>`;
    const workElementString = `<div class="phase work" style="flex-grow: ${timerConfig.workTime / timerConfig.restTime}"></div>`;
    const restElementString = '<div class="phase rest" style=""></div>';

    progressBar.innerHTML = prepElementString;
    [...Array(timerConfig.rounds)].forEach(() => {
        progressBar.innerHTML += workElementString + restElementString;
    });
}