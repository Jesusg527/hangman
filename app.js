import fs from 'fs';

const path = require('path');
const readline = require('readline');

let word;
let wordList = [];
let guessedLetters = [];
let remainingGuesses = 6;
const hangmanParts = [
    "        ------\n        |    |\n             |\n             |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n        |    |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|    |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|\\  |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|\\  |\n       /     |\n--------",
    "        ------\n        |    |\n        O    |\n       /|\\  |\n       / \\  |\n--------"
];

const dictionaryFile = 'words_alpha.txt'; // Ensure the file path is correct

// Function to load words from a dictionary file and start the game
function loadWordsFromFile(filename) {
    const filePath = path.join(__dirname, filename);
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }
        wordList = data.split('\n')
            .map(word => word.trim())
            .filter(word => /^[a-zA-Z]+$/.test(word)); // Ensure words contain only alphabetic characters
        console.log("Words loaded:", wordList.length); // Debugging: log loaded words count
        startGame(); // Start the game after loading words
    });
}

function startGame() {
    if (wordList.length === 0) {
        console.error("No words available to start the game.");
        return;
    }
    word = chooseRandomWord(); // Choose a random word from the dictionary
    // console.log("Chosen word:", word); // Removed the debug line to avoid displaying the word
    guessedLetters = []; // Reset guessed letters
    remainingGuesses = 6; // Reset remaining guesses
    displayWord();
    displayHangman();
    promptGuess();
}

// Function to choose a random word from the English dictionary
function chooseRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Function to display the hangman figure
function displayHangman() {
    console.log(hangmanParts[6 - remainingGuesses]);
}

// Function to display the word with guessed letters
function displayWord() {
    let displayedWord = "";
    for (let letter of word) {
        if (guessedLetters.includes(letter)) {
            displayedWord += letter;
        } else {
            displayedWord += "_";
        }
    }
    console.log("Word: " + displayedWord.split('').join(' '));
    return displayedWord; // Return the displayed word
}

// Function to handle a guessed letter
function promptGuess() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question('Enter a letter: ', (guess) => {
        guess = guess.toLowerCase();

        if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
            console.log("Please enter a single valid letter.");
        } else if (guessedLetters.includes(guess)) {
            console.log("You already guessed that letter.");
        } else {
            guessedLetters.push(guess);

            if (word.includes(guess)) {
                console.log("Correct!");
            } else {
                remainingGuesses--;
                console.log(`Incorrect. ${remainingGuesses} guesses remaining.`);
                displayHangman(); // Update hangman figure
            }

            let displayedWord = displayWord(); // Get the displayed word

            // Check if the game is over
            if (remainingGuesses === 0 || !displayedWord.includes("_")) {
                console.log(remainingGuesses === 0 ? `Sorry, you ran out of guesses. The word was: ${word}` : "Congratulations! You guessed the word.");
                rl.close();
            } else {
                rl.close();
                promptGuess(); // Prompt the next guess
            }
        }
    });
}

// Initial setup
loadWordsFromFile(dictionaryFile); // Load words and start the game
