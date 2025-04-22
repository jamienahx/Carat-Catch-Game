const gameArea = document.getElementById("gameArea");
const catcher = document.getElementById("catcher");
const stopButton = document.getElementById("stopButton");
const scoreDisplay = document.getElementById("score");
let score = 0;
let winningScore = 0;
let gameOver = false;

// Variables for the timer
const timerDisplay = document.getElementById("timer");
let timer;
let timeLeft = 10;  

//Variables for number generator
let generatedNumber;
let randomNumberInterval;


let itemCreationInterval;





//random number generator that generates a number every 100ms
randomNumberInterval = setInterval(function generateNumber() {
    generatedNumber = Math.floor(Math.random()*50)+1;
    randomNumberArea.textContent=generatedNumber;
}, 100);

//add code to the button to stop the number generator
stopButton.addEventListener("click", function() {
    clearInterval(randomNumberInterval); // Stop the random number generator
    stopButton.disabled = true;

    winningScore = 1;

    setTimeout(function() {
        startTimer(); // Start the countdown after a delay

        itemCreationInterval = setInterval(function() {
            createItem();
        }, 1000);

    }, 300); // Delay of 1 second (1000 milliseconds)
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

let catcherPosition = 150;
catcher.style.left = catcherPosition + "px"; //set the initial position where the catcher's left edge is 150px from the left edge of the container


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

//this createItem function is running every 1000ms defined in the setInterval Item creation

function createItem() {
    // Randomly select an item type from the array
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];


    //create a div to make the items appear on the bbrowser
   const item = document.createElement("div");
    item.classList.add("item");
    item.textContent = itemType.emoji;

    // Position item randomly at the top of the screen
   let randomX = Math.random() * (gameArea.offsetWidth - 30);  //replace 30 with the actual width later on
    item.style.left = randomX + "px";
    item.style.top = "0px";
    gameArea.appendChild(item);

//the item has beeen created and spawned. Now every 20ms, the items undergo 1) changing position by 5px and 2) collision checking

  let itemFall = setInterval(function() {
        let itemTop = parseInt(item.style.top);


        //keep falling and when the top of the item has exceeded the game area then clear if off the screen

        if (itemTop > gameArea.offsetHeight) { //if the top of item has exceeded the height of the game area
            clearInterval(itemFall);
            gameArea.removeChild(item);
        } else {
            item.style.top = itemTop + 5 + "px";  //otherwise increase the pixels by 5px. so it moves 5px downlowads. 
        }

        const itemHeight = 30; 

        let itemLeft = parseInt(item.style.left);
        if (

            
            itemTop + itemHeight >= gameArea.offsetHeight - catcher.offsetHeight &&
            itemLeft >= catcherPosition &&   
            itemLeft <= catcherPosition + catcher.offsetWidth

    
        ) {
            clearInterval(itemFall);
            gameArea.removeChild(item);
            updateScore(itemType);
         
        }
    }, 20);
}


/*function to clear the screen. mechanism of the game is that a new item spawns every 1s. 
and on every 1s iteration, all the functions under createItem are taking place including item fall and check collision.
in the gameover condition, it only stops a new item from being created. this function is used to clear all the items that were falling from previous iterations*/


function clearItems() {

    document.querySelectorAll(".item").forEach(item => item.remove());
}



//function to update score
function updateScore(itemType) {
score += itemType.points;
 scoreDisplay.textContent = score;
 if(score===winningScore && !gameOver) {
    const gameOverMessage = document.createElement("div");
    gameOverMessage.classList.add("game-over-message");
    gameOverMessage.textContent = "You win!";
   

    const restartButton = document.createElement("div");
    restartButton.classList.add("restartButton");
    restartButton.textContent = "Restart";
    gameOverMessage.appendChild(restartButton);
    document.body.appendChild(gameOverMessage);

    clearInterval(itemCreationInterval);
    clearInterval(timer);
    clearItems();
    gameOver = true;
    
    } 
     
}






function startTimer() {
    timer = setInterval(function() {
        timerDisplay.textContent = timeLeft;
        timeLeft--;
        

        if (timeLeft <= 0 && !gameOver) {
            clearInterval(timer);
            clearInterval(itemCreationInterval);
            clearItems();

            const gameOverMessage = document.createElement("div");
            gameOverMessage.classList.add("game-over-message");
            gameOverMessage.textContent = "You lose!";

           

            const restartButton = document.createElement("div");
            restartButton.classList.add("restartButton");
            restartButton.textContent = "Restart";
            gameOverMessage.appendChild(restartButton);
            document.body.appendChild(gameOverMessage);
            

            stopButton.disabled = true;
            gameOver = true;
             
            
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