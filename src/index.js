const {
  gameState,
  classNames,
  messages,
  elementIds,
  urls,
} = require("./helper_objects");

function startTimer() {
  gameState.totalseconds = 0;
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
  gameState.totalseconds++;
  gameState.minutes = Math.floor(gameState.totalseconds / 60);
  gameState.seconds = gameState.totalseconds % 60;
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
    const { col } = createGridItem(image, index);
    gameBoard.appendChild(col);
  });
}

function onGridItemClick(event) {
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
  startTimer();
  gameState.matches = 0;
  gameState.firstPick = null;
  gameState.secondPick = null;
  gameState.rows = rows;
  gameState.columns = columns;
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
  congratsMessageElement.textContent = `${messages.congratsMessage} You completed in ${timeString}.`;
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

function setupEventListeners() {
  const getElement = (id) => document.getElementById(id);
  const getModalInstance = (id) => bootstrap.Modal.getInstance(getElement(id));

  const startButton = () => {
    getElement(elementIds.startButtonId).addEventListener("click", () => {
      const rows = parseInt(getElement(elementIds.rowValueId).value, 10);
      const columns = parseInt(getElement(elementIds.columnValueId).value, 10);

      if (!rows || !columns) {
        getElement(elementIds.errorId).textContent =
          "Both row and column values are required.";
        getElement(elementIds.errorId).style.display = "block";
      } else if (rows * columns > 12) {
        getElement(elementIds.errorId).textContent =
          "The product of rows and columns should not exceed 12.";
        getElement(elementIds.errorId).style.display = "block";
      } else if ((rows * columns) % 2 !== 0) {
        getElement(elementIds.errorId).textContent =
          "The product of rows and columns should be an even number.";
        getElement(elementIds.errorId).style.display = "block";
      } else {
        getElement(elementIds.errorId).style.display = "none";
        const startModal = getModalInstance(elementIds.startModalId);
        startModal.hide();
        startGame(rows, columns);
      }
    });
  };

  const playAgainButton = () => {
    getElement(elementIds.playAgainButtonId).addEventListener("click", () => {
      const congratsModal = getModalInstance(elementIds.congratsModalId);
      congratsModal.hide();

      getElement(elementIds.rowValueId).value = "";
      getElement(elementIds.columnValueId).value = "";

      const startModal = getModalInstance(elementIds.startModalId);
      startModal.show();
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
};
