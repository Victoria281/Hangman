
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXX  CLASSES   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//Classes

//Word class to define word
class Word {
    constructor(word, definition) {
        this.word = word;
        this.definition = definition;
    }
    showDef() {
        return this.definition;
    }
}

//WordCollection class to define array of Word objects
class WordCollection {
    constructor(arr) {
        this.scoreArray = arr;
    }

    //Method to randomly select words from the pool for each gameplay
    randomSelect() {
        var randomArr = new Array();
        while (randomArr.length != 10) {
            var index = Math.floor(Math.random() * this.scoreArray.length);
            //example of indexOf()
            var flag = true;
            for (i of randomArr)
                if (i == this.scoreArray[index])
                    flag = false;
            if (flag)
                randomArr.push(this.scoreArray[index]);
        }
        this.scoreArray = randomArr;
    }

    //Method to check if the word is guessed correctly by player
    checkWord() {
        var check = "";
        for (var i = 0; i < currentGuess.length; i++)
            if (currentGuess[i] != " ")
                check += currentGuess[i];
        //check if the player has guessed the word
        if (check != this.scoreArray[gamePart].word.toUpperCase())
            return false;
        else
            return true;
    }

    //Method to keep track of the score
    trackScore() {
        if (this.checkWord())
            score += 1;
        return score;
    }
}

//Player Class to define player name, score and time
class Player {
    constructor(name, score, time) {
        this.name = name;
        this.score = score;
        this.time = time;
    }
}

//AllPlayers class to define an array of Player objects
class AllPlayers {
    constructor(highScoreArray) {
        this.highScoreArray = highScoreArray;
    }

    //Method to sort the array of players objects by score
    sortArr() {
        for (var i = 0; i < this.highScoreArray.length; i++) {
            for (var e = 0; e < (this.highScoreArray.length - 1); e++) {
                if (parseInt(this.highScoreArray[e].score) < parseInt(this.highScoreArray[e + 1].score)) {
                    var temp = this.highScoreArray[e];
                    this.highScoreArray[e] = this.highScoreArray[e + 1];
                    this.highScoreArray[e + 1] = temp;
                }
                else if (parseInt(this.highScoreArray[e].score) == parseInt(this.highScoreArray[e + 1].score)) {
                    if (parseInt(this.highScoreArray[e].time) > parseInt(this.highScoreArray[e + 1].time)) {
                        var temp = this.highScoreArray[e];
                        this.highScoreArray[e] = this.highScoreArray[e + 1];
                        this.highScoreArray[e + 1] = temp;
                    }
                }
            }
        }
        return this.highScoreArray;
    }

    //Method to display leaderboard
    displayHighscore() {
        this.sortArr();
        var leaderboard = "\t _______________________________ \n\t|         LeaderBoard           |\n\t|-------------------------------|\n\t|        NAME\t\tSCORE\t|\n\t|-------------------------------|\n";
        if (this.highScoreArray.length <= 5)
            var len = this.highScoreArray.length;
        else
            var len = 5;
        for (var i = 0; i < len; i++)
            leaderboard += "\t| " + (i + 1) + "----- " + this.highScoreArray[i].name + " \t" + this.highScoreArray[i].score + "\t|\n";
        return leaderboard;
    }

    findPlayer(playerName) {
        var existingPlayer = -1;
        for (var i = 0; i < this.highScoreArray.length; i++) {
            if (this.highScoreArray[i].name == playerName) {
                existingPlayer = i;
                break;
            }
        }
        return existingPlayer;
    }
}


//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXX  CREATION OF GAME   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

//Hangman Ascii
errorList = [
    " _|_\n|   |______\n|\t   |\n|__________|",
    "",
    "   _____\n  |   " + "  |\n".repeat(4),
    "   _____\n  |     |\n  |     o\n" + "  |\n".repeat(3),
    "   _____\n  |     |\n  |     o\n  |    /  \n  |\n  |\n",
    "   _____\n  |     |\n  |     o\n  |    / \\\n  |\n  |\n",
    "   _____\n  |     |\n  |     o\n  |    /|\\\n  |     |\n  |\n",
    "   _____\n  |     |\n  |     o\n  |    /|\\\n  |     |\n  |    /  \n",
    "   _____\n  |     |\n  |     o\n  |    /|\\\n  |     |\n  |    / \\\n"
];


//Inititalisation of variables
alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const Time = [8.64e+7, 3.6e+6, 60000, 1000, 1];
const TimeName = ["days", "hours", "minutes", "seconds", "milliseconds"];
var fs = require('fs');
var input = require('readline-sync');

//Getting array of words from CSV file
var wordArray = new Array();
try {
    var wordArray = fs.readFileSync('./words.csv', 'ascii').split('\r\n');
}
catch (err) {
    console.log(err);
}

//Fetching Highscore Data from CSV file
var scoreArray = new Array();
try {
    var scoreArray = fs.readFileSync('./highscore.csv', 'ascii').split('\r\n');
}
catch (err) {
    console.log(err);
}
a = scoreArray.map(e => e.split(","));


//Creating Player and All Player Object
b = new Array();
for (var i = 1; i < a.length; i++) {
    b.push(new Player(a[i][0], a[i][1], a[i][2], a[i][3]));
}
var players = new AllPlayers(b);




//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXX  START OF GAME   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


//Welcome and Leaderboard

console.log(players.displayHighscore());
console.log("\n\n\t\t  --- Welcome ---");

//Check for player
var name = input.question("Please enter your Username: ");
var oldPlayerIndex = players.findPlayer(name);

while (name.length < 5 || name.length > 10) {
    console.log("Name should be of a length longer than 5 and shorter than 10");
    var name = input.question("Please enter your name: ");
}

//Creating Word and Word Collection Object
var myCategory = ["Disney Movies", "Flower Meaning", "Chemical Elements", "Sports Activity"];
var catChoice = input.questionInt("\n\nBefore we officially start the game, Please Choose Your Word Category :)\n\n\t1)Disney Movies\n\t2)Flower Meaning\n\t3)Chemical Elements\n\t4)Sports Activity\n >>");
while (catChoice > 4 || catChoice < 1)
    catChoice = input.question("Incorrect Input. Please enter again. \n>> ");
var game = new WordCollection(chooseCat(myCategory[catChoice - 1]));

//Game Initialisation
game.randomSelect();
var gamePart = 0,
    error = 0,
    score = 0,
    lifeChance = [1, 2, 1],
    timeTaken = [0, 0, 0, 0, 0];


//Game Start
console.log("\n\n-= Welcome to Hangman =-\n");

while (gamePart < 10 && error < 8) {

    // GamePart Start    
    console.log("\n\n\n" + "_".repeat(55) + "\n");
    console.log("Word " + (gamePart + 1) + " / 10");
    theWord = game.scoreArray[gamePart].word.toUpperCase();
    if (name == "Amanda")
        console.log(theWord);
    currentGuess = "_ ".repeat(theWord.length);
    console.log(currentGuess + "\n\n" + alphabet.slice(0, 13).join(' ') + "\n" + alphabet.slice(13).join(' '));
    gameAlphabet = alphabet.slice();
    var usedAlphabet = new Array();
    var timestamp1 = Date.now();

    //Checking of Word
    while (game.checkWord() == false && error < 8) {
        do {
            letter = input.question("\n" + name + "'s guess (Enter 9 for lifelines or 0 to pass): ").toUpperCase();
        } while (letter.length != 1);

        if (letter == 9)
            console.log(lifeline());
        else if (letter == 0)
            break;
        else
            check_letter(letter);

    }

    //End of GamePart
    if (game.checkWord())
        yes = 1;
    else
        yes = 0;

    var timestamp2 = Date.now();
    console.log("\nCongratulations for completing Part " + (gamePart + 1) + " of the game.");
    console.log(timeDiff(timestamp1, timestamp2));

    console.log("You have scored " + yes + " point.");
    var currentScore = game.trackScore();
    console.log("Your current score is " + currentScore + "/10");

    gamePart++;
}

//End of Game
console.log("\n\n\n" + "_".repeat(55));
console.log("_".repeat(55));
console.log("_".repeat(55));
var timeStr = "\n\nYou have taken a total of ";
for (var i = 0; i < timeTaken.length; i++) {
    if (timeTaken[i] > 0)
        timeStr += timeTaken[i] + " " + TimeName[i] + " ";
}
console.log(timeStr);
if (error < 8) {
    console.log("You have come to the end of the game.");


    var savePt = input.question("Do you wish to save your score? Enter Y|y to save and others to not save\n>> ");
    if (savePt == "Y" || savePt == "y") {

        var save = savePreparation(timeTaken, currentScore);

        fs.writeFileSync('./highscore.csv', save, function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
        console.log(players.displayHighscore());
    }

    console.log("You have scored a total of " + currentScore + "/10");
    if (currentScore == 10)
        console.log("Congratulations " + name + "! \n\n\n\n");
    else
        console.log("Just " + (100 - currentScore * 10) + "% to go! \nDon't give up " + name + " and Try Again :)\nBye Bye! \n\n\n\n");
}
else {
    console.log("You have died.");
    console.log("Don't give up " + name + " and Try Again :)\nBye Bye! \n\n\n\n");
}

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXX  FUNCTIONS   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


//FUNCTIONS

// function to check the letter and update process of guessing word
function check_letter(letter) {
    if (alphabet.indexOf(letter) > -1) {
        if (usedAlphabet.indexOf(letter) < 0) {
            usedAlphabet.push(letter);
            if (theWord.indexOf(letter) > -1) {
                console.log("\nGood Job! " + letter + " is one of the letters.");
                for (var i = 0; i < theWord.length; i++)
                    if (theWord[i] == letter)
                        currentGuess = currentGuess.slice(0, i * 2) + letter + currentGuess.slice(i * 2 + 1);
            }
            else {
                console.log("\nSorry. " + letter + " is not a part of the word.\n");
                error++;
                console.log(errorList[error] + errorList[0]);
            }
            gameAlphabet[gameAlphabet.indexOf(letter)] = " ";
            console.log("\n" + currentGuess + "\n\n" + gameAlphabet.slice(0, 13).join(' ') + "\n" + gameAlphabet.slice(13).join(' '));
        }
        else {
            console.log("You have already used the letter " + letter);
        }
    } else {
        console.log("Error. Please enter proper input!!");
    }
}

// function to call and use lifelines 
function lifeline() {
    var result = "";
    choice = input.questionInt("\nChoose your desired lifeline: \n\t1) Vowel life \n\t2) Definition life \n\t3) Skip Life\n\n>> ");
    while (choice > 3 || choice < 1 )
        choice = input.question("Incorrect input. Please enter again \n>> ");
    if (lifeChance[choice - 1] ==0)
        return "Sorry. You have used up that lifeline";
    else
        lifeChance[choice - 1] -= 1;

    switch (choice) {
        //(1) show all vowels
        case 1: {
            var vowels = ["A", "E", "I", "O", "U"];
            original = currentGuess;
            for (i of vowels)
                for (var e = 0; e < theWord.length; e++)
                    if (theWord[e] == i) {
                        currentGuess = currentGuess.slice(0, e * 2) + i + currentGuess.slice(e * 2 + 1);
                        gameAlphabet[gameAlphabet.indexOf(i)] = " ";
                    }
            if (currentGuess == original) {
                result = "All vowels have already been shown";
                lifeChance[choice - 1] += 1;
            }
            else
                result = currentGuess;
        } break;
        //(2) show definition of the word
        case 2: result = game.scoreArray[gamePart].showDef();
            break;
        //(3) allow user to score and move on to the next word
        case 3:
            currentGuess = theWord.split("").join(" ");
            break;
    }
    return result;
}

// function to find differenve between 2 timestanps
function timeDiff(time1, time2) {
    var diff = time2 - time1;
    var diffStr = "You have taken ";
    for (var i = 0; i < Time.length; i++) {
        var temp = Math.trunc(diff / Time[i]);
        if (temp > 0) {
            diffStr += temp + " " + TimeName[i] + " ";
            diff -= temp * Time[i];
            timeTaken[i] += temp;
        }
    }
    return diffStr;
}

function chooseCat(category) {
    c = new Array();
    for (i of wordArray) {
        word = i.split(",");
        if (word[0] == category) {
            c.push(new Word(word[1], word[2]));
        }
    }
    return c;
}

function savePreparation(saveTime, saveScore) {
    var totalTime = 0;
    for (var i = 0; i < saveTime.length; i++)
        totalTime += saveTime[i] * Time[i];
    if (oldPlayerIndex != -1) {
        players.highScoreArray[oldPlayerIndex].score = saveScore;
        players.highScoreArray[oldPlayerIndex].time = totalTime;
    }
    else {
        var newPlayer = new Player(name, saveScore, totalTime);
        players.highScoreArray.push(newPlayer);
    }

    var updatedArray = "Name,Score,Time\r\n";
    for (i of players.highScoreArray) {
        updatedArray += `${i.name},${i.score},${i.time}\r\n`;
    }
    updatedArray = updatedArray.slice(0, -2);
    return updatedArray
}