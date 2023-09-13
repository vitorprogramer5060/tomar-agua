const dailyGoalInput = document.getElementById
("dailyGoal");
const dailyGoalOutput = document.getElementById
("dailyGoalValue");
const quantityInput = document.getElementById
("dailyQuantity");
const quantityOutput = document.getElementById
("quantityValue");

const hoursElement = document.querySelector(".countdown .hours span");
const minutesElement = document.querySelector(".countdown .minutes span");
const startButton = document.getElementById("start");
const modalContainer = document.querySelector("modalContainer");
const closeButton = document.getElementById("close");
const percentageDisplay = document.getElementById("percentage");
const goal = document.getElementById("goal");

let totalGlassesTaken = -1;
let isCounting = false;
let timer;

const TIME_AWAKE_IN_MINUTES = 960; 

dailyGoalInput.addEventListener("input",handledailyGoalInput);
quantityInput.addEventListener("input", handlequantityInput);
startButton.addEventListener("click", handleStartButtonClick);
closeButton.addEventListener("click", closeModal);

function handledailyGoalInput(){
    const goalInMilliliters = Number(dailyGoalInput.value);
    dailyGoalOutput.textContent = `${goalInMilliliters}ml`
    const goalInLiters = (goalInMilliliters / 1000).toFixed(1);
    goal.textContent = `Meta ${goalInLiters}L`;
    updateHourAndMinutesDisplay()
}

function handlequantityInput(){
    quantityOutput.textContent = `${quantityInput.value}ml`
    updateHourAndMinutesDisplay()

}
function handleStartButtonClick(){
    if(isCounting) return;

    dailyGoalInput.disable = true;
    quantityInput.disable = true;

    dailyGoalInput.classList.add("disabled-input");
    quantityInput.classList.add("disabled-input");

    startButton.textContent = "Timer go";

    isCounting = true;
    countdown()
}

function updateHourAndMinutesDisplay(){
    const {hour, minutes} = calculate()
    hoursElement.textContent = hour;
    minutesElement.textContent = minutes;
}
function countdown(){
    clearInterval(timer);
    if (!isCounting) return;

    const { canTakeWater } = calculate() 
    if (!canTakeWater) return

    let newHour = hoursElement.textContent;
    let newMinutes = Number(minutesElement.textContent) - 1;

    if (newMinutes < 0) {
        newMinutes = 59;
        newHour = Number(hoursElement.textContent) -1;
    }

    if(newHour < 0) {
        clearInterval(timer)
        isCounting = false;
        openModal();
        return
    }

    hoursElement.textContent = newHour;
    minutesElement.textContent = newMinutes;

    timer = setInterval(countdown, 60000)
}
function openModal(){
    isCounting = false;
    modalContainer.style.display = 'block';

}

function closeModal (){
    modalContainer.style.display = 'none';
    isCounting = true
    updateHourAndMinutesDisplay()
    countdown()
    updatePercentageDisplay()
}


function calculate(){
    const totalGlassesOfWater = Number(dailyGoalInput.value / quantityInput.value);
    const totalTimesInMinutes = TIME_AWAKE_IN_MINUTES / totalGlassesOfWater;
    const [hour, minutes] = [Math.floor(totalTimesInMinutes / 60), Math.floor
    (totalTimesInMinutes % 60 )]

    const percentageOfTotalGlassesTaken = Math.abs((totalGlassesTaken * 100 / totalGlassesOfWater) - 100) + "%"

    return {
        canTakeWater: totalGlassesOfWater + 1 <= totalGlassesOfWater,hour, minutes, percentageOfTotalGlassesTaken 
    }
}
function updatePercentageDisplay(){
    totalGlassesTaken++
    const { percentageOfTotalGlassesTaken } = calculate()
    percentageDisplay.textContent = percentageOfTotalGlassesTaken;
}
updateHourAndMinutesDisplay()
updatePercentageDisplay()