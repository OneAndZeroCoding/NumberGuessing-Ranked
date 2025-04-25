// Function to show the rules section when the "Read Rules" button is clicked
function showRules() {
  document.querySelector('.rules-section').style.display = 'block'; // Show rules
  document.querySelector('.read-rules-btn').style.display = 'none'; // Hide "Read Rules" button
}

// Function to accept the rules and show the name input section
function acceptRules() {
  document.querySelector('.rules-section').style.display = 'none'; // Hide rules section
  document.querySelector('.name-input-section').style.display = 'block'; // Show name input
}

// Function to start the game after name entry
function startGame() {
    let playerName = document.querySelector('#player-name').value;
    localStorage.setItem("playerName", playerName);
  
    // Basic profanity check before proceeding
    if (!checkProfanity(playerName)) {
      return;
    }
  
    // Redirect to the game page (game.html)
    window.location.href = 'game.html';
  }
  