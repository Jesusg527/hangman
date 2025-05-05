let currentWord;
let wordList = [];
let guessedLetters = [];
let remainingGuesses = 6;

const hangmanParts = [
    "        ------\n        |    |\n             |\n             |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n             |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n        |    |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|    |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|\\  |\n             |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|\\  |\n       /     |\n             |\n--------",
    "        ------\n        |    |\n        O    |\n       /|\\  |\n       / \\  |\n             |\n--------"
];

const dictionaryFile = 'words_alpha 2.txt';

function loadWordsFromFile() {
    fetch(dictionaryFile)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            wordList = data
                .split('\n')
                .map(word => word.trim().toLowerCase())
                .filter(word => word.length > 0);
            console.log("Words loaded. Total:", wordList.length);
            startGame();
        })
        .catch(error => console.error(`Error reading file: ${error}`));
}

function chooseRandomWord() {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    console.log("Chosen word:", word); // Debugging
    return word;
}

function startGame() {
    if (wordList.length === 0) {
        console.error("No words available to start the game.");
        return;
    }
    currentWord = chooseRandomWord();
    guessedLetters = [];
    remainingGuesses = 6;
    displayWord();
    displayHangman();
    document.getElementById("guess-input").disabled = false;
    document.getElementById("guess-button").disabled = false;
    document.getElementById("guess-feedback").innerText = "";
    document.getElementById("definition-display").innerText = "";
    document.getElementById("guessed-letters").innerText = "";
    document.getElementById("word-display").innerText = "";
}

function displayHangman() {
    document.getElementById("hangman").innerText = hangmanParts[6 - remainingGuesses];
}

function displayWord() {
    return currentWord
        .split("")
        .map(letter => guessedLetters.includes(letter) ? letter : "_")
        .join(" ");
}

function updateWordDisplay(word, guessedLetters) {
    const display = word.split('').map(letter => 
        guessedLetters.includes(letter.toLowerCase()) ? letter : '_'
    ).join(' ');

    document.getElementById("word-display").textContent = display;

    if (remainingGuesses === 0 || !display.includes("_")) {
        document.getElementById("guess-feedback").innerText =
            remainingGuesses === 0
                ? `Sorry, you ran out of guesses. The word was: ${word}`
                : "Congratulations! You guessed the word!";

        document.getElementById("guess-input").disabled = true;
        document.getElementById("guess-button").disabled = true;
        document.getElementById("word-display").textContent = word.split('').join(' ');
        getDefinition(word);
    }
}

function makeGuess() {
    const input = document.getElementById("guess-input");
    const guess = input.value.toLowerCase();
    input.value = "";

    if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
        document.getElementById("guess-feedback").innerText = "Please enter a single valid letter.";
        return;
    }

    if (guessedLetters.includes(guess)) {
        document.getElementById("guess-feedback").innerText = "You already guessed that letter.";
        return;
    }

    guessedLetters.push(guess);

    if (currentWord.includes(guess)) {
        document.getElementById("guess-feedback").innerText = "Correct!";
    } else {
        remainingGuesses--;
        document.getElementById("guess-feedback").innerText = `Incorrect. ${remainingGuesses} guesses remaining.`;
        displayHangman();
    }

    updateWordDisplay(currentWord, guessedLetters);

    document.getElementById("guessed-letters").innerText = `Guessed Letters: ${guessedLetters.join(",")}`;

    input.focus();
}

function getDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data && data[0]?.meanings?.[0]?.definitions?.length > 0) {
                const definition = data[0].meanings[0].definitions[0].definition;
                document.getElementById("definition-display").innerText = `Definition: ${definition}`;
            } else {
                document.getElementById("definition-display").innerText = "No definition found.";
            }
        })
        .catch(error => {
            console.error('Error fetching definition:', error);
            document.getElementById("definition-display").innerText = "Error fetching definition.";
        });
}

function restartGame() {
    startGame();
    document.getElementById("guess-input").focus();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("guess-input").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            makeGuess();
        }
    });

    // Add event listener for the restart button
    document.getElementById("restart-button").addEventListener("click", restartGame);

    loadWordsFromFile(dictionaryFile);
    displayHangman();
});
