// Grab Displays
const timeBox = document.querySelector('.time-box');
const timeCircle = document.querySelector('circle.progress');
const timeDisplay = document.querySelector('.center-time');
const roundsCounter = document.querySelector('.rounds');
const progressBar = document.querySelector('.progress-bar');


// Grab Controls
const startButton = document.querySelector('button#start');
const pauseButton = document.querySelector('button#pause');
const resetButton = document.querySelector('button#reset');

startButton.onclick = startTimer;
pauseButton.onclick = pauseTimer;
resetButton.onclick = resetTimer;


// Timer actions
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
    roundsCounter.textContent = `${runningValues.rounds}/${timerConfig.rounds}`;
    timeBox.classList.remove('work');
    timeBox.classList.remove('rest');
    timeBox.classList.add('prep');
    currentPhase = 'prep';
}


// Event Listeners
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

timeCircle.addEventListener('animationend', event => {
    console.log('animationend');
    const seconds = event.elapsedTime;
    // timeCircle.classList.remove(`animate-${seconds}`);
});

timeCircle.addEventListener('animationstart', event => {
    console.log('animationstart');
    Array.from(event.target.classList).forEach(className => {
        console.log(className);
    });
});


// Init
const timerConfig = {
    prepTime: 2,
    workTime: 4,
    restTime: 2,
    rounds: 8
};

createProgressBar();

let runningValues = Object.assign({}, timerConfig);

timeDisplay.textContent = timerConfig.prepTime;
roundsCounter.textContent = `${runningValues.rounds}/${timerConfig.rounds}`;

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


// Functions
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
        timeBox.classList.remove(currentPhase);
        const seconds = timerConfig[`${currentPhase}Time`];
        timeCircle.classList.remove(`animate-${seconds}`);
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
            roundsCounter.textContent = `${runningValues.rounds}/${timerConfig.rounds}`;

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

    if (runningValues[`${currentPhase}Time`] === timerConfig[`${currentPhase}Time`]) {
        const seconds = timerConfig[`${currentPhase}Time`];
        timeCircle.classList.add(`animate-${seconds}`);
    }

    timeDisplay.textContent = runningValues[`${currentPhase}Time`];
    runningValues[`${currentPhase}Time`] -= 1;
    timeBox.classList.add(currentPhase);
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