const jsdom = require("jsdom");
const fs = require("fs");
const path = require("path");
const { JSDOM } = jsdom;

const indexPath = path.resolve(__dirname, "../index.html");
const indexContent = fs.readFileSync(indexPath, "utf-8");

const dom = new JSDOM(indexContent, {
  runScripts: "dangerously",
  resources: "usable",
});

const { window } = dom;
const { document } = window;
global.window = window;
global.document = document;

const scriptPath = path.resolve(__dirname, "../src/index.js");
require(scriptPath);

const {
  uniqueImages,
  totalPairs,
  timeLimit,
  timeLeftElement,
  firstPick,
  secondPick,
  countMatches,
  timer,
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  onGridItemClick,
  checkMatch,
  startGame,
  updateTimer,
  showCongratsModal,
} = require("../src/index");

global.bootstrap = {
  Modal: jasmine.createSpy().and.returnValue({
    show: jasmine.createSpy(),
  }),
};

describe("shuffleImages", () => {
  it("should shuffle images correctly", () => {
    const images = ["1.jpg", "2.jpg", "3.jpg"];
    const shuffledImages = shuffleImages(images);
    expect(shuffledImages.length).toBe(images.length * 2);
  });
});

describe("createGridItem", () => {
  it("should create a grid item correctly", () => {
    const image = "1.jpg";
    const index = 0;
    const gridItem = createGridItem(image, index);
    expect(gridItem.classList.contains("col-6")).toBe(true);
    expect(gridItem.querySelector("img").src).toContain(image);
    expect(gridItem.querySelector("img").alt).toBe(`Image ${index + 1}`);
  });
});

describe("InitializeGameBoard", () => {
  it("should initialize the game board correctly", () => {
    const gameBoard = document.getElementById("game-board");
    initializeGameBoard();
    expect(gameBoard.children.length).toBe(uniqueImages.length * 2);
  });
});

describe("checkMatch", () => {
  let firstItem, secondItem;

  beforeEach(() => {
    firstItem = document.createElement("div");
    firstItem.dataset.image = "1.jpg";
    secondItem = document.createElement("div");
    secondItem.dataset.image = "2.jpg";
  });

  it("should add 'match' class and update matches count if images match", () => {
    firstItem.dataset.image = "1.jpg";
    secondItem.dataset.image = "1.jpg";

    checkMatch(firstItem, secondItem);

    expect(firstItem.classList.contains("match")).toBe(true);
    expect(secondItem.classList.contains("match")).toBe(true);
  });

  it("should add 'unmatch' class and return 0 if images don't match", () => {
    checkMatch(firstItem, secondItem);

    expect(firstItem.classList.contains("unmatch")).toBe(true);
    expect(secondItem.classList.contains("unmatch")).toBe(true);
  });
  it("should clear timer and show congrats modal if all pairs are matched", () => {
    firstItem.dataset.image = "1.jpg";
    secondItem.dataset.image = "1.jpg";

    spyOn(window, "clearInterval");
    spyOn(window, "setTimeout");

    countMatches(6);
    checkMatch(firstItem, secondItem);

    expect(window.clearInterval).toHaveBeenCalled();
    expect(window.setTimeout).toHaveBeenCalledWith(
      showCongratsModal,
      700,
      "Congratulations! You matched all the pairs!",
      "Congratulations!"
    );
  });
});

describe("StartGame", () => {
  it("should start the game correctly", () => {
    startGame();
    const timeLeftElement = document.getElementById("time-left");
    expect(timeLeftElement.textContent).toBe(timeLimit.toString());
    expect(firstPick).toBeNull();
    expect(secondPick).toBeNull();
  });
});

describe("updateTimer", () => {
  it("should update the timer", () => {
    timeLeftElement.textContent = "50";
    updateTimer();
    expect(timeLeftElement.textContent).toBe("49");
  });

  it("should stop timer at 0", () => {
    timeLeftElement.textContent = "0";
    updateTimer();
    expect(timeLeftElement.textContent).toBe("0");
  });
});

describe("showCongratsModal", () => {
  it("should show congrats modal with correct message and title", () => {
    showCongratsModal("Test message", "Test title");
    expect(document.getElementById("congrats-message").textContent).toBe(
      "Test message"
    );
    expect(document.getElementById("congratsModalLabel").textContent).toBe(
      "Test title"
    );
  });
});

describe("onGridItemClick", () => {
  it("should add 'show' class and remove 'd-none' class from image when clicked", () => {
    const gridItem = document.createElement("div");
    const img = document.createElement("img");
    img.classList.add("d-none");
    gridItem.appendChild(img);

    onGridItemClick({ currentTarget: gridItem });

    expect(gridItem.classList.contains("show")).toBe(true);
    expect(img.classList.contains("d-none")).toBe(false);
  });
});
