// Variables to store the game state
let carrots = 0;
let carrotsPerClick = 1;
let carrotsPerSecond = 0;
let multiplier = 1;
let passiveInterval = 1000; // 1 second

// Upgrade costs
let clickUpgradeCost = 10;
let passiveUpgradeCost = 20;
let multiplierUpgradeCost = 50;
let fasterPassiveUpgradeCost = 100;

// Multiplier upgrade limit
let multiplierPurchases = 0;
const maxMultiplierPurchases = 5; // Limits multiplier upgrades to x10 (5 purchases)

// Function to update the UI
function updateUI() {
  document.getElementById('carrot-counter').innerText = `Carrots: ${carrots}`;
  document.getElementById('carrots-per-click').innerText = `Carrots per click: ${carrotsPerClick * multiplier}`;
  document.getElementById('carrots-per-second').innerText = `Carrots per second: ${carrotsPerSecond * multiplier}`;
  document.getElementById('click-cost').innerText = clickUpgradeCost;
  document.getElementById('passive-cost').innerText = passiveUpgradeCost;

  if (multiplierPurchases >= maxMultiplierPurchases) {
    document.getElementById('multiplier-btn').disabled = true;
    document.getElementById('multiplier-cost').innerText = "Maxed Out";
  } else {
    document.getElementById('multiplier-cost').innerText = multiplierUpgradeCost;
  }

  document.getElementById('faster-cost').innerText = fasterPassiveUpgradeCost;
}

// Function for clicking the carrot
function clickCarrot() {
  carrots += carrotsPerClick * multiplier;
  updateUI();
  saveGame(); // Save the game after every click
}

// Function to handle upgrades
function buyUpgrade(type, cost) {
  if (carrots >= cost) {
    carrots -= cost;
    switch (type) {
      case 'click':
        carrotsPerClick += 1;
        clickUpgradeCost = Math.floor(clickUpgradeCost * 1.5);
        break;
      case 'passive':
        carrotsPerSecond += 1;
        passiveUpgradeCost = Math.floor(passiveUpgradeCost * 1.5);
        break;
      case 'multiplier':
        if (multiplierPurchases < maxMultiplierPurchases) {
          multiplier *= 2;
          multiplierPurchases += 1;
          multiplierUpgradeCost = Math.floor(multiplierUpgradeCost * 4);
          if (multiplierPurchases >= maxMultiplierPurchases) {
            document.getElementById('multiplier-btn').disabled = true;
          }
        }
        break;
      case 'fasterPassive':
        passiveInterval = Math.max(100, passiveInterval - 200);
        clearInterval(passiveGeneration);
        passiveGeneration = setInterval(() => {
          carrots += carrotsPerSecond * multiplier;
          updateUI();
          saveGame();
        }, passiveInterval);
        fasterPassiveUpgradeCost = Math.floor(fasterPassiveUpgradeCost * 2);
        break;
      default:
        break;
    }
    updateUI();
    saveGame(); // Save the game after an upgrade
  } else {
    alert("Not enough carrots!");
  }
}

// Function to handle passive carrot generation
let passiveGeneration = setInterval(() => {
  carrots += carrotsPerSecond * multiplier;
  updateUI();
  saveGame();
}, passiveInterval);

// Save the game state to local storage
function saveGame() {
  if (typeof(Storage) !== "undefined") { // Check if localStorage is supported
    const gameState = {
      carrots,
      carrotsPerClick,
      carrotsPerSecond,
      multiplier,
      passiveInterval,
      clickUpgradeCost,
      passiveUpgradeCost,
      multiplierUpgradeCost,
      fasterPassiveUpgradeCost,
      multiplierPurchases,
    };
    localStorage.setItem('carrotClickerGame', JSON.stringify(gameState));
    console.log("Game saved!"); // Debugging: confirm game save
  } else {
    console.log("Sorry, your browser does not support web storage...");
  }
}

// Load the game state from local storage
function loadGame() {
  if (localStorage.getItem('carrotClickerGame')) {
    const savedGame = JSON.parse(localStorage.getItem('carrotClickerGame'));
    if (savedGame) {
      carrots = savedGame.carrots;
      carrotsPerClick = savedGame.carrotsPerClick;
      carrotsPerSecond = savedGame.carrotsPerSecond;
      multiplier = savedGame.multiplier;
      passiveInterval = savedGame.passiveInterval;
      clickUpgradeCost = savedGame.clickUpgradeCost;
      passiveUpgradeCost = savedGame.passiveUpgradeCost;
      multiplierUpgradeCost = savedGame.multiplierUpgradeCost;
      fasterPassiveUpgradeCost = savedGame.fasterPassiveUpgradeCost;
      multiplierPurchases = savedGame.multiplierPurchases;

      clearInterval(passiveGeneration); // Clear the old interval
      passiveGeneration = setInterval(() => {
        carrots += carrotsPerSecond * multiplier;
        updateUI();
        saveGame();
      }, passiveInterval); // Restart the interval
    }
    updateUI(); // Update the UI with loaded values
    console.log("Game loaded!"); // Debugging: confirm game load
  } else {
    console.log("No saved game found.");
  }
}

// Reset the game by clearing the local storage
function resetGame() {
  localStorage.removeItem('carrotClickerGame');
  location.reload(); // Reload the page to start fresh
}

// Load the game when the page is loaded
window.onload = loadGame;