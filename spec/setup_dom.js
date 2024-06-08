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

module.exports = { window, document };
