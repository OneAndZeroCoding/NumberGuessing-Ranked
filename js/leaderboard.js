// Replace this URL with your actual Google Sheets JSON endpoint
const SHEET_URL = "https://sheetdb.io/api/v1/1nph83if87gly";

// Fetch the data from the sheet and sort by score
fetch(SHEET_URL)
  .then(response => response.json())
  .then(data => {
    const sortedData = data.sort((a, b) => b.score - a.score); // Sort descending by Score
    const tbody = document.querySelector("#leaderboardTable tbody");
    console.log(sortedData);
    sortedData.forEach(player => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td data-label="Player">${player.playerName}</td>
        <td data-label="Score">${player.score}</td>
        <td data-label="Guesses">${player.guesses}</td>
        <td data-label="Time taken (s)">${player.timeTaken}</td>
        <td data-label="Range taken">${player.range}</td>
      `;

      tbody.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error fetching leaderboard data:", error);
  });
