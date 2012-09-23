console.log('building cwt web client');

var jsthings = [
  "main.js",
  "model/images.js",
  "controller/draw.js",
  "controller/input.js",
  "controller/menu.js",
  "controller/plugins.js",
  "controller/screen.js",
  "plugins/touchControls.js",
  "plugins/keyboardControls.js"
];

var cssthings = [
  "webClient.css"
];

var copythings = [
  "webClient.html",
  "testMap.js"
];

var builder = require('./build.js');
builder.buildAndWrite(jsthings,'jsBin/nightly/webClient',"srcWebClient");
builder.fileConc(cssthings,'jsBin/nightly/webClient.css',"srcWebClient");
builder.fileCopy(copythings,'jsBin/nightly',"srcWebClient");
builder.fileCopy(["webClientGraphics.js"],'jsBin/nightly',"image");

