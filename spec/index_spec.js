const {
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  onGridItemClick,
  checkMatch,
  startGame,
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
    const gridItem = createGridItem(image, index);
    expect(gridItem.classList.contains(classNames.columnClass)).toBe(true);

    expect(gridItem.querySelector("img").src).toContain(image);
    expect(gridItem.querySelector("img").alt).toBe(`Image ${index + 1}`);
  });
});

describe("initializeGameBoard", () => {
  it("should initialize the game board correctly", () => {
    const gameBoard = document.getElementById(elementIds.gameBoardId);
    initializeGameBoard();
    expect(gameBoard.children.length).toBe(gameState.uniqueImages.length * 2);
  });
});

describe("checkMatch", () => {
  let firstItem, secondItem;

  beforeEach(() => {
    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: jasmine.createSpy(),
      }),
    };
    firstItem = document.createElement("div");
    firstItem.dataset.image = gameState.uniqueImages[0];
    secondItem = document.createElement("div");
    secondItem.dataset.image = gameState.uniqueImages[1];
  });

  it("should add 'match' class and update matches count if images match", () => {
    secondItem.dataset.image = gameState.uniqueImages[0];

    checkMatch({ first: firstItem, second: secondItem });

    expect(firstItem.classList.contains(classNames.match)).toBe(true);
    expect(secondItem.classList.contains(classNames.match)).toBe(true);
  });

  it("should add 'un-match' class if images don't match", () => {
    checkMatch({ first: firstItem, second: secondItem });

    expect(firstItem.classList.contains(classNames.unMatch)).toBe(true);
    expect(secondItem.classList.contains(classNames.unMatch)).toBe(true);
  });

  it("should show congrats modal when all pairs are matched", () => {
    jasmine.clock().install();
    secondItem.dataset.image = gameState.uniqueImages[0];

    let result = checkMatch({
      first: firstItem,
      second: secondItem,
      matches: gameState.uniqueImages.length - 1,
    });

    expect(result).toBe(gameState.uniqueImages.length);
    jasmine.clock().tick(700);
    expect(
      document.getElementById(elementIds.congratsMessageId).textContent
    ).toBe(messages.congratsMessage);
    expect(
      document.getElementById(elementIds.congratsModalLabelId).textContent
    ).toBe(messages.congratsTitle);
    jasmine.clock().uninstall();
  });
});

describe("startGame", () => {
  it("should reset the game state correctly", () => {
    startGame();
    expect(gameState.matches).toBe(0);
    expect(gameState.firstPick).toBeNull();
    expect(gameState.secondPick).toBeNull();
  });
});

describe("onGridItemClick", () => {
  it("should add 'show' class and remove 'd-none' class from image when clicked", () => {
    const image = gameState.uniqueImages[0];
    const index = 0;
    const gridItem = createGridItem(image, index);
    const img = gridItem.querySelector("img");

    onGridItemClick({ currentTarget: gridItem });

    expect(gridItem.classList.contains(classNames.show)).toBe(true);
    expect(img.classList.contains(classNames.dNoneClass)).toBe(false);
  });
});

describe("Exit button click event", function () {
  let firstItem, secondItem, bootstrapModalShowSpy, exitButton;

  beforeEach(() => {
    firstItem = document.createElement("div");
    firstItem.dataset.image = gameState.uniqueImages[0];
    secondItem = document.createElement("div");
    secondItem.dataset.image = gameState.uniqueImages[1];

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
    secondItem.dataset.image = gameState.uniqueImages[0];

    checkMatch({
      first: firstItem,
      second: secondItem,
      matches: gameState.uniqueImages.length - 1,
    });

    jasmine.clock().tick(700);

    expect(bootstrapModalShowSpy).toHaveBeenCalled();
    exitButton.click();

    expect(window.redirect).toHaveBeenCalledWith(urls.exit);

    jasmine.clock().uninstall();
  });
});

describe("Play again button click event", function () {
  let firstItem, secondItem, bootstrapModalShowSpy, playAgainButton;

  beforeEach(() => {
    firstItem = document.createElement("div");
    firstItem.dataset.image = gameState.uniqueImages[0];
    secondItem = document.createElement("div");
    secondItem.dataset.image = gameState.uniqueImages[1];

    playAgainButton = document.getElementById(elementIds.playAgainButtonId);
    bootstrapModalShowSpy = jasmine.createSpy("show").and.callFake(() => {
      playAgainButton.addEventListener("click", () => {
        initializeGameBoard();
        startGame();
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
    secondItem.dataset.image = gameState.uniqueImages[0];

    checkMatch({
      first: firstItem,
      second: secondItem,
      matches: gameState.uniqueImages.length - 1,
    });

    jasmine.clock().tick(700);
    playAgainButton.click();
    expect(bootstrapModalShowSpy).toHaveBeenCalled();

    expect(gameState.matches).toBe(0);
    expect(gameState.firstPick).toBeNull();
    expect(gameState.secondPick).toBeNull();

    jasmine.clock().uninstall();
  });
});
