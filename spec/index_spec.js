const {
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  checkMatch,
  startGame,
  resetGame,
  stopTimer,
} = require("../src/index");

const {
  gameState,
  classNames,
  messages,
  elementIds,
  urls,
} = require("../src/helper_objects");

describe("shuffleImages", () => {
  it("should shuffle images correctly", () => {
    const images = gameState.uniqueImages;
    const shuffledImages = shuffleImages(images);
    expect(shuffledImages.length).toBe(images.length * 2);
    expect(shuffledImages).not.toEqual(images);
  });
});

describe("createGridItem", () => {
  it("should create a grid item correctly", () => {
    const image = gameState.uniqueImages[0];
    const index = 0;
    const item = createGridItem(image, index).col;
    expect(item.classList.contains(classNames.columnClass)).toBe(true);
    expect(item.querySelector("img").src).toContain(image);
    expect(item.querySelector("img").alt).toBe(`Image ${index + 1}`);
  });
});

describe("initializeGameBoard", () => {
  it("should initialize the game board correctly", () => {
    const rows = 3;
    const columns = 4;
    const gameBoard = document.getElementById(elementIds.gameBoardId);
    initializeGameBoard(rows, columns);
    expect(gameBoard.children.length).toBe(rows * columns);
  });
});

describe("checkMatch", () => {
  let gridItem1;
  let index;
  let image1;
  let image2;
  beforeEach(() => {
    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: jasmine.createSpy(),
      }),
    };

    startGame();
    jasmine.clock().install();

    image1 = gameState.uniqueImages[0];
    image2 = gameState.uniqueImages[1];
    index = 0;
    gridItem1 = createGridItem(image1, index).gridItem;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });
  it("should add 'match' class and update matches count if images match", () => {
    const gridItem2 = createGridItem(image1, index).gridItem;
    gridItem1.click();
    gridItem2.click();

    jasmine.clock().tick(700);
    expect(gridItem1.classList.contains(classNames.match)).toBe(true);
    expect(gridItem2.classList.contains(classNames.match)).toBe(true);
    expect(gameState.matches).toBe(1);
    expect(gameState.moves).toBe(2);
  });

  it("should add 'un-match' class if images don't match", () => {
    const gridItem2 = createGridItem(image2, index).gridItem;

    gridItem1.click();
    gridItem2.click();

    jasmine.clock().tick(700);
    expect(gridItem1.classList.contains(classNames.match)).toBe(false);
    expect(gridItem2.classList.contains(classNames.match)).toBe(false);
    expect(gameState.matches).toBe(0);
    expect(gameState.moves).toBe(2);
  });
});

describe("showCongratsModal", () => {
  beforeEach(() => {
    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: jasmine.createSpy(),
      }),
    };
  });
  it("should show congrats modal when all pairs are matched", () => {
    jasmine.clock().install();
    const image = gameState.uniqueImages[0];
    const index = 0;
    gameState.rows = 2;
    gameState.columns = 2;
    const gridItem1 = createGridItem(image, index).gridItem;
    const gridItem2 = createGridItem(image, index).gridItem;
    startGame(2, 2);
    gridItem1.click();
    gridItem2.click();
    jasmine.clock().tick(1000);
    let result = checkMatch({
      first: gridItem1,
      second: gridItem2,
      matches: 1,
    });

    expect(result).toBe(2);
    jasmine.clock().tick(700);
    expect(
      document.getElementById(elementIds.congratsMessageId).textContent
    ).toBe(`${messages.congratsMessage} in just 1 seconds with 2 moves!.`);
    expect(
      document.getElementById(elementIds.congratsModalLabelId).textContent
    ).toBe(messages.congratsTitle);
    jasmine.clock().uninstall();
  });
});

describe("startGame", () => {
  it("should reset the game state correctly", () => {
    startGame(3, 4);

    expect(gameState.matches).toBe(0);
    expect(gameState.firstPick).toBeNull();
    expect(gameState.secondPick).toBeNull();
    expect(gameState.rows).toBe(3);
    expect(gameState.columns).toBe(4);
    expect(gameState.moves).toBe(0);
  });
});

describe("onGridItemClick", () => {
  it("should add 'show' class and remove 'd-none' class from image when clicked", () => {
    const image = gameState.uniqueImages[0];
    const index = 0;
    const gridItem = createGridItem(image, index).gridItem;
    const img = gridItem.querySelector("img");

    gridItem.click();

    expect(gridItem.classList.contains(classNames.show)).toBe(true);
    expect(img.classList.contains(classNames.dNoneClass)).toBe(false);
  });
});

describe("Exit button click event", function () {
  let exitButton;
  beforeEach(() => {
    exitButton = document.getElementById(elementIds.exitButtonId);
    bootstrapModalShowSpy = jasmine.createSpy("show").and.callFake(() => {
      exitButton.addEventListener("click", () => {
        window.redirect(urls.exit);
      });
    });

    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: bootstrapModalShowSpy,
      }),
    };

    spyOn(window, "redirect");
  });

  it("should redirect to exit.html when exit button is clicked", function () {
    jasmine.clock().install();
    const image = gameState.uniqueImages[0];
    const index = 0;
    gameState.rows = 2;
    gameState.columns = 2;
    const gridItem1 = createGridItem(image, index).gridItem;
    const gridItem2 = createGridItem(image, index).gridItem;

    checkMatch({
      first: gridItem1,
      second: gridItem2,
      matches: 1,
    });

    jasmine.clock().tick(700);

    exitButton.click();

    expect(window.redirect).toHaveBeenCalledWith(urls.exit);

    jasmine.clock().uninstall();
  });
});

describe("Play again button click event", function () {
  let playAgainButton;
  beforeEach(() => {
    playAgainButton = document.getElementById(elementIds.playAgainButtonId);
    bootstrapModalShowSpy = jasmine.createSpy("show").and.callFake(() => {
      playAgainButton.addEventListener("click", () => {
        startGame(2, 2);
      });
    });

    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: bootstrapModalShowSpy,
      }),
    };
  });
  it("should reset the game and start again when play again button is clicked", function () {
    jasmine.clock().install();
    const image = gameState.uniqueImages[0];
    const index = 0;
    gameState.rows = 2;
    gameState.columns = 2;

    const gridItem1 = createGridItem(image, index).gridItem;
    const gridItem2 = createGridItem(image, index).gridItem;

    checkMatch({
      first: gridItem1,
      second: gridItem2,
      matches: 1,
    });

    jasmine.clock().tick(700);
    playAgainButton.click();

    expect(gameState.matches).toBe(0);
    expect(gameState.firstPick).toBeNull();
    expect(gameState.secondPick).toBeNull();
    expect(gameState.rows).toBe(2);
    expect(gameState.columns).toBe(2);
    expect(gameState.timerStarted).toBe(false);
    expect(gameState.moves).toBe(0);

    jasmine.clock().uninstall();
  });
});

describe("Timer and moves functionality", () => {
  beforeEach(() => {
    jasmine.clock().install();

    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: jasmine.createSpy(),
      }),
    };
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it("should update the timer and Moves counter correctly", () => {
    const timerElement = document.getElementById(elementIds.timerId);
    const movesElement = document.getElementById(elementIds.movesId);
    startGame(3, 4);

    const image = gameState.uniqueImages[0];
    const index = 0;
    const gridItem = createGridItem(image, index).gridItem;
    gridItem.click();

    jasmine.clock().tick(30000);
    expect(timerElement.textContent).toBe("Time:00:30");
    expect(movesElement.textContent).toBe("Moves: 1");
  });

  it("should stop the timer when the game is over", () => {
    const timerElement = document.getElementById(elementIds.timerId);
    const image = gameState.uniqueImages[0];
    const index = 0;
    gameState.rows = 2;
    gameState.columns = 2;
    const gridItem1 = createGridItem(image, index).gridItem;
    const gridItem2 = createGridItem(image, index).gridItem;

    startGame(2, 2);

    gridItem1.click();

    jasmine.clock().tick(1000);

    checkMatch({
      first: gridItem1,
      second: gridItem2,
      matches: 1,
    });

    jasmine.clock().tick(2000);

    expect(timerElement.textContent).toBe("Time:00:01");
  });
});

describe("restart button click event", function () {
  it("should reset the game and start again when restart button is clicked", function () {
    const restartButton = document.getElementById(elementIds.restartButtonId);

    restartButton.addEventListener("click", () => {
      resetGame();
      startGame(2, 2);
    });
    const image = gameState.uniqueImages[0];
    const index = 0;
    gameState.rows = 2;
    gameState.columns = 2;

    const gridItem1 = createGridItem(image, index).gridItem;
    startGame(2, 2);

    gridItem1.click();

    restartButton.click();

    expect(document.getElementById(elementIds.timerId).textContent).toBe(
      "Time:00:00"
    );
    expect(document.getElementById(elementIds.movesId).textContent).toBe(
      "Moves: 0"
    );
    expect(document.getElementById(elementIds.rowValueId).textContent).toBe("");
    expect(document.getElementById(elementIds.columnValueId).textContent).toBe(
      ""
    );
    expect(document.getElementById(elementIds.gameBoardId).textContent).toBe(
      ""
    );
  });
});
