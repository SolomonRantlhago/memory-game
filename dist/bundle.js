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

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module) => {

eval("const uniqueImages = [\"1.jpg\", \"2.jpg\", \"3.jpg\", \"4.jpg\", \"5.jpg\", \"6.jpg\"];\nconst totalPairs = uniqueImages.length;\nconst timeLimit = 60;\nconst timeLeftElement = document.getElementById(\"time-left\");\nlet firstPick = null;\nlet secondPick = null;\nlet matches = 0;\nlet timer;\n\nfunction countMatches(matches) {\n  return matches;\n}\n\nfunction shuffleImages(images) {\n  return images.concat(images).sort(() => 0.5 - Math.random());\n}\n\nfunction createGridItem(image, index) {\n  const col = document.createElement(\"div\");\n  col.classList.add(\"col-6\", \"col-md-4\", \"col-lg-3\", \"mb-3\");\n\n  const gridItem = document.createElement(\"div\");\n  gridItem.classList.add(\"grid-item\", \"text-center\");\n  gridItem.dataset.image = image;\n  gridItem.addEventListener(\"click\", onGridItemClick);\n\n  const img = document.createElement(\"img\");\n  img.src = `./images/${image}`;\n  img.alt = `Image ${index + 1}`;\n  img.classList.add(\"img-fluid\", \"d-none\");\n\n  gridItem.appendChild(img);\n  col.appendChild(gridItem);\n  return col;\n}\n\nfunction initializeGameBoard() {\n  const gameBoard = document.getElementById(\"game-board\");\n  gameBoard.innerHTML = \"\";\n  const images = shuffleImages(uniqueImages);\n  images.forEach((image, index) => {\n    gameBoard.appendChild(createGridItem(image, index));\n  });\n}\n\nfunction onGridItemClick(event) {\n  const gridItem = event.currentTarget;\n  if (gridItem.classList.contains(\"show\") || secondPick) {\n    return;\n  }\n\n  gridItem.classList.add(\"show\");\n  gridItem.querySelector(\"img\").classList.remove(\"d-none\");\n\n  if (!firstPick) {\n    firstPick = gridItem;\n  } else {\n    secondPick = gridItem;\n    setTimeout(() => {\n      checkMatch(firstPick, secondPick);\n    }, 700);\n  }\n}\nfunction countMatches(matches) {\n  return matches;\n}\n\nfunction checkMatch(first, second) {\n  let updatedMatches = countMatches(matches);\n  if (first.dataset.image === second.dataset.image) {\n    first.classList.add(\"match\");\n    second.classList.add(\"match\");\n    updatedMatches += 1;\n    firstPick = null;\n    secondPick = null;\n    if (updatedMatches === totalPairs) {\n      clearInterval(timer);\n      setTimeout(\n        showCongratsModal,\n        700,\n        \"Congratulations! You matched all the pairs!\",\n        \"Congratulations!\"\n      );\n    }\n  } else {\n    first.classList.add(\"unmatch\");\n    second.classList.add(\"unmatch\");\n    setTimeout(() => {\n      first.classList.remove(\"show\", \"unmatch\");\n      second.classList.remove(\"show\", \"unmatch\");\n      first.querySelector(\"img\").classList.add(\"d-none\");\n      second.querySelector(\"img\").classList.add(\"d-none\");\n      firstPick = null;\n      secondPick = null;\n    }, 700);\n  }\n  matches = updatedMatches;\n  return updatedMatches;\n}\n\nfunction startGame() {\n  matches = 0;\n  firstPick = null;\n  secondPick = null;\n  timeLeftElement.innerHTML = timeLimit;\n  timer = setInterval(updateTimer, 700);\n}\n\nfunction updateTimer() {\n  let currentTime = parseInt(timeLeftElement.textContent, 10);\n  currentTime -= 1;\n  timeLeftElement.textContent = Math.max(0, currentTime);\n\n  if (currentTime <= 0) {\n    clearInterval(timer);\n    showCongratsModal(\"Time's up! Try again.\", \"Time's Up!\");\n  }\n}\n\nfunction showCongratsModal(message, title) {\n  const congratsModal = new bootstrap.Modal(\n    document.getElementById(\"congratsModal\"),\n    {\n      backdrop: \"static\",\n      keyboard: false,\n    }\n  );\n  document.getElementById(\"congrats-message\").textContent = message;\n  document.getElementById(\"congratsModalLabel\").textContent = title;\n  congratsModal.show();\n}\n\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n  document.getElementById(\"start-button\").addEventListener(\"click\", () => {\n    const startModal = bootstrap.Modal.getInstance(\n      document.getElementById(\"startModal\")\n    );\n    startModal.hide();\n    timeLeftElement.textContent = timeLimit;\n    startGame();\n  });\n\n  document.getElementById(\"play-again-button\").addEventListener(\"click\", () => {\n    const congratsModal = bootstrap.Modal.getInstance(\n      document.getElementById(\"congratsModal\")\n    );\n    congratsModal.hide();\n    timeLeftElement.textContent = timeLimit;\n    initializeGameBoard();\n    startGame();\n  });\n\n  document.getElementById(\"exit-button\").addEventListener(\"click\", () => {\n    window.location.href = \"exit.html\";\n  });\n\n  const startModal = new bootstrap.Modal(\n    document.getElementById(\"startModal\"),\n    {\n      backdrop: \"static\",\n      keyboard: false,\n    }\n  );\n  initializeGameBoard();\n  startModal.show();\n});\n\nmodule.exports = {\n  uniqueImages,\n  totalPairs,\n  timeLimit,\n  timeLeftElement,\n  firstPick,\n  secondPick,\n  countMatches,\n  timer,\n  shuffleImages,\n  createGridItem,\n  initializeGameBoard,\n  onGridItemClick,\n  checkMatch,\n  startGame,\n  updateTimer,\n  showCongratsModal,\n};\n\n\n//# sourceURL=webpack://memory_game/./src/index.js?");

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