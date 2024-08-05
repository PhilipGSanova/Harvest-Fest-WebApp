function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index');
}

function createPlayer(playerId, playerName) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  sheet.appendRow([playerId, playerName, 0]);
}

function getPlayerInfo(playerId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == playerId) {
      return { name: data[i][1], points: data[i][2] };
    }
  }
  return null;
}

function updatePlayerPoints(playerId, additionalPoints) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == playerId) {
      const newPoints = data[i][2] + additionalPoints;
      sheet.getRange(i + 1, 3).setValue(newPoints);
      return true;
    }
  }
  return false;
}

function subtractPlayerPoints(playerId, subtractPoints) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] == playerId) {
      if (data[i][2] < subtractPoints) {
        return { success: false, remainingPoints: data[i][2] }; // Not enough points
      }
      const newPoints = data[i][2] - subtractPoints;
      sheet.getRange(i + 1, 3).setValue(newPoints);
      return { success: true, remainingPoints: newPoints }; // Successfully subtracted points
    }
  }
  return { success: false, remainingPoints: 0 }; // Player not found
}
