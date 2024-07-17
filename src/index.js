const {
  gameState,
  classNames,
  messages,
  elementIds,
  urls,
} = require("./helper_objects");

function startTimer() {
  gameState.totalSeconds = 0;
  gameState.minutes = 0;
  gameState.seconds = 0;
  document.getElementById(elementIds.timerId).textContent = `Time:${String(
    gameState.minutes
  ).padStart(2, "0")}:${String(gameState.seconds).padStart(2, "0")}`;
  clearInterval(gameState.timerInterval);
  gameState.timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  clearInterval(gameState.timerInterval);
}

function updateTimer() {
  gameState.totalSeconds++;
  gameState.minutes = Math.floor(gameState.totalSeconds / 60);
  gameState.seconds = gameState.totalSeconds % 60;
  document.getElementById(elementIds.timerId).textContent = `Time:${String(
    gameState.minutes
  ).padStart(2, "0")}:${String(gameState.seconds).padStart(2, "0")}`;
}
function shuffleImages(images) {
  return images.concat(images).sort(() => 0.5 - Math.random());
}

function createGridItem(image, index) {
  const col = document.createElement("div");
  col.className = classNames.column;

  const gridItem = document.createElement("div");
  gridItem.className = classNames.gridItem;
  gridItem.dataset.image = image;
  gridItem.addEventListener("click", onGridItemClick);

  const img = document.createElement("img");
  img.src = `./images/${image}`;
  img.alt = `Image ${index + 1}`;
  img.className = classNames.img;

  gridItem.appendChild(img);
  col.appendChild(gridItem);
  return {
    col,
    gridItem,
  };
}

function initializeGameBoard(rows, columns) {
  const gameBoard = document.getElementById(elementIds.gameBoardId);
  gameBoard.innerHTML = "";

  const images = gameState.uniqueImages
    .sort(() => 0.5 - Math.random())
    .slice(0, (rows * columns) / 2);
  const shuffledImages = shuffleImages(images);
  gameBoard.style.display = "grid";
  gameBoard.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gameBoard.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;

  shuffledImages.forEach((image, index) => {
    const { col, gridItem } = createGridItem(image, index);
    if (rows === 5) {
      gridItem.style.height = "80px";
      gridItem.style.width = "80px";
    } else {
      if (rows === 6) {
        gridItem.style.height = "70px";
        gridItem.style.width = "70px";
      }
    }
    gameBoard.appendChild(col);
  });
}

function onGridItemClick(event) {
  if (!gameState.timerStarted) {
    startTimer();
    gameState.timerStarted = true;
    document.getElementById(elementIds.restartButtonContainerId).style.display =
      "flex";
  }
  const gridItem = event.currentTarget;
  if (gridItem.classList.contains(classNames.show) || gameState.secondPick) {
    return;
  }
  gridItem.classList.add(classNames.show);
  gridItem.querySelector("img").classList.remove(classNames.dNoneClass);

  if (!gameState.firstPick) {
    gameState.firstPick = gridItem;
  } else {
    gameState.secondPick = gridItem;

    document.getElementById(elementIds.gameBoardId).classList.add("no-click");
    setTimeout(() => {
      checkMatch({ first: gameState.firstPick, second: gameState.secondPick });
    }, 700);
  }

  document.getElementById(
    elementIds.movesId
  ).textContent = `Moves: ${++gameState.moves}`;
}

window.redirect = function (destination) {
  window.location.href = destination;
};

function checkMatch({ first, second, matches = gameState.matches }) {
  let updatedMatches = matches;
  if (first.dataset.image === second.dataset.image) {
    first.classList.add(classNames.match);
    second.classList.add(classNames.match);
    updatedMatches += 1;
    if (updatedMatches === (gameState.rows * gameState.columns) / 2) {
      stopTimer();
      document.getElementById(
        elementIds.restartButtonContainerId
      ).style.display = "none";
      setTimeout(() => showCongratsModal(), 700);
    }
  } else {
    first.classList.add(classNames.unMatch);
    second.classList.add(classNames.unMatch);
    setTimeout(() => {
      first.classList.remove(classNames.show, classNames.unMatch);
      second.classList.remove(classNames.show, classNames.unMatch);
      first.querySelector("img").classList.add(classNames.dNoneClass);
      second.querySelector("img").classList.add(classNames.dNoneClass);
    }, 700);
  }
  setTimeout(() => {
    document
      .getElementById(elementIds.gameBoardId)
      .classList.remove("no-click");
  }, 500);
  gameState.firstPick = null;
  gameState.secondPick = null;
  gameState.matches = updatedMatches;
  return updatedMatches;
}

function startGame(rows, columns) {
  gameState.timerStarted = false;
  gameState.matches = 0;
  gameState.firstPick = null;
  gameState.secondPick = null;
  gameState.rows = rows;
  gameState.columns = columns;
  gameState.moves = 0;
  initializeGameBoard(rows, columns);
}

function showCongratsModal() {
  const congratsModal = new bootstrap.Modal(
    document.getElementById(elementIds.congratsModalId),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  const timeString =
    gameState.minutes > 0
      ? `${gameState.minutes} minutes and ${gameState.seconds} seconds`
      : `${gameState.seconds} seconds`;

  const congratsMessageElement = document.getElementById(
    elementIds.congratsMessageId
  );
  congratsMessageElement.textContent = `${messages.congratsMessage} in just ${timeString} with ${gameState.moves} moves!.`;
  congratsMessageElement.style.fontSize = "1.2rem";
  congratsMessageElement.style.fontWeight = "bold";
  congratsMessageElement.style.color = "#28a745";

  const congratsTitleElement = document.getElementById(
    elementIds.congratsModalLabelId
  );
  congratsTitleElement.textContent = messages.congratsTitle;
  congratsTitleElement.style.fontSize = "1.5rem";
  congratsTitleElement.style.fontWeight = "bold";
  congratsTitleElement.style.color = "#007bff";

  congratsModal.show();
}
function resetGame() {
  document.getElementById(elementIds.gameBoardId).innerHTML = "";
  document.getElementById(elementIds.rowValueId).value = "";
  document.getElementById(elementIds.columnValueId).value = "";
  document.getElementById(elementIds.timerId).textContent = "Time:00:00";
  document.getElementById(elementIds.movesId).textContent = `Moves: 0`;
  document.getElementById(elementIds.restartButtonContainerId).style.display =
    "none";

  const startModal = new bootstrap.Modal(
    document.getElementById(elementIds.startModalId),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  startModal.show();
}

function validateAndStartGame(rows, columns) {
  const getElement = (id) => document.getElementById(id);
  const getModalInstance = (id) => bootstrap.Modal.getInstance(getElement(id));

  if (!rows || !columns) {
    getElement(elementIds.errorId).textContent = messages.rowsColumnsRequired;
    getElement(elementIds.errorId).style.display = "block";
  } else if (rows * columns > 12) {
    getElement(elementIds.errorId).textContent =
      messages.rowsColumnsGreaterThan12;
    getElement(elementIds.errorId).style.display = "block";
  } else if ((rows * columns) % 2 !== 0) {
    getElement(elementIds.errorId).textContent = messages.rowsColumnsEven;
    getElement(elementIds.errorId).style.display = "block";
  } else {
    getElement(elementIds.errorId).style.display = "none";
    const startModal = getModalInstance(elementIds.startModalId);
    startModal.hide();
    startGame(rows, columns);
  }
}

function setupEventListeners() {
  const getElement = (id) => document.getElementById(id);
  const getModalInstance = (id) => bootstrap.Modal.getInstance(getElement(id));

  const startButton = () => {
    getElement(elementIds.startButtonId).addEventListener("click", () => {
      const rows = parseInt(getElement(elementIds.rowValueId).value, 10);
      const columns = parseInt(getElement(elementIds.columnValueId).value, 10);

      validateAndStartGame(rows, columns);
    });
  };

  const playAgainButton = () => {
    getElement(elementIds.playAgainButtonId).addEventListener("click", () => {
      const congratsModal = getModalInstance(elementIds.congratsModalId);
      congratsModal.hide();
      resetGame();
    });
  };

  const restartButton = () => {
    getElement(elementIds.restartButtonId).addEventListener("click", () => {
      stopTimer();
      resetGame();
    });
  };

  const exitButton = () => {
    getElement(elementIds.exitButtonId).addEventListener("click", () => {
      window.redirect(urls.exit);
    });
  };

  startButton();
  playAgainButton();
  exitButton();
  restartButton();

  const startModal = new bootstrap.Modal(getElement(elementIds.startModalId), {
    backdrop: "static",
    keyboard: false,
  });

  startModal.show();
}
document.addEventListener("DOMContentLoaded", () => {
  setupEventListeners();
});

module.exports = {
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  checkMatch,
  startGame,
  resetGame,
  validateAndStartGame,
};
