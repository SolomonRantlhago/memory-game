const {
  gameState,
  classNames,
  messages,
  elementIds,
  urls,
} = require("./helper_objects");

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
  return col;
}

function initializeGameBoard() {
  const gameBoard = document.getElementById(elementIds.gameBoardId);
  gameBoard.innerHTML = "";
  const images = shuffleImages(gameState.uniqueImages);
  images.forEach((image, index) => {
    gameBoard.appendChild(createGridItem(image, index));
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
    if (updatedMatches === gameState.uniqueImages.length) {
      setTimeout(
        () =>
          showCongratsModal({
            message: messages.congratsMessage,
            title: messages.congratsTitle,
          }),
        700
      );
    }
  } else {
    first.classList.add(classNames.unMatch);
    second.classList.add(classNames.unMatch);
    setTimeout(() => {
      first.classList.remove(classNames.show, classNames.unMatch);
      second.classList.remove(classNames.show, classNames.unMatch);
      first.querySelector("img").classList.add();
      second.querySelector("img").classList.add(classNames.dNoneClass);
    }, 700);
  }
  gameState.firstPick = null;
  gameState.secondPick = null;
  gameState.matches = updatedMatches;
  return updatedMatches;
}

function startGame() {
  gameState.matches = 0;
  gameState.firstPick = null;
  gameState.secondPick = null;
}

function showCongratsModal({ message, title }) {
  const congratsModal = new bootstrap.Modal(
    document.getElementById(elementIds.congratsModalId),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  document.getElementById(elementIds.congratsMessageId).textContent = message;
  document.getElementById(elementIds.congratsModalLabelId).textContent = title;
  congratsModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById(elementIds.startButtonId)
    .addEventListener("click", () => {
      const startModal = bootstrap.Modal.getInstance(
        document.getElementById(elementIds.startModalId)
      );
      startModal.hide();
      startGame();
    });

  document
    .getElementById(elementIds.playAgainButtonId)
    .addEventListener("click", () => {
      const congratsModal = bootstrap.Modal.getInstance(
        document.getElementById(elementIds.congratsModalId)
      );
      congratsModal.hide();
      initializeGameBoard();
      startGame();
    });

  document
    .getElementById(elementIds.exitButtonId)
    .addEventListener("click", function () {
      window.redirect(urls.exit);
    });

  const startModal = new bootstrap.Modal(
    document.getElementById(elementIds.startModalId),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  initializeGameBoard();
  startModal.show();
});

module.exports = {
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  onGridItemClick,
  checkMatch,
  startGame,
  showCongratsModal,
};
