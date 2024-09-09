function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('TokenSystem');
}

const SHEET_ID = '1hASNe5hFCbNZolCwHbrk2P9GyKsVhtXz2UgZynMFyRQ'; 
const SHEET_NAME = 'Sheet1'; 

function getSheet() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  return sheet;
}

function createPlayer(playerName, playerId) {
  const sheet = getSheet();
  const dataRange = sheet.getDataRange();
  const data = dataRange.getValues();

  for (let i = 1; i < data.length; i++) { 
    if (data[i][0].toString() === playerId.toString()) {
      return 'exists'; 
    }
  }
  sheet.appendRow([playerId, playerName, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); 
  return 'created'; 
}

function checkPlayerId(playerId) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  const player = data.find(row => row[0] && row[0].toString() === playerId.toString());

  if (!player) {
    return 'not_found';
  }

  return { name: player[1], points: player[2] };
}

function updatePlayerPoints(game, playerId, points) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  let playerRow = -1;

  for (let i = 1; i < data.length; i++) { 
    if (data[i][0] == playerId) { 
      playerRow = i;
      break;
    }
  }

  if (playerRow == -1) {
    return 'Player not found';
  }

  let columnIndex;
  switch (game) {
    case 'Shoot the Hoops': columnIndex = 3; break;
    case 'Darts': columnIndex = 4; break; 
    case 'Floating Tower': columnIndex = 5; break; 
    case 'Colour Blind': columnIndex = 6; break; 
    case 'Kill the Rat': columnIndex = 7; break; 
    case 'Blow the Candle': columnIndex = 8; break;
    case 'Stack Attack | Flip the Bottle': columnIndex = 9; break;
    case 'Whisper Challenge': columnIndex = 10; break; 
    case 'Target Shoot Out': columnIndex = 11; break; 
    case 'Emoji': columnIndex = 12; break; 
    case 'Blow the Cups': columnIndex = 13; break;
    case 'Bible Trivia': columnIndex = 14; break; 
    case 'BackupStall1': columnIndex = 15; break; 
    case 'BackupStall2': columnIndex = 16; break; 
    case 'BackupStall3': columnIndex = 17; break; 
    default: return 'Invalid game';
  }

  const currentScore = sheet.getRange(playerRow + 1, columnIndex + 1).getValue() || 0;
  sheet.getRange(playerRow + 1, columnIndex + 1).setValue(currentScore + points);

  const totalPoints = (sheet.getRange(playerRow + 1, 3).getValue() || 0) + points; 
  sheet.getRange(playerRow + 1, 3).setValue(totalPoints);

  return 'success';
}

function deductPointsGift(playerId, points) {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();

  Logger.log('Player ID to deduct:', playerId);
  Logger.log('Points to deduct:', points);

  for (let i = 1; i < data.length; i++) {
    Logger.log('Checking row:', data[i]);
    if (data[i][0].toString().trim() === playerId.toString().trim()) {
      const currentPoints = data[i][2];
      Logger.log('Current points:', currentPoints);

      if (currentPoints >= points) {
        sheet.getRange(i + 1, 3).setValue(currentPoints - points);
        return { success: true, remainingPoints: currentPoints - points };
      } else {
        return { exceeds_limit: true };
      }
    }
  }
  return { not_found: true };
}
