'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Grab Displays
var timeBox = document.querySelector('.time-box');
var timeCircle = document.querySelector('circle.progress');
var timeDisplay = document.querySelector('.center-time');
var roundsCounter = document.querySelector('.rounds');
var progressBar = document.querySelector('.progress-bar');

// Grab Controls
var startButton = document.querySelector('button#start');
var pauseButton = document.querySelector('button#pause');
var resetButton = document.querySelector('button#reset');

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
    roundsCounter.textContent = runningValues.rounds + '/' + timerConfig.rounds;
    timeBox.classList.remove('work');
    timeBox.classList.remove('rest');
    timeBox.classList.add('prep');
    currentPhase = 'prep';
}

// Event Listeners
window.addEventListener('keydown', function (event) {
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

timeCircle.addEventListener('animationend', function (event) {
    console.log('animationend');
    var seconds = event.elapsedTime;
    // timeCircle.classList.remove(`animate-${seconds}`);
});

timeCircle.addEventListener('animationstart', function (event) {
    console.log('animationstart');
    Array.from(event.target.classList).forEach(function (className) {
        console.log(className);
    });
});

// Init
var timerConfig = {
    prepTime: 2,
    workTime: 4,
    restTime: 2,
    rounds: 8
};

createProgressBar();

var runningValues = Object.assign({}, timerConfig);

timeDisplay.textContent = timerConfig.prepTime;
roundsCounter.textContent = runningValues.rounds + '/' + timerConfig.rounds;

var intervalId = 0;
var timerIsRunning = false;
var currentPhase = 'prep';

resetTimer();

Array.from(document.querySelectorAll('input')).forEach(function (input) {
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
            console.error('I don\'t know what to do with input ' + this.id + '.');
    }

    resetTimer();
    createProgressBar();
}

function timer() {
    if (runningValues[currentPhase + 'Time'] === 0) {
        timeBox.classList.remove(currentPhase);
        var seconds = timerConfig[currentPhase + 'Time'];
        timeCircle.classList.remove('animate-' + seconds);
        runningValues[currentPhase + 'Time'] = timerConfig[currentPhase + 'Time'];

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
                roundsCounter.textContent = runningValues.rounds + '/' + timerConfig.rounds;

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

    if (runningValues[currentPhase + 'Time'] === timerConfig[currentPhase + 'Time']) {
        var _seconds = timerConfig[currentPhase + 'Time'];
        timeCircle.classList.add('animate-' + _seconds);
    }

    timeDisplay.textContent = runningValues[currentPhase + 'Time'];
    runningValues[currentPhase + 'Time'] -= 1;
    timeBox.classList.add(currentPhase);
}

function createProgressBar() {
    var prepElementString = '<div class="phase prep" style="flex-grow: ' + timerConfig.prepTime / timerConfig.restTime + '"></div>';
    var workElementString = '<div class="phase work" style="flex-grow: ' + timerConfig.workTime / timerConfig.restTime + '"></div>';
    var restElementString = '<div class="phase rest" style=""></div>';

    progressBar.innerHTML = prepElementString;
    [].concat(_toConsumableArray(Array(timerConfig.rounds))).forEach(function () {
        progressBar.innerHTML += workElementString + restElementString;
    });
}
