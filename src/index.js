const uniqueImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];
const totalPairs = uniqueImages.length;
const timeLimit = 50;
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
    setTimeout(checkMatch(firstPick, secondPick), 300);
  }
}

function checkMatch(first, second) {
  if (first.dataset.image === second.dataset.image) {
    first.classList.add("match");
    second.classList.add("match");
    matches += 1;
    firstPick = null;
    secondPick = null;
    if (matches === totalPairs) {
      clearInterval(timer);
      setTimeout(
        showCongratsModal,
        300,
        "Congratulations! You matched all the pairs!",
        "Congratulations!"
      );
    }
  } else {
    first.classList.add("unmatch");
    second.classList.add("unmatch");
    setTimeout(() => {
      first.classList.remove("show", "unmatch");
      first.querySelector("img").classList.add("d-none");
      second.classList.remove("show", "unmatch");
      second.querySelector("img").classList.add("d-none");
      firstPick = null;
      secondPick = null;
    }, 300);
  }
}

function startGame() {
  matches = 0;
  firstPick = null;
  secondPick = null;
  timeLeftElement.innerHTML = timeLimit;
  timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
  let currentTime = parseInt(timeLeftElement.textContent, 10);
  currentTime -= 1;
  timeLeftElement.textContent = currentTime;
  if (currentTime <= 0) {
    clearInterval(timer);
    setTimeout(showCongratsModal, 500, "Time's up! Try again.", "Time's Up!");
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

  document.getElementById("exit-button").addEventListener("click", () => {
    window.location.href = "exit.html";
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
  initializeGameBoard,
  shuffleImages,
  createGridItem,
  onGridItemClick,
  checkMatch,
  startGame,
  updateTimer,
  showCongratsModal,
};
