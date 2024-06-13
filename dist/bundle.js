/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper_objects.js":
/*!*******************************!*\
  !*** ./src/helper_objects.js ***!
  \*******************************/
/***/ ((module) => {

eval("const gameState = {\n  uniqueImages: [\"1.jpg\", \"2.jpg\", \"3.jpg\", \"4.jpg\", \"5.jpg\", \"6.jpg\"],\n  firstPick: null,\n  secondPick: null,\n  matches: 0,\n};\n\nconst classNames = {\n  column: \"col-6 col-md-4 col-lg-3 mb-3\",\n  gridItem: \"grid-item text-center\",\n  img: \"img-fluid d-none\",\n  show: \"show\",\n  match: \"match\",\n  unMatch: \"un-match\",\n  columnClass: \"col-6\",\n  dNoneClass: \"d-none\",\n};\n\nconst messages = {\n  congratsMessage: \"Congratulations! You matched all the pairs!\",\n  congratsTitle: \"Congratulations!\",\n};\n\nconst elementIds = {\n  gameBoardId: \"game-board\",\n  congratsMessageId: \"congrats-message\",\n  congratsModalLabelId: \"congratsModalLabel\",\n  startButtonId: \"start-button\",\n  playAgainButtonId: \"play-again-button\",\n  exitButtonId: \"exit-button\",\n  startModalId: \"startModal\",\n  congratsModalId: \"congratsModal\",\n};\n\nconst urls = {\n  exit: \"exit.html\",\n};\nmodule.exports = { gameState, classNames, messages, elementIds, urls };\n\n\n//# sourceURL=webpack://memory_game/./src/helper_objects.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  gameState,\n  classNames,\n  messages,\n  elementIds,\n  urls,\n} = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\n\nfunction shuffleImages(images) {\n  return images.concat(images).sort(() => 0.5 - Math.random());\n}\n\nfunction createGridItem(image, index) {\n  const col = document.createElement(\"div\");\n  col.className = classNames.column;\n\n  const gridItem = document.createElement(\"div\");\n  gridItem.className = classNames.gridItem;\n  gridItem.dataset.image = image;\n  gridItem.addEventListener(\"click\", onGridItemClick);\n\n  const img = document.createElement(\"img\");\n  img.src = `./images/${image}`;\n  img.alt = `Image ${index + 1}`;\n  img.className = classNames.img;\n\n  gridItem.appendChild(img);\n  col.appendChild(gridItem);\n  return {\n    col,\n    gridItem,\n  };\n}\n\nfunction initializeGameBoard() {\n  const gameBoard = document.getElementById(elementIds.gameBoardId);\n  gameBoard.innerHTML = \"\";\n  const images = shuffleImages(gameState.uniqueImages);\n  images.forEach((image, index) => {\n    const { col } = createGridItem(image, index);\n    gameBoard.appendChild(col);\n  });\n}\nfunction onGridItemClick(event) {\n  const gridItem = event.currentTarget;\n  if (gridItem.classList.contains(classNames.show) || gameState.secondPick) {\n    return;\n  }\n\n  gridItem.classList.add(classNames.show);\n  gridItem.querySelector(\"img\").classList.remove(classNames.dNoneClass);\n\n  if (!gameState.firstPick) {\n    gameState.firstPick = gridItem;\n  } else {\n    gameState.secondPick = gridItem;\n    setTimeout(() => {\n      checkMatch({ first: gameState.firstPick, second: gameState.secondPick });\n    }, 700);\n  }\n}\n\nwindow.redirect = function (destination) {\n  window.location.href = destination;\n};\n\nfunction checkMatch({ first, second, matches = gameState.matches }) {\n  let updatedMatches = matches;\n  if (first.dataset.image === second.dataset.image) {\n    first.classList.add(classNames.match);\n    second.classList.add(classNames.match);\n    updatedMatches += 1;\n    if (updatedMatches === gameState.uniqueImages.length) {\n      setTimeout(\n        () =>\n          showCongratsModal({\n            message: messages.congratsMessage,\n            title: messages.congratsTitle,\n          }),\n        700\n      );\n    }\n  } else {\n    first.classList.add(classNames.unMatch);\n    second.classList.add(classNames.unMatch);\n    setTimeout(() => {\n      first.classList.remove(classNames.show, classNames.unMatch);\n      second.classList.remove(classNames.show, classNames.unMatch);\n      first.querySelector(\"img\").classList.add(classNames.dNoneClass);\n      second.querySelector(\"img\").classList.add(classNames.dNoneClass);\n    }, 700);\n  }\n  gameState.firstPick = null;\n  gameState.secondPick = null;\n  gameState.matches = updatedMatches;\n  return updatedMatches;\n}\n\nfunction startGame() {\n  gameState.matches = 0;\n  gameState.firstPick = null;\n  gameState.secondPick = null;\n}\n\nfunction showCongratsModal({ message, title }) {\n  const congratsModal = new bootstrap.Modal(\n    document.getElementById(elementIds.congratsModalId),\n    {\n      backdrop: \"static\",\n      keyboard: false,\n    }\n  );\n  document.getElementById(elementIds.congratsMessageId).textContent = message;\n  document.getElementById(elementIds.congratsModalLabelId).textContent = title;\n  congratsModal.show();\n}\n\nfunction setupEventListeners() {\n  const getElement = (id) => document.getElementById(id);\n  const getModalInstance = (id) => bootstrap.Modal.getInstance(getElement(id));\n\n  const startButton = () => {\n    getElement(elementIds.startButtonId).addEventListener(\"click\", () => {\n      const startModal = getModalInstance(elementIds.startModalId);\n      startModal.hide();\n      startGame();\n    });\n  };\n\n  const playAgainButton = () => {\n    getElement(elementIds.playAgainButtonId).addEventListener(\"click\", () => {\n      const congratsModal = getModalInstance(elementIds.congratsModalId);\n      congratsModal.hide();\n      initializeGameBoard();\n      startGame();\n    });\n  };\n\n  const exitButton = () => {\n    getElement(elementIds.exitButtonId).addEventListener(\"click\", () => {\n      window.redirect(urls.exit);\n    });\n  };\n\n  startButton();\n  playAgainButton();\n  exitButton();\n\n  const startModal = new bootstrap.Modal(getElement(elementIds.startModalId), {\n    backdrop: \"static\",\n    keyboard: false,\n  });\n\n  initializeGameBoard();\n  startModal.show();\n}\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n  setupEventListeners();\n});\n\nmodule.exports = {\n  shuffleImages,\n  createGridItem,\n  initializeGameBoard,\n  checkMatch,\n  startGame,\n};\n\n\n//# sourceURL=webpack://memory_game/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;