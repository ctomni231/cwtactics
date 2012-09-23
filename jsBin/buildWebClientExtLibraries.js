console.log('building dependencies for cwt web client');

var jsthings = [
  "jquery-min.js",
  "animFrame.js",
  "hammer.js",
  "popup.js",
  "blackbird.js"
];

var cssthings = [
  "blackbird.css"
];

var copythings = [
  "blackbird_icons.png",
  "blackbird_panel.png"
];

var builder = require('./build.js');
builder.buildAndWrite(jsthings,'jsBin/nightly/webClientDeps',"libJs");
builder.fileConc(cssthings,'jsBin/nightly/webClientDeps.css',"libJs");
builder.fileCopy(copythings,'jsBin/nightly',"libJs");