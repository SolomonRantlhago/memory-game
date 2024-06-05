const uniqueImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];
const totalPairs = uniqueImages.length;
const timeLimit = 60;
const timeLeftElement = document.getElementById("time-left");
let firstPick = null;
let secondPick = null;
let matches = 0;
let timer;

function shuffleImages(images) {
  return images.concat(images).sort(() => 0.5 - Math.random());
}

function createGridItem(image, index) {
  const col = document.createElement("div");
  col.classList.add("col-6", "col-md-4", "col-lg-3", "mb-3");

  const gridItem = document.createElement("div");
  gridItem.classList.add("grid-item", "text-center");
  gridItem.dataset.image = image;
  gridItem.addEventListener("click", onGridItemClick);

  const img = document.createElement("img");
  img.src = `./images/${image}`;
  img.alt = `Image ${index + 1}`;
  img.classList.add("img-fluid", "d-none");

  gridItem.appendChild(img);
  col.appendChild(gridItem);
  return col;
}

function initializeGameBoard() {
  const gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";
  const images = shuffleImages(uniqueImages);
  images.forEach((image, index) => {
    gameBoard.appendChild(createGridItem(image, index));
  });
}

function onGridItemClick(event) {
  const gridItem = event.currentTarget;
  if (gridItem.classList.contains("show") || secondPick) {
    return;
  }

  gridItem.classList.add("show");
  gridItem.querySelector("img").classList.remove("d-none");

  if (!firstPick) {
    firstPick = gridItem;
  } else {
    secondPick = gridItem;
    setTimeout(() => {
      checkMatch(firstPick, secondPick);
    }, 700);
  }
}

window.redirect = function (destination) {
  window.location.href = destination;
};

function checkMatch(first, second, numMatches = matches) {
  let updatedMatches = numMatches;
  if (first.dataset.image === second.dataset.image) {
    first.classList.add("match");
    second.classList.add("match");
    updatedMatches += 1;
    firstPick = null;
    secondPick = null;
    if (updatedMatches === totalPairs) {
      clearInterval(timer);
      setTimeout(
        showCongratsModal,
        700,
        "Congratulations! You matched all the pairs!",
        "Congratulations!"
      );
    }
  } else {
    first.classList.add("unmatch");
    second.classList.add("unmatch");
    setTimeout(() => {
      first.classList.remove("show", "unmatch");
      second.classList.remove("show", "unmatch");
      first.querySelector("img").classList.add("d-none");
      second.querySelector("img").classList.add("d-none");
      firstPick = null;
      secondPick = null;
    }, 700);
  }
  matches = updatedMatches;
  return updatedMatches;
}

function startGame() {
  matches = 0;
  firstPick = null;
  secondPick = null;
  timeLeftElement.innerHTML = timeLimit;
  timer = setInterval(updateTimer, 700);
}

function updateTimer() {
  let currentTime = parseInt(timeLeftElement.textContent, 10);
  currentTime -= 1;
  timeLeftElement.textContent = Math.max(0, currentTime);

  if (currentTime <= 0) {
    clearInterval(timer);
    showCongratsModal("Time's up! Try again.", "Time's Up!");
  }
}

function showCongratsModal(message, title) {
  const congratsModal = new bootstrap.Modal(
    document.getElementById("congratsModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  document.getElementById("congrats-message").textContent = message;
  document.getElementById("congratsModalLabel").textContent = title;
  congratsModal.show();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("start-button").addEventListener("click", () => {
    const startModal = bootstrap.Modal.getInstance(
      document.getElementById("startModal")
    );
    startModal.hide();
    timeLeftElement.textContent = timeLimit;
    startGame();
  });

  document.getElementById("play-again-button").addEventListener("click", () => {
    const congratsModal = bootstrap.Modal.getInstance(
      document.getElementById("congratsModal")
    );
    congratsModal.hide();
    timeLeftElement.textContent = timeLimit;
    initializeGameBoard();
    startGame();
  });

  document.getElementById("exit-button").addEventListener("click", function () {
    window.redirect("exit.html");
  });

  const startModal = new bootstrap.Modal(
    document.getElementById("startModal"),
    {
      backdrop: "static",
      keyboard: false,
    }
  );
  initializeGameBoard();
  startModal.show();
});

module.exports = {
  uniqueImages,
  totalPairs,
  timeLimit,
  timeLeftElement,
  firstPick,
  secondPick,
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  onGridItemClick,
  checkMatch,
  startGame,
  updateTimer,
  showCongratsModal,
};
