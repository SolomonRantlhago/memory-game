const { initializeGameBoard, startGame } = require("../src/index");
const {
  gameState,
  classNames,
  messages,
  elementIds,
  urls,
} = require("../src/helper_objects");

function selectPairs(cards) {
  const usedIndices = new Set();

  for (let i = 0; i < cards.length; i++) {
    if (usedIndices.has(i)) continue;

    const firstCard = cards[i];
    const secondCard = Array.from(cards).find((item, index) => {
      return (
        index !== i &&
        item.querySelector("img").src === firstCard.querySelector("img").src
      );
    });

    const secondCardIndex = Array.from(cards).indexOf(secondCard);

    usedIndices.add(i);
    usedIndices.add(secondCardIndex);

    firstCard.click();
    secondCard.click();

    jasmine.clock().tick(700);
  }
}

describe("Memory Game Tests", () => {
  beforeEach(() => {
    global.bootstrap = {
      Modal: jasmine.createSpy().and.returnValue({
        show: jasmine.createSpy(),
      }),
    };
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  const setupGame = () => {
    initializeGameBoard();
    startGame();
  };

  describe("createGridItem", () => {
    it("should initialize the game board with the correct number of grid items and image pairs", () => {
      initializeGameBoard();

      const gridItems = document.querySelectorAll(".grid-item");
      const images = gameState.uniqueImages;

      expect(gridItems.length).toBe(images.length * 2);

      const imageCount = {};

      gridItems.forEach((item) => {
        const img = item.querySelector("img");
        expect(img).not.toBeNull();
        const imageSrc = img.src.split("/").pop();
        imageCount[imageSrc] = (imageCount[imageSrc] || 0) + 1;
      });

      images.forEach((image) => {
        const imageSrc = image.split("/").pop();
        expect(imageCount[imageSrc]).toBe(2);
      });
    });
  });

  describe("checkMatch", () => {
    beforeEach(setupGame);

    it("should add 'match' class and update matches count if images match", () => {
      const gridItems = document.querySelectorAll(".grid-item");

      const firstCard = gridItems[0];
      const secondCard = Array.from(gridItems).find(
        (item, index) =>
          index !== 0 &&
          item.querySelector("img").src === firstCard.querySelector("img").src
      );

      firstCard.click();
      secondCard.click();

      jasmine.clock().tick(700);

      expect(firstCard.classList.contains(classNames.match)).toBe(true);
      expect(secondCard.classList.contains(classNames.match)).toBe(true);
      expect(gameState.matches).toBe(1);
    });

    it("should add 'un-match' class if images don't match", () => {
      const gridItems = document.querySelectorAll(".grid-item");
      const firstCard = gridItems[0];
      const secondCard = Array.from(gridItems).find(
        (item, index) =>
          index !== 0 &&
          item.querySelector("img").src !== firstCard.querySelector("img").src
      );

      firstCard.click();
      secondCard.click();

      jasmine.clock().tick(700);

      expect(firstCard.classList.contains(classNames.match)).toBe(false);
      expect(secondCard.classList.contains(classNames.match)).toBe(false);
      expect(gameState.matches).toBe(0);
    });
  });

  describe("showCongratsModal", () => {
    beforeEach(setupGame);

    it("should show congrats modal when all pairs are matched", () => {
      const cards = document.querySelectorAll(".grid-item");

      selectPairs(cards);

      jasmine.clock().tick(700);
      expect(
        document.getElementById(elementIds.congratsMessageId).textContent
      ).toBe(messages.congratsMessage);
      expect(
        document.getElementById(elementIds.congratsModalLabelId).textContent
      ).toBe(messages.congratsTitle);
    });
  });

  describe("onGridItemClick", () => {
    beforeEach(initializeGameBoard);

    it("should add 'show' class and remove 'd-none' class from image when clicked", () => {
      const card = document.querySelector(".grid-item");
      const img = card.querySelector("img");

      card.click();

      expect(card.classList.contains(classNames.show)).toBe(true);
      expect(img.classList.contains(classNames.dNoneClass)).toBe(false);
    });
  });

  describe("Exit button click event", () => {
    let exitButton;

    beforeEach(() => {
      setupGame();
      exitButton = document.getElementById(elementIds.exitButtonId);

      global.bootstrap = {
        Modal: jasmine.createSpy().and.returnValue({
          show: jasmine.createSpy().and.callFake(() => {
            exitButton.addEventListener("click", () => {
              window.redirect(urls.exit);
            });
          }),
        }),
      };

      spyOn(window, "redirect");
    });

    it("should redirect to exit.html when exit button is clicked", () => {
      const cards = document.querySelectorAll(".grid-item");

      selectPairs(cards);

      jasmine.clock().tick(700);
      exitButton.click();
      expect(window.redirect).toHaveBeenCalledWith(urls.exit);
    });
  });

  describe("Play again button click event", () => {
    let playAgainButton;

    beforeEach(() => {
      setupGame();
      playAgainButton = document.getElementById(elementIds.playAgainButtonId);

      global.bootstrap = {
        Modal: jasmine.createSpy().and.returnValue({
          show: jasmine.createSpy().and.callFake(() => {
            playAgainButton.addEventListener("click", () => {
              initializeGameBoard();
              startGame();
            });
          }),
        }),
      };
    });

    it("should reset the game and start again when play again button is clicked", () => {
      const cards = document.querySelectorAll(".grid-item");

      selectPairs(cards);

      jasmine.clock().tick(700);
      playAgainButton.click();

      expect(gameState.matches).toBe(0);
      expect(gameState.firstPick).toBeNull();
      expect(gameState.secondPick).toBeNull();
    });
  });
});
