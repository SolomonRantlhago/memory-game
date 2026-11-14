# Memory Game

A single-player memory (pairs) game built with vanilla JavaScript and plain DOM elements. No canvas, no game framework. Built test-first with Jasmine.

## How to play

1. Choose the number of rows and columns for the board, then press **Start**.
2. Click a card to flip it, then click a second card.
3. If the two images match, they stay face up. If not, they flip back.
4. Match every pair to win. You'll see your time and number of moves.
5. Use **Play Again** to start over, or **Exit** to leave the game.

Board rules:

- Rows and columns must each be between 2 and 6.
- Rows × columns must be an even number and no more than 12 (there are 6 images, so at most 6 pairs).
- On each game the images are chosen and shuffled at random, so the layout is different every time.

## Features

- Single-player game with a configurable grid
- Random shuffling of image pairs
- Match / no-match feedback
- Timer and move counter
- Restart button, plus Play Again / Exit on the win screen

## Tech

- Vanilla JavaScript (DOM manipulation only)
- Bootstrap 5 (loaded from CDN) for layout and modals
- Webpack to bundle `src/` into `dist/bundle.js`
- Jasmine + jsdom for unit tests, using spies and a mocked clock

## Getting started

Requires [Node.js](https://nodejs.org/) and npm.

```bash
git clone <repo-url>
cd memory_game
npm install
npm run build
```

Then open `index.html` in your browser. (An internet connection is needed to load Bootstrap from the CDN.)

## Running the tests

```bash
npm test
```

This runs the Jasmine specs in `spec/` (17 specs). Tests run in a random order.

What the tests cover:

| Area | What is tested |
| --- | --- |
| Shuffling | `shuffleImages` returns each image twice, in random order |
| Board | Grid items are created and the board is initialised |
| Matching | `checkMatch` adds `match` / `un-match` classes and counts matches |
| Card clicks | Clicking a card reveals its image |
| Game state | `startGame` resets state correctly |
| Validation | Errors for missing values, odd products, and more than 12 cells |
| Timer & moves | Timer ticks, moves counter updates, timer stops on win |
| Buttons | Start, Restart, Play Again and Exit behave correctly |
| Win screen | Congratulations modal is shown when all pairs are matched |

Mocks and spies:

- `jasmine.clock()` controls `setTimeout` / `setInterval` so timing is tested without waiting.
- `jasmine.createSpy()` stands in for the Bootstrap `Modal`.
- `spyOn(window, "redirect")` checks the Exit button without leaving the page.

## Project structure

```
memory_game/
├── index.html              # Game page (start modal, board, win modal)
├── exit.html               # "Thank you for playing" page
├── images/                 # Card images (1.jpg – 6.jpg)
├── src/
│   ├── index.js            # Game logic and event listeners
│   ├── helper_objects.js   # Shared state, class names, messages, element IDs
│   └── index.css           # Styles
├── spec/
│   ├── index_spec.js       # Jasmine tests
│   ├── helpers/setup_dom.js  # Loads index.html into jsdom for tests
│   └── support/jasmine.json  # Jasmine config
├── dist/bundle.js          # Webpack output
└── webpack.config.js
```

## Scripts

| Command | Description |
| --- | --- |
| `npm test` | Run the Jasmine test suite |
| `npm run build` | Bundle `src/index.js` into `dist/bundle.js` |