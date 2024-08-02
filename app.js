let word; // Declare word globally
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

const dictionaryFile = '/Hangman/words_alpha.txt';

// Function to load words from a dictionary file and start the game
function loadWordsFromFile(filename) {
    fetch(filename)
    .then(response => response.text())
    .then(data => {
        wordList = data.split('\n').filter(word => word.trim() !== ''); // Ensure no empty words
        startGame(); // Start the game after loading words
    })
    .catch(error => console.error(`Error reading file: ${error}`));
}

// Function to start the game
function startGame() {
    if (wordList.length === 0) {
        console.error("No words available to start the game.");
        return;
    }
    word = chooseRandomWord(); // Choose a random word from the dictionary
    guessedLetters = []; // Reset guessed letters
    remainingGuesses = 6; // Reset remaining guesses
    displayWord();
    displayHangman();
}

// Function to choose a random word from the English dictionary
function chooseRandomWord() {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

// Function to display the hangman figure
function displayHangman() {
    document.getElementById("hangman").innerText = hangmanParts[6 - remainingGuesses];
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
    document.getElementById("word-display").innerHTML = displayedWord;
    return displayedWord; // Return the displayed word
}

// Function to handle a guessed letter
function makeGuess() {
    let guess = document.getElementById("guess-input").value.toLowerCase();
    document.getElementById("guess-input").value = ""; // Clear input field

    if (guess.length !== 1 || !guess.match(/[a-z]/i)) {
        document.getElementById("guess-feedback").innerHTML = "Please enter a single valid letter.";
        return;
    }

    if (guessedLetters.includes(guess)) {
        document.getElementById("guess-feedback").innerHTML = "You already guessed that letter.";
        return;
    }

    guessedLetters.push(guess);

    if (word.includes(guess)) {
        document.getElementById("guess-feedback").innerHTML = "Correct!";
    } else {
        remainingGuesses--;
        document.getElementById("guess-feedback").innerHTML = `Incorrect. ${remainingGuesses} guesses remaining.`;
        displayHangman(); // Update hangman figure
    }

    let displayedWord = displayWord(); // Get the displayed word

    // Check if the game is over
    if (remainingGuesses === 0 || !displayedWord.includes("_")) {
        document.getElementById("guess-feedback").innerHTML = remainingGuesses === 0 ? `Sorry, you ran out of guesses. The word was: ${word}` : "Congratulations! You guessed the word.";
        document.getElementById("guess-input").disabled = true;
        document.getElementById("guess-button").disabled = true;
        document.getElementById("word-display").innerHTML = word; // Display the word

        // Fetch the definition if the word is guessed or game is over
        if (remainingGuesses === 0 || !displayedWord.includes("_")) {
            getDefinition(word);
        }
    }
}

// Function to fetch the definition of a word
function getDefinition(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        if (data && data[0] && data[0].meanings && data[0].meanings.length > 0) {
            const definitions = data[0].meanings[0].definitions;
            if (definitions.length > 0) {
                // Display the first definition
                document.getElementById("definition-display").innerHTML = `Definition: ${definitions[0].definition}`;
            } else {
                document.getElementById("definition-display").innerHTML = "No definition found.";
            }
        } else {
            document.getElementById("definition-display").innerHTML = "No definition found.";
        }
    })
    .catch(error => {
        console.error('Error fetching definition:', error);
        document.getElementById("definition-display").innerHTML = "Error fetching definition.";
    });
}

// Function to restart the game
function restartGame() {
    startGame(); // Call the startGame function to restart the game
    document.getElementById("guess-input").disabled = false; // Enable the guess input field
    document.getElementById("guess-button").disabled = false; // Enable the guess button
    document.getElementById("guess-feedback").innerHTML = ""; // Clear the guess feedback
    document.getElementById("word-display").innerHTML = ""; // Clear the word display
    document.getElementById("definition-display").innerHTML = ""; // Clear the definition display
}

// Initial setup
loadWordsFromFile(dictionaryFile); // Load words and start the game
displayHangman(); // Display initial hangman figure
