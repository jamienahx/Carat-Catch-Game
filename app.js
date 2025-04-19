var gameArea = document.getElementById("gameArea");
var catcher = document.getElementById("catcher");
var stopButton = document.getElementById("stopButton");

// Variables for the timer
var timerDisplay = document.getElementById("timer");
var timer;
var timeLeft = 60;  


//random number generator
randomNumberInterval = setInterval(function generateNumber() {
    generatedNumber = Math.floor(Math.random()*100)+1;
    randomNumberArea.textContent=generatedNumber;
}, 100);

//add code to the button to stop the number generator
stopButton.addEventListener("click", function() {
    clearInterval(randomNumberInterval); // Stop the random number generator
    stopButton.disabled = true;

    setTimeout(function() {
        startTimer(); // Start the countdown after a delay
    }, 1000); // Delay of 1 second (1000 milliseconds)
});




const itemTypes = [
    {
        name: "clover",
        emoji: "🍀",
        isGood: true,
        points: 1
    },
    {
        name: "skull",
        emoji: "💀",
        isGood: false,
        points: -1
    }
];

//Set the catcher's initial position

var catcherPosition = 150;
catcher.style.left = catcherPosition + "px";

//moving catcher with arrow keys

// Move the catcher with arrow keys
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft" && catcherPosition > 0) {
        catcherPosition -= 20;
    }
    if (event.key === "ArrowRight" && catcherPosition < gameArea.offsetWidth - catcher.offsetWidth) {
        catcherPosition += 20;
    }
    catcher.style.left = catcherPosition + "px";
});

// Function to create falling items
function createItem() {
    // Randomly select an item type from the array
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

    //create a div to make the items appear on the bbrowser
    var item = document.createElement("div");
    item.classList.add("item");
    item.textContent = itemType.emoji;

    // Position item randomly at the top of the screen
    var randomX = Math.random() * (gameArea.offsetWidth - 30);
    item.style.left = randomX + "px";
    item.style.top = "0px";
    gameArea.appendChild(item);

}


// Create random items at random intervals
var itemCreationInterval = setInterval(function() {
    createItem();
}, 1000);


function startTimer() {
    console.log("Timer started!"); // For debugging
    timer = setInterval(function() {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = timeLeft + "s"; // Update the displayed timer
        } else {
            clearInterval(timer);
            alert("Time's up!"); // alert when time is up
        }
    }, 1000);
}





//some function to create the catcher and move it with keyboard

//timer


// set which items to catch, look into changes in items to catch 

//Check collision 
//top of catcher touches bottom of item
//left of item is before right edge of catcher
//right of  item is before left edge of a catcher