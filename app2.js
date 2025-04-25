/*-------------------------------- Constants --------------------------------*/
const gameArea = document.getElementById("gameArea");
const catcher = document.getElementById("catcher");
const stopButton = document.getElementById("stopButton");
const scoreDisplay = document.getElementById("score");
const randomNumberArea = document.getElementById("randomNumberArea");
const timerDisplay = document.getElementById("timer");
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

/*---------------------------- Variables (state) ----------------------------*/
let score = 0;
let winningScore = 0;
let gameOver = false;
let gameOverMessage;
let catcherPosition = 150;
let timer;
let timeLeft = 60;  
let generatedNumber;
let randomNumberInterval;
let itemCreationInterval;

/*------------------------ Cached Element References ------------------------*/



/*-------------------------------- Functions --------------------------------*/

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

//set the initial position where the catcher's left edge is 150px from the left edge of the container

catcher.style.left = catcherPosition + "px"; 


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


//createItem and put all the item's activities inside requestAnimationFrame

function createItem() {

//first select the item from the array. create a variable for the item then randomly select it from the an index of the array
let itemType = itemTypes[Math.floor(Math.random()*itemTypes.length)];

//create a div to  store the image element

let item = document.createElement("div");
item.classList.add("item");
item.textContent = itemType.emoji;

//spawn the item at some random location at the top of the game area


//Define the initial numerical coordinates of the item
//define some random number first, ensuring that it falls within the gameArea. Deduct away the item width currently hardcoded as 30 to ensure space for item
let randomX = Math.random()*(gameArea.offsetWidth-30); //this is the width. it is at some random position
let itemTop = 0; //make sure the item is positioned at the top. 

//assign these numerical values to pixes
item.style.left = randomX + "px" ; //styleLeft means distance from the left of the item to the left edge of the gameArea
item.style.top = itemTop+ "px";  //styleTop means distance from the top of the item to the top of the gameArea

const itemHeight = 30; //subject to change

gameArea.appendChild(item);  //make it appear on the screen

//animate the items

function animateItem() {

    itemTop +=5; //the item "changes" its position by +5
    item.style.top = itemTop +"px"; //assign this +5 into item.tyle.top, ensuring the distance between the top of the item and top of gameArea is increasing by 5px
    
    const itemLeft = parseInt(item.style.left);
    
    const catcherTop = gameArea.offsetHeight-catcher.offsetHeight;  //posn of top of catcher = game area - height of catcher 


    //collision criteria: 
    // top of catcher at least touches bottom of item = catcherTop <= itemTop+itemHeight
    //left edge of item must be left of right edge of catcher
    //left edge of item must be right of left edge of catcher
   const collided =  (catcherTop <= itemTop + itemHeight &&  itemLeft >= catcherPosition &&   
   itemLeft <= catcherPosition + catcher.offsetWidth);

   if (collided){
    item.remove();
    updateScore(itemType);
    return;
   }

   if (itemTop > gameArea.offsetHeight) {
    item.remove();
    return;
   }
   requestAnimationFrame(animateItem);

    }

requestAnimationFrame(animateItem);
}

//function to clear all falling items on screen once game over
function clearItems() {

    document.querySelectorAll(".item").forEach(item => item.remove());
}

//start the timer countdown
function startTimer() {
    timer = setInterval(function() {
        timerDisplay.textContent = timeLeft;
        timeLeft--;
        

        if (timeLeft <= 0 && !gameOver) {
            clearInterval(timer);
            clearInterval(itemCreationInterval);
            clearItems();

            gameOverMessage = document.createElement("div");
            gameOverMessage.classList.add("game-over-message");
            gameOverMessage.textContent = "You lose!";

           

            const restartButton = document.createElement("div");
            restartButton.classList.add("restartButton");
            restartButton.addEventListener("click",resetGame);
            restartButton.textContent = "Restart";
            gameOverMessage.appendChild(restartButton);
            document.body.appendChild(gameOverMessage);
            

            stopButton.disabled = true;
            gameOver = true;
             
            
        }
    }, 1000);
}



//function to update score
function updateScore(itemType) {
    score += itemType.points;
     scoreDisplay.textContent = score;
     if(score===winningScore && !gameOver) {
        gameOverMessage = document.createElement("div");
        gameOverMessage.classList.add("game-over-message");
        gameOverMessage.textContent = "You win!";
       
    
        const restartButton = document.createElement("div");
        restartButton.classList.add("restartButton");
        restartButton.addEventListener("click",resetGame);
        restartButton.textContent = "Restart";
        gameOverMessage.appendChild(restartButton);
        document.body.appendChild(gameOverMessage);
    
        clearInterval(itemCreationInterval);
        clearInterval(timer);
        clearItems();
        gameOver = true;
        
        } 
         
    }


    //function to reset game
    function resetGame() {
        //remove game over nessage
        document.body.removeChild(gameOverMessage);
    
        //clear intervals
        clearInterval(itemCreationInterval);
        clearInterval(timer);
    
        //re-enable stop button
        stopButton.disabled = false;
    
        //clear everything from screen 
        clearItems();
    
        //reset variables
        score = 0;
        winningScore = 0;
        gameOver = false;
        timeLeft = 60;
    
    
        //reset UI
    
         timerDisplay.textContent = timeLeft;
        scoreDisplay.textContent = score;
    
        //reset catcher position
       catcherPosition = 150;
       catcher.style.left = catcherPosition + "px"; 
    
    
    //reatsrt the number generator 
    randomNumberInterval = setInterval(function generateNumber() {
        generatedNumber = Math.floor(Math.random()*50)+1;
        randomNumberArea.textContent=generatedNumber;
    }, 100);
    
    }
    
    