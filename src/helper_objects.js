const gameState = {
  uniqueImages: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg"],
  firstPick: null,
  secondPick: null,
  matches: 0,
  rows: 0,
  columns: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
  timerInterval: null,
  timerStarted: false,
  moves: 0,
};

const classNames = {
  column: "col-6 col-md-4 col-lg-3 mb-3",
  gridItem: "grid-item text-center",
  img: "img-fluid d-none",
  show: "show",
  match: "match",
  unMatch: "un-match",
  columnClass: "col-6",
  dNoneClass: "d-none",
};

const messages = {
  congratsMessage: "Congratulations! You matched all the pairs",
  congratsTitle: "Congratulations!",
};

const elementIds = {
  gameBoardId: "game-board",
  congratsMessageId: "congrats-message",
  congratsModalLabelId: "congratsModalLabel",
  startButtonId: "start-button",
  playAgainButtonId: "play-again-button",
  exitButtonId: "exit-button",
  startModalId: "startModal",
  congratsModalId: "congratsModal",
  rowValueId: "rowValue",
  columnValueId: "columnValue",
  errorId: "error-message",
  timerId: "timer",
  movesId: "moves",
};

const urls = {
  exit: "exit.html",
};
module.exports = { gameState, classNames, messages, elementIds, urls };
