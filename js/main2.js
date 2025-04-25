// ==========================
// Global Variables
// ==========================


let min, max, targetNumber, guessCount = 0, hintTimeout, timerInterval, elapsed, totalScore;
let gameStarted = false;

// ==========================
// Elements
// ==========================
const userName = localStorage.getItem("playerName")||"Player";
const name = document.getElementById("playerName")
const minInput = document.getElementById("minRange");
const maxInput = document.getElementById("maxRange");
const startBtn = document.getElementById("startGame");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");

const welcomeTitle = document.getElementById("welcomeTitle");
const rangePrompt = document.getElementById("rangePrompt");
const rangeInputs = document.getElementById("rangeInputs");
const gamePanel = document.getElementById("gamePanel");
const feedbackMessage = document.getElementById("feedbackMessage");
const guessInput = document.getElementById("guessInput");
const gameInfo = document.getElementById("gameInfo");
const hintSection = document.getElementById("hintSection");
const timeTracker = document.getElementById("timeTracker");

const leaderboardBtn = document.getElementById("leaderboardBtn");
const feedbackBtn = document.getElementById("feedbackBtn");

// ==========================
// Input Validation
// ==========================
[minInput, maxInput].forEach(input => {
  input.addEventListener("input", () => {
    const minVal = parseInt(minInput.value);
    const maxVal = parseInt(maxInput.value);
    startBtn.disabled = isNaN(minVal) || isNaN(maxVal);
  });
});

name.textContent = `${userName}`

// ==========================
// Start Game
// ==========================
startBtn.addEventListener("click", () => {
  min = parseInt(minInput.value);
  max = parseInt(maxInput.value);

  if (min >= max) {
    alert("Minimum value must be less than maximum value.");
    return;
  }

  // Hide range UI
  welcomeTitle.classList.add("hidden");
  rangePrompt.classList.add("hidden");
  rangeInputs.classList.add("hidden");
  startBtn.classList.add("hidden");

  // Show game UI
  gamePanel.classList.remove("hidden");

  // Generate number
  targetNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  guessCount = 0;
  gameInfo.textContent = `A number has been generated between ${min} and ${max}`;
  feedbackMessage.textContent = "";
  guessInput.value = "";
  gameStarted = true;
  let startTime;


  startTime = Date.now();
  timerInterval = setInterval(() => {
    elapsed = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timeElapsed").textContent = `Time elapsed: ${elapsed}s`;
  }, 1000);


  // Disable leaderboard access while guessing
  leaderboardBtn.style.pointerEvents = "none";
  leaderboardBtn.style.opacity = "0.4";

  // Start hint timer
  hintTimeout = setTimeout(() => {
    hintSection.textContent = `Hint: Use binary search algorithm.`;
    hintSection.classList.remove("hidden");
  }, 20000); // 20 seconds
});

// ==========================
// Guess Handler
// ==========================
guessBtn.addEventListener("click", () => {
  const guess = parseInt(guessInput.value);
  if (isNaN(guess)) {
    feedbackMessage.textContent = "Please enter a valid number.";
    return;
  }

  guessCount++;

  if (guess === targetNumber) {
    feedbackMessage.textContent = `Correct! You got it in ${guessCount} tries.`;
    clearTimeout(hintTimeout);
    // Save to JSON leaderboard here
    clearInterval(timerInterval);
    console.log(elapsed);
    gameStarted = false;
    
    totalScore = calculateScore(min, max, guessCount, timerInterval);

    hintSection.classList.remove("hidden");
    hintSection.textContent = `Your total Score is ${totalScore}.`;
    document.getElementById("submit-score-container").style.display = "block";

    leaderboardBtn.style.pointerEvents = "auto";
    leaderboardBtn.style.opacity = "1";
  } else if (guess < targetNumber) {
    feedbackMessage.textContent = "Too low!";
    guessInput.value = "";
  } else {
    feedbackMessage.textContent = "Too high!";
    guessInput.value = "";
  }
});

document.getElementById("submit-score-checkbox").addEventListener("change", function() {
    const submitButton = document.getElementById("submit-score");
    submitButton.disabled = !this.checked;
});


// ==========================
// Restart Game
// ==========================
restartBtn.addEventListener("click", () => {
  location.reload();
});

// Score calculation

function calculateScore(min, max, guesses, timeTaken) {
    const rangeSize = max - min + 1;

    // Logarithmic range bonus, normalized (e.g., 1-100 gives ~6.64)
    const rangeFactor = Math.log2(rangeSize);

    // Optimal guesses using binary search logic
    const optimalGuesses = Math.ceil(Math.log2(rangeSize));
    const guessEfficiency = optimalGuesses / guesses;

    // Time bonus: ideal is 30s or less. Penalty increases after that.
    const timeFactor = timeTaken <= 30
        ? 1
        : Math.max(0.5, 30 / timeTaken); // starts dropping after 30s

    // Combine with better balanced weight
    let rawScore = rangeFactor * 20 * guessEfficiency * timeFactor;

    // Final clamp and round to 100
    const finalScore = Math.round(Math.min(100, Math.max(0, rawScore)));

    return finalScore;
}

//Storage of files

const SHEETDB_API_URL = `https://sheetdb.io/api/v1/1nph83if87gly`;

 function submitScore(playerData) {
    const playerName = playerData.playerName;
  
    // First, check for duplicates
    fetch(`${SHEETDB_API_URL}/search?playerName=${encodeURIComponent(playerName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          // Player already exists - delete it first
          fetch(`${SHEETDB_API_URL}/playerName/${encodeURIComponent(playerName)}`, {
            method: "DELETE",
          }).then(() => {
            console.log("Old record deleted. Now submitting new score...");
            postScore(playerData);
          });
        } else {
          // No duplicate - safe to submit directly
          postScore(playerData);
        }
      })
      .catch(err => {
        console.error("Error checking for duplicates:", err);
      });
 }
  
  function postScore(playerData) {
    fetch(SHEETDB_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: playerData }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("Score submitted successfully:", data);
      alert("Score submitted to leaderboard!");
    })
    .catch(err => {
      console.error("Error submitting score:", err);
      alert("Error submitting score. Please try again.");
    });
  }
  
  const submitButton = document.getElementById("submit-score");

  submitButton.addEventListener("click", () => {
    submitButton.disabled = true;
    checkbox = document.getElementById("submit-score-checkbox").disabled = true; 
    console.log(userName,guessCount,timerInterval,totalScore);
  const playerData = {
    playerName: userName,         // already stored from earlier in game
    guesses: guessCount,
    timeTaken: elapsed,
    range: `${min} to ${max}`,
    score: totalScore
  };

  submitScore(playerData);
});

if (leaderboardBtn) {
  leaderboardBtn.addEventListener("click", () => {
    window.location.href = "leaderboard.html";
  });
}
