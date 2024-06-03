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
  initializeGameBoard,
  shuffleImages,
  createGridItem,
  onGridItemClick,
  checkMatch,
  startGame,
  updateTimer,
  showCongratsModal,
} = require("../src/index");

const uniqueImages = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"];

describe("shuffleImages", () => {
  it("should shuffle images correctly", () => {
    const images = ["1.jpg", "2.jpg", "3.jpg"];
    const shuffledImages = shuffleImages(images);
    expect(shuffledImages.length).toBe(images.length * 2);
    expect(new Set(shuffledImages).size).toBe(images.length);
  });
});

describe("createGridItem", () => {
  it("should create a grid item correctly", () => {
    const image = "1.jpg";
    const index = 0;
    const gridItem = createGridItem(image, index);
    expect(gridItem.classList.contains("col-6")).toBeTrue();
    expect(gridItem.querySelector("img").src).toContain(image);
    expect(gridItem.querySelector("img").alt).toBe(`Image ${index + 1}`);
  });

  it("should handle grid item click correctly", () => {
    const gameBoard = document.getElementById("game-board");
    initializeGameBoard();
    const firstItem = gameBoard.children[0].querySelector(".grid-item");
    const secondItem = gameBoard.children[1].querySelector(".grid-item");

    firstItem.click();
    expect(firstItem.classList.contains("show")).toBeTrue();

    secondItem.click();
    expect(secondItem.classList.contains("show")).toBeTrue();
  });
});

describe("InitializeGameBoard", () => {
  it("should initialize the game board correctly", () => {
    const gameBoard = document.getElementById("game-board");
    initializeGameBoard();
    expect(gameBoard.children.length).toBe(uniqueImages.length * 2);
  });
});

describe("Checkmatch", () => {
  it("should match pairs correctly", () => {
    const firstPick = document.createElement("div");
    firstPick.dataset.image = "1.jpg";
    firstPick.classList.add("grid-item");

    const secondPick = document.createElement("div");
    secondPick.dataset.image = "1.jpg";
    secondPick.classList.add("grid-item");

    spyOn(firstPick.classList, "add");
    spyOn(secondPick.classList, "add");

    checkMatch(firstPick, secondPick);

    expect(firstPick.classList.add).toHaveBeenCalledOnceWith("match");
    expect(secondPick.classList.add).toHaveBeenCalledOnceWith("match");
  });
});
