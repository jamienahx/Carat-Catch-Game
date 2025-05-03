/*-------------------------------- Constants --------------------------------*/
const gameArea = document.getElementById("gameArea");
const catcher = document.getElementById("catcher");
const stopButton = document.getElementById("stopButton");
const scoreDisplay = document.getElementById("score");
const randomNumberArea = document.getElementById("randomNumberArea");
const timerDisplay = document.getElementById("timer");
const itemTypes = [
    {
        name: "cbv2",
        isGood: true,
        points: 1,
        image: "images/svt.png"
    },
    {
        name: "other",
        isGood: false,
        points: -1,
        images : ["images/skz.png","images/nct.png","images/txt.png"]
    },

    {
        name: "special", 
        isGood: true,
        points: 5, 
        image: "images/diamond.png" 
    }
];

const instructionOverlay = document.getElementById("instructionOverlay");
const startGameButton = document.getElementById("startGameButton");

startGameButton.addEventListener("click", function () {
  instructionOverlay.classList.add("slide-up");
});

const memberPics = ["images/1.jpg", 
                    "images/2.jpg", 
                    "images/3.jpg",
                    "images/4.jpg",
                    "images/5.jpg",
                    "images/6.jpg",
                    "images/7.jpg",
                    "images/8.jpg",
                    "images/9.jpg",
                    "images/10.jpg",
                    "images/11.jpg",
                    "images/12.jpg",
                    "images/13.jpg"]


/*---------------------------- Variables (state) ----------------------------*/
let score = 0;
let winningScore = 0;
let gameOver = false;
let gameOverMessage;
let catcherPosition = 190;
let timer;
let timeLeft = 45; 
let generatedNumber;
let randomNumberInterval;
let itemCreationInterval;
let fallSpeed = 6
let currentLevel = 1;
let levelComplete = false;




/*-------------------------------- Functions --------------------------------*/

//random number generator that generates a number every 100ms
randomNumberInterval = setInterval(function generateNumber() {
    generatedNumber = Math.floor(Math.random()*30)+1;
    randomNumberArea.textContent=generatedNumber;
}, 100);

//add code to the button to stop the number generator
stopButton.addEventListener("click", function() {
    clearInterval(randomNumberInterval); // Stop the random number generator
    stopButton.disabled = true;

    winningScore = generatedNumber;

    setTimeout(function() {
        startTimer(); // Start the countdown after a delay

        itemCreationInterval = setInterval(function() {
            createItem();
        }, 600);

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

//1- Select a random item from the array. 
//2 - Create a div /object for it to have it appear and positioned in the game area have it be checked for collisions etc
//2a - do some CSS to it 
//3 - Create the image to have an image representation of the div
//3a - do some CSS to it
//4 - if the itemtype selected is 'good' then display CBV2, if not then go to the bad items array and choose a random item for it

//first select the item from the array. create a variable for the item then randomly select it from the an index of the array

let itemType;

if(currentLevel === 2){
    itemType = itemTypes[Math.floor(Math.random()*itemTypes.length)];
    } else {
    itemType = itemTypes.filter(item=>item.name !== "special")[Math.floor(Math.random()*itemTypes.length)];
}

//create a div element to  store the image element

let item = document.createElement("div");
item.classList.add("item");

let img = document.createElement("img"); //create an img element 
img.alt = itemType.name; 
img.classList.add("item-image"); //add a css class to the image

if(itemType.isGood) {
    img.src = itemType.image;  //if item is good, then the image becomes cbv2
} else {

    let randomIndex = Math.floor(Math.random()* itemType.images.length);  //otherwise it picks from a random index from the images array created for the "bad" items.
    img.src = itemType.images[randomIndex];

}

item.appendChild(img);


//spawn the item at some random location at the top of the game area
//Define the initial numerical coordinates of the item
//define some random number first, ensuring that it falls within the gameArea. Deduct away the item width defined in the css as 40
let randomX = Math.random()*(gameArea.offsetWidth-40); //this is the width. it is at some random position. 
let itemTop = 0; //make sure the item is positioned at the top. 

//assign these numerical values to pixes
item.style.left = randomX + "px" ; //styleLeft means distance from the left of the item to the left edge of the gameArea
item.style.top = itemTop+ "px";  //styleTop means distance from the top of the item to the top of the gameArea

gameArea.appendChild(item);  //make it appear on the screen

//animate the items

function animateItem() {

    itemTop += fallSpeed; //the item "changes" its position by +5
    item.style.top = itemTop +"px"; //assign this +5 into item.tyle.top, ensuring the distance between the top of the item and top of gameArea is increasing by 5px
    
    const itemBound = item.getBoundingClientRect();
    const catcherBound = catcher.getBoundingClientRect();


//NOT collision 
//a) item fully above catcher -> item.bottom < catcher.top
//b) item fully below catcher -> item.top > catcher.bottom
//c) item fully left of catcher -> item.left > catcher.right
//d) item fully right of catcher -> item right < catcher left
//therefore the complement of all these means collided.

   const collided = !( itemBound.bottom <catcherBound.top || itemBound.top > catcherBound.bottom || itemBound.left >catcherBound.right || itemBound.right <catcherBound.left);

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
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        

        if (timeLeft <= 0 && !gameOver) {
            clearInterval(timer);
            clearInterval(itemCreationInterval);
            clearItems();

            catcher.style.display = "none";

            //this is the black overlay that covers the screen between levels. 
            gameOverMessage = document.createElement("div");
            gameOverMessage.classList.add("game-over-message");


            // Create the image element for the "losing" image
            const loseImage = document.createElement("img");
            loseImage.src = "images/sadbongbongee.png";  // Replace with the path to your image
            loseImage.alt = "Sad Bongbongee";        // Alt text for the image
            loseImage.classList.add("lose-image");

            gameOverMessage.appendChild(loseImage);

            const messageText = document.createElement("div");
            messageText.textContent = "Don't Wanna Cry...but you lost";
            messageText.style.marginBottom = "20px"; //some space between text & button

            const restartButton = document.createElement("div");
            restartButton.classList.add("restartButton");
            restartButton.addEventListener("click",resetGame);
            restartButton.textContent = "Restart";

            gameOverMessage.appendChild(messageText);
            gameOverMessage.appendChild(restartButton);
            document.body.appendChild(gameOverMessage);
            

            stopButton.disabled = true;
            gameOver = true;
             
            
        }
    }, 1000);
}



//function to update score
function updateScore(itemType) {
    if (levelComplete) return; //if winning score is met, stop updating the score
    score += itemType.points;
     scoreDisplay.textContent = "Your score "+ score;
     if(score===winningScore && currentLevel===1) {
        
        showLevel2Instructions();
        currentLevel = 2; // Update level after reaching the winning score
        return;
        
        } 

        if (currentLevel === 2 && score === winningScore) {
            levelComplete = true; //level is completed after winning score is met
            endGame("CHEERS to making it to Sebong's 2024 events! Here is a photocard. Play again to get another PC!");
        }
         
    }


    //function to reset game
    function resetGame() {


        //ensures that the levels begin from scratch
        levelComplete = false;

        //set it back to level 1
        currentLevel = 1;

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
        timeLeft = 45;
        fallSpeed = 6;
    
    
    
        //reset UI
    
        timerDisplay.textContent = timeLeft;
        scoreDisplay.textContent = "Your Score " + score;

        //need to manually reset the colors to dark blue because if you game over when you hit reset after level 2 the text remains white and also there were no settings for this before.
        scoreDisplay.style.color = "#095b90";
        document.getElementById("timerArea").style.color = "#095b90"; 
        timerDisplay.style.color = "#095b90";
    
        //reset catcher position
       catcherPosition = 190;
       catcher.style.left = catcherPosition + "px"; 
       catcher.style.display = "block"; 
    
    //reatsrt the number generator 
        randomNumberInterval = setInterval(function generateNumber() {
            generatedNumber = Math.floor(Math.random()*30)+1;
            randomNumberArea.textContent=generatedNumber;
         }, 100);

//reset stop button z index
        stopButton.classList.remove("game-over");


    //go back to level 1 images
        gameArea.style.backgroundImage = "url('images/caratland2024.jpg')"; // Default Level 1 background
        catcher.style.backgroundImage = "url('images/clTote.png')"; // Replace with actual Level 1 catcher
    
    }

    //function to create level 2


    function levelTwo() {
        fallSpeed = 8; // Items fall faster in level 2
        currentLevel = 2; 
        winningScore = generatedNumber;
        document.body.removeChild(gameOverMessage); //do this to remove the overlay

        //need to change the color of the font to white because of the brown BG

        scoreDisplay.style.color = "white"; //changes the score shown
        timerDisplay.style.color = "white"; //changes the number of the timer itself
        document.getElementById("timerArea").style.color = "white"; //changes the HTML elements of timer area.
    
        // Reset game state
        score = 0;
        gameOver = false;
        timeLeft = 45;  // More time for level 2
     
    
        // Reset catcher
        catcherPosition = 190;
        catcher.style.left = catcherPosition + "px";
        catcher.style.display = "block";
    
        // Change visuals for level 2
        gameArea.style.backgroundImage = "url('images/17rh.jpg')";
        catcher.style.backgroundImage = "url('images/17rhtote.png')";
    
        // Update UI
        timerDisplay.textContent = timeLeft;
        scoreDisplay.textContent = "Your Score " + score;
    
        // Restart number generator
        stopButton.disabled = false;
        randomNumberInterval = setInterval(function generateNumber() {
            generatedNumber = Math.floor(Math.random() *30) + 1;
            randomNumberArea.textContent = generatedNumber;
        }, 100);
    }

    function showLevel2Instructions() {

        catcher.style.display = "none";//remove catcher from the BG, or rather, make it look "invisible"
        const bgImage = document.createElement("img");
        gameOverMessage = document.createElement("div");
        gameOverMessage.classList.add("game-over-message"); //add the overlay
    
        const title = document.createElement("h2");
        title.textContent = "Level 2:";
        gameOverMessage.appendChild(title);


//image placement here

const l2Text = document.createElement("img");
l2Text.src = "images/17rhtextwhite.png"; 
l2Text.alt = "Seventeen Right Here";
l2Text.style.width = "500px";
l2Text.style.height = "auto";
l2Text.style.margin = "0px auto";
l2Text.style.display = "block";
gameOverMessage.appendChild(l2Text); 


//the instructions below the image
const instructions = document.createElement("p");
instructions.textContent = "After Caratland, the Right Here tour was announced. This is the last tour before enlistment so Seventeen has a special item for Carats - catch a diamond 💎 to boost your points! Now the crowd is louder and the bongs fall faster. Catch carefully!";
instructions.style.maxWidth = "400px";
instructions.style.textAlign = "center";
instructions.style.margin = "20px auto";
gameOverMessage.appendChild(instructions);
    
const startLevel2Button = document.createElement("div");
startLevel2Button.classList.add("restartButton");
startLevel2Button.textContent = "Start Level 2";
startLevel2Button.addEventListener("click", levelTwo);
gameOverMessage.appendChild(startLevel2Button);
    
document.body.appendChild(gameOverMessage);
    
//ensures that no intervals are running during the instructional screen
clearInterval(itemCreationInterval);
clearInterval(timer);
clearItems();
gameOver = true; 

}


function endGame(message) {
    clearInterval(itemCreationInterval);
    clearInterval(timer);
    clearItems();
    
    catcher.style.display = "none";
    

    gameOverMessage = document.createElement("div");
    gameOverMessage.classList.add("game-over-message");

    const winMessage = document.createElement("h2");
    winMessage.textContent = "AJU NICE! You Won!";
    winMessage.style.marginBottom = "10px"; // Space between text and image
    gameOverMessage.appendChild(winMessage);
    
    const winImage = document.createElement("img");
    winImage.alt = "You won!";
    winImage.style.width = "200px";  // Adjust size of the image
    winImage.style.height = "300px";
    winImage.style.marginBottom = "20px";
    winImage.style.display = "block";
    
    gameOverMessage.appendChild(winImage);

    //animation to display all images of array in 10ms
    let displayInterval = setInterval( function(){ 
            let randomIndex = Math.floor(Math.random()*memberPics.length);
            winImage.src = memberPics[randomIndex];
        },100);

        //after 2s, display the final image
    setTimeout(function(){
        clearInterval(displayInterval);
        let finalIndex = Math.floor(Math.random()*memberPics.length);
        winImage.src = memberPics[finalIndex]
        },2000);

    //here is where the message becomes visible and positioned. the ACTUAL message is actually inside the updatescore function when the player wins
        const messageText = document.createElement("div");
        messageText.textContent = message;
        messageText.style.textAlign = "center";
        messageText.style.maxWidth = "400px";
        messageText.style.margin = "0 auto 20px";
        

        //add the restart button
        const restartButton = document.createElement("div");
        restartButton.classList.add("restartButton");
        restartButton.textContent = "Play Again";
        restartButton.addEventListener("click", resetGame);
    
        gameOverMessage.appendChild(messageText);
        gameOverMessage.appendChild(restartButton);
        document.body.appendChild(gameOverMessage);
    
        stopButton.disabled = true;
        gameOver = true;
    }
    