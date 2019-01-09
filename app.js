/* GLOBAL VARIABLES */

//Tracking and updating html elements
const board = document.getElementById("gameboard");
let resetButton = document.getElementById("resetButton"),
    timer = document.getElementById("menuTimer"),
    /* Modal elements */
    closeModal = document.querySelector('.close'),
    victoryModal = document.getElementById('victoryModal'),
    textInsideModal = document.getElementById('textInsideModal'),
    btnNotPlayAgain = document.getElementById('notPlayAgain'),
    btnPlayAgain = document.getElementById('playAgain');

//Initializing other variables
let squares = [],
    seconds = 0,
    minutes = 0,
    hours = 0,
    myInterval, 
    starRating, 
    firstCard, secondCard, 
    totalMoves;

/* END OF GLOBAL VARIABLES */

/* EVENT LISTENERS */

//Everytime the website loads, randomly generate a board, create starRating, set and start a timer, populate move number and update squares variable
document.addEventListener('DOMContentLoaded', function () {
    setUpNewGame();
    createAndStartTimer();
    timer.innerHTML = "<i class='fas fa-clock'></i> 00:00:00"
});

//Resets board; assigned cards and total of moves
resetButton.addEventListener('click',function() {
    if (confirm("Are you sure you want to erase your progress?")) {
        setUpNewGame();
        clearInterval(myInterval);
        seconds = 0;
        minutes = 0;
        hours = 0;
        createAndStartTimer();
        timer.innerHTML = "<i class='fas fa-clock'></i> 00:00:00"
    }
})

//Setting a click listener for everything on the board
board.addEventListener('click',function(event) {

    let eventID = event.target.id;
    let eventTag = event.target.tagName;
    let eventTargParent = event.target.parentNode;

    if (eventID == "gameboard") {
        return;
    }
    else if (eventTag == "DIV" && firstCard.length == 0) {
        eventTargParent.classList.toggle("is_flipped");
        firstCard.push(eventTargParent);
        //disabling first card we while wait for next play
        firstCard[0].classList.add("disableCard");
        return;
    }
    else if (eventTag == "DIV" && secondCard.length == 0) {
        eventTargParent.classList.toggle("is_flipped");
        //enabling first card again
        firstCard[0].classList.remove("disableCard");
        secondCard.push(eventTargParent);

        checkForMatch(firstCard,secondCard,
            //callback if there's a match
            function() {
                matched()
            },
            //callback if there's NOT a match
            function() {
                unmatched()
            });

        totalMoves += 1;
        document.getElementById('numberOfMoves').innerHTML = `${totalMoves}`
        if (totalMoves == 10) {
            createAndUpdateStarRating(menuStars,1);
            starRating = 1;

        }
        else if (totalMoves == 5) {
            createAndUpdateStarRating(menuStars,2);
            starRating = 2;
        }

        return;
    }
    else if (eventTag == "I") {
        //event target is an i, parent is a div, just flip the card back
        eventTargParent.parentNode.classList.toggle("is_flipped");
        return;
    }
})

/* Modal listeners */

//listening for a click to close the victory modal; reset the game after modal is closed
closeModal.addEventListener('click',function() {
    victoryModal.style.display = "none";
})

//User does NOT want to play game again
notPlayAgain.addEventListener('click',function() {
    victoryModal.style.display = "none";
})

//User wants to play game again
btnPlayAgain.addEventListener('click',function() {
    setUpNewGame();
    clearInterval(myInterval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    createAndStartTimer();
    timer.innerHTML = "<i class='fas fa-clock'></i> 00:00:00"
    victoryModal.style.display = "none";
})

/* END OF EVENT LISTENERS */

/* SUPPORTING FUNCTIONS */

function setUpNewGame() {
    board.innerHTML = "";
    starRating = 3;
    createBoard();
    createAndUpdateStarRating(document.getElementById('menuStars'),starRating);
    firstCard = [];
    secondCard = [];
    totalMoves = 0;
    document.getElementById('numberOfMoves').innerHTML = `${totalMoves}`
    squares = document.querySelectorAll('.square');
}

//Creating the memory cards board
function createBoard() {
    //putting the gameboard together
    for (let i = 0; i<18; i++) {
        board.insertAdjacentHTML("beforeend","<li class='square'><div class='square_face square_front'></div><div class='square_face square_back'></div></li>")
    }

    const listOfIcons = [
        "<i class='fab fa-adobe fa-2x'></i>",
        "<i class='fab fa-apple fa-2x'></i>",
        "<i class='fab fa-amazon fa-2x'></i>",
        "<i class='fab fa-ebay fa-2x'></i>",
        "<i class='fab fa-dropbox fa-2x'></i>",
        "<i class='fab fa-cc-visa fa-2x'></i>",
        "<i class='fab fa-github-alt fa-2x'></i>",
        "<i class='fab fa-gulp fa-2x'></i>",
        "<i class='fab fa-facebook fa-2x'></i>",
        "<i class='fab fa-adobe fa-2x'></i>",
        "<i class='fab fa-apple fa-2x'></i>",
        "<i class='fab fa-amazon fa-2x'></i>",
        "<i class='fab fa-ebay fa-2x'></i>",
        "<i class='fab fa-dropbox fa-2x'></i>",
        "<i class='fab fa-cc-visa fa-2x'></i>",
        "<i class='fab fa-github-alt fa-2x'></i>",
        "<i class='fab fa-gulp fa-2x'></i>",
        "<i class='fab fa-facebook fa-2x'></i>"
    ]

    //shuffle this array
    const shuffle = function (array) {
        let currentIndex = array.length;
        let temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    //final list with icon codes randomized
    const finalIcons = shuffle(listOfIcons)
    //html collection with all squares on board
    let squares = board.children

    let squareIndex = 0,
        iconsIndex = 0;

    while (squareIndex < squares.length) {
        squares[squareIndex].lastChild.innerHTML = finalIcons[iconsIndex];
        squareIndex++;
        iconsIndex++;
    }

}

function createAndUpdateStarRating(menuStars,rating) {
    menuStars.innerHTML = "";
    for (let i = 1; i<=rating; i++) {
        menuStars.insertAdjacentHTML("beforeend","<i class='fas fa-star'></i>");
    }
}

function createAndStartTimer() {
    myInterval = setInterval(function(){
        seconds++;
        if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
                minutes = 0;
                hours++;
            }
        }
        timer.innerHTML = `<i class="fas fa-clock"></i> ${(hours > 9 ? hours : "0" + hours)}:${(minutes > 9 ? minutes : "0" + minutes)}:${(seconds > 9 ? seconds : "0" + seconds)}`
    },1000);
}
//Checking for match; called inside click event listener
function checkForMatch(firstC,secondC,callbackForMatch,callbackNoMatch) {
    let firstBrand = firstC[0].lastChild.children[0].classList[1]
    let secondBrand = secondC[0].lastChild.children[0].classList[1]
    if (firstBrand == secondBrand) {
        callbackForMatch();
        return;
    }
    else {
        callbackNoMatch();
        return;
    }
}

//callback for when there's a match
function matched() {
    //marking cards as matched; adding color and effect
    firstCard[0].lastChild.classList.add("matched");
    secondCard[0].lastChild.classList.add("matched");
    //disabling cards that were already used
    firstCard[0].lastChild.classList.add("disableCard");
    secondCard[0].lastChild.classList.add("disableCard");
    //reseting first and second cards for the next play
    firstCard = [];
    secondCard = [];
    if (checkForWin()) {
        //wait a second and then release the win modal
        setTimeout(releaseWinModal(),2000);
    }
    return;
}

//callback for when there's NOT a match
function unmatched() {
    //marking cards as UNmatched; adding color and effect
    firstCard[0].lastChild.classList.add("unmatched")
    secondCard[0].lastChild.classList.add("unmatched")
    //setting timeOut, flipping cards back and removing the unmatched class
    setTimeout(function(){
        firstCard[0].classList.toggle("is_flipped");
        secondCard[0].classList.toggle("is_flipped");
        firstCard[0].lastChild.classList.remove("unmatched");
        secondCard[0].lastChild.classList.remove("unmatched");
        //reseting first and second cards for the next play
        firstCard = [];
        secondCard = [];
    },1000);
    return;
}

//after a match play, check for a win; if there's a win, returns true; else, returns false
function checkForWin() {
    for (let square of squares) {
        if (square.classList.contains("is_flipped")) {
            continue;
        }
        else {
            //there's not a win
            return false;
        }
    }
    //there's a win
    return true;
}

//releases a modal when you win
function releaseWinModal() {
    let finalTime = `${(hours > 9 ? hours : "0" + hours)}:${(minutes > 9 ? minutes : "0" + minutes)}:${(seconds > 9 ? seconds : "0" + seconds)}`
    //freeze timer
    clearInterval(myInterval);
    timer.innerHTML = finalTime;

    textInsideModal.textContent = `Congrats! You win! Here are your stats: total moves: ${totalMoves+1}; stars: ${starRating}; time: ${finalTime}!`
    victoryModal.style.display = "block";
}

/* END OF SUPPORTING FUNCTIONS */