#Carat Catch

Gameplay:

A game made for fans of the Kpop boyband Seventeen, where users catch earn points by catching Seventeen's lightsticks known as "Caratbong" and lose points when they catch the lightsticks of other groups. 

A second level is made more complex with items falling at a faster speed and a special item which boosts the user's points. 

When the user wins both levels, they are awarded a digital photocard of a random member. 

Game imagery is centered around Seventeen's two major events in 2024 - their fanmeeting Caratland (in level 1) and their subsequent Right Here tour (in level 2)


##Screenshots

###Intro Screen

###Play view

###Level 1 Win View

###Level 2 Win View

###Lose View

##Technologies Used
HTML
CSS
JavaScript


##Game Logic 
Home Screen
User clicks on 'Ready to Love' button --> Using CSS, home screen swipes up to reveal game screen
Random number generator runs --> A random number between 1 to 50 is generated and stops the moment the user presses the 'Start' b                                button
Upon clicking start button --> the random number generated becomes the level's winning score. 
                           --> function to begin spawing items get activated. 
                           --> Timer for the round gets activated and starts counting down.
Every 0.6seconds, a new item spawns --> within this function, the spawned item falls down the game area
                                    --> collision between the item is checked, and removed off the game area once collision is detected
                                    --> If an item falls out of the game area, it is also removed from the screen.
                                    --> If collision is detected, the user's score is updated.
Update score function --> checks the item that has collided and updates the user's score in accordance with the items caught
                      --> If the user has met the winning score and the game is at level 1, the instructions for level 2 are loaded
                      --> The level of the game is updated to level 2
                      --> The instructional screen for level 2 loads
Instructional screen for level 2 loads --> User presses the button to initialize level 2
Level 2 Function --> Variables such as the item fall speed and catcher image, game background are updated. 
                 --> Re-enable start button to initialize the game with new settings
Level 2 Win Screen --> Update score is run and if the winning score is detected on level 2 the win screen comes on
                    --> Animation to generate a photocard of a random member
Lose Screen--> An image of a crying Mascot is displayed. 

##Roadmap
Add more levels into the game








