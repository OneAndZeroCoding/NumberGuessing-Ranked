// Basic Profanity Check Function
function checkProfanity(name) {
    const profanities = ['badword1', 'badword2', 'badword3']; // Example list
    for (let word of profanities) {
      if (name.toLowerCase().includes(word)) {
        alert("Inappropriate name detected. Please choose another.");
        return false;
      }
    }
    return true;
  }
  