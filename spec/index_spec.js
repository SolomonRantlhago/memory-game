const { document } = require("./setup_dom");

const {
  shuffleImages,
  createGridItem,
  initializeGameBoard,
  onGridItemClick,
  checkMatch,
  startGame,
  showCongratsModal,
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
    firstItem.dataset.image = "1.jpg";
    secondItem = document.createElement("div");
    secondItem.dataset.image = "2.jpg";
  });

  it("should add 'match' class and update matches count if images match", () => {
    firstItem.dataset.image = "1.jpg";
    secondItem.dataset.image = "1.jpg";

    checkMatch({ first: firstItem, second: secondItem });

    expect(firstItem.classList.contains(classNames.match)).toBe(true);
    expect(secondItem.classList.contains(classNames.match)).toBe(true);
  });

  it("should add 'unmatch' class if images don't match", () => {
    checkMatch({ first: firstItem, second: secondItem });

    expect(firstItem.classList.contains(classNames.unMatch)).toBe(true);
    expect(secondItem.classList.contains(classNames.unMatch)).toBe(true);
  });

  it("should show congrats modal when all pairs are matched", () => {
    jasmine.clock().install();
    firstItem.dataset.image = "1.jpg";
    secondItem.dataset.image = "1.jpg";

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

describe("showCongratsModal", () => {
  beforeEach(() => {
    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: jasmine.createSpy(),
      }),
    };
  });
  it("should show congrats modal with correct message and title", () => {
    const message = "Test message";
    const title = "Test title";

    showCongratsModal({ message, title });
    expect(
      document.getElementById(elementIds.congratsMessageId).textContent
    ).toBe(message);
    expect(
      document.getElementById(elementIds.congratsModalLabelId).textContent
    ).toBe(title);
  });
});

describe("onGridItemClick", () => {
  it("should add 'show' class and remove 'd-none' class from image when clicked", () => {
    const gridItem = document.createElement("div");
    const img = document.createElement("img");
    img.classList.add(classNames.dNoneClass);
    gridItem.appendChild(img);

    onGridItemClick({ currentTarget: gridItem });

    expect(gridItem.classList.contains(classNames.show)).toBe(true);
    expect(img.classList.contains(classNames.dNoneClass)).toBe(false);
  });
});

describe("Exit button click event", function () {
  let firstItem, secondItem, bootstrapModalShowSpy, exitButton;

  beforeEach(() => {
    firstItem = document.createElement("div");
    firstItem.dataset.image = "1.jpg";
    secondItem = document.createElement("div");
    secondItem.dataset.image = "2.jpg";

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
    firstItem.dataset.image = "1.jpg";
    secondItem.dataset.image = "1.jpg";

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
    firstItem.dataset.image = "1.jpg";
    secondItem = document.createElement("div");
    secondItem.dataset.image = "2.jpg";

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
    firstItem.dataset.image = "1.jpg";
    secondItem.dataset.image = "1.jpg";

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
