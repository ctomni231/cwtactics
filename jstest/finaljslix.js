// This will hopefully be the final iteration of JSlix. The functionality that
// I want to accomplish here is:

// Everything is ran on a conveyor belt, a.k.a. every manipulation is done
// from the pixel level. This includes all color changes and pixel movements

// The order that this should be done is:
// First: All flips and rotations
// Second: All pixel movements and manipulations
// Last: All color changes and color blends

// Color blend: Only works on colors that are visible
// Cut Image: Do not include in this build.

// Memory usage is dramatically reduced. We have to check to see if two
// images are the exact same, and refer the user back to a previously stored
// image

// Speed up of the recoloring and pixel process. Make sure we do not use
// the canvas to draw an image. We need a quick and dirty image to keep the
// performance at peak.

// Each segment of loading will have a redirection array (or multi-array) for 
// reducing memory usage while storing images. Sadly, due to the way JavaScript
// works, each time a image is added it will have to be drawn in order to be 
// compared. I'm expecting a little slow down, but the memory usage should also
// decrease heavily as well.

// Current plan is having two "belts", one belt for storing the "pixel data" and
// another belt for storing the "image data". 

// The image data belt can get very large, so in order to compensate for this
// a double array should be used as a index shortcut to cut down on comparison
// timing. 

// A lot of the processes will have to be moved and/or combined in order for
// this system to work, most obvious is moving getImage (imgArray) into CanvasImage, 
// and having canvasImage fully regulate how images load.

// A system of indexes will have to be used to prevent multiple calls to loadImage
// I think a preliminary system of negative numbers should do the trick

// I think I covered everything, and the only con I can think of is a slight slowdown
// for the checks. The major pro is a reduction in memory for storage of these images.

// Request Animation Frame
// http://localhost:8000/finaljslix.html

// Set Interval
// http://localhost:8000/finaljslixold.html

// This is the timing variable of the second (setInterval)
var sec = 16;

// This is all timing variable stuff
var interval = null;
var lastTime = new Date();
var diffTime = 0;
var nowTime = 0;
var tfps = 0;
var frame = 0;
var count = 0;
var jfps = 0;
var enabledAutoCreate = false;

// Init stuff - This is the mouse storage variables
var mousex = 0;
var mousey = 0;

// --------------------------------------
// Base Functions start here
// --------------------------------------

// This runs the requestAnimationFrame form of the game
function run(){
  run(0);
}

// This runs the setInterval form of the game
function run(sec) {

  if(sec > 0 && interval != null)
		clearInterval(interval);

  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var imgStorage = document.getElementById("myCanvas");
	if(imgStorage == null){
		imgStorage = document.createElement("canvas");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "myCanvas");
	//imgStorage.setAttribute("width", w);
	//imgStorage.setAttribute("height", h);
	imgStorage.setAttribute("onmousemove", "getDimensions(event)");
  imgStorage.setAttribute("onclick", "createImage(event)");
	imgStorage.innerHTML = "Your browser does not support the HTML5 canvas tag.";

  if (sec > 0)
    interval = setInterval(runGame, sec);
  else
    requestAnimationFrame(runFrame);
}

// Supplementary runner for running a requestAnimationFrame
function runFrame() {
  runGame();
  requestAnimationFrame(runFrame);
}

// Gets the location of the mouse
function getDimensions(event){
	mousex = event.clientX - 8;
	mousey = event.clientY - 8;
}

// ----------------------------------
// Create Image Function
// ----------------------------------

// Creates the image specified
function createImage(event){
	var text = document.getElementById("textBox");

	intArray.push(viewArray.length);
	mxArray.push(mousex);
	myArray.push(mousey);

	// Chances are very high that the recoloring code 
	// and flip code will happen here from now on.
	addImage(text.value);
}

// The true rendering function
function render(ctx){
	step++;
	if( step == 3 ) step = 0;

  // For animation testing
	for(var i = 0; i < intArray.length; i++){
		ctx.drawImage(getImg(intArray[i]), step*32, 0, 32, 32, mxArray[i], myArray[i], 32, 32);
	}

  // For ratation testing only
  //for(var i = 0; i < intArray.length; i++){
    //ctx.drawImage(getImg(intArray[i]), mxArray[i], myArray[i]);
  //}
}

// -----------------------------------
// Auto Create Code Here - Blackcat
// -----------------------------------

function stopAutoCreate() {
  enabledAutoCreate = false;
}

function startAutoCreate() {
  enabledAutoCreate = true;
  autoCreate();
}

function autoCreate() {
  var c = document.getElementById("myCanvas");

  // fake event to act like a mouse
  getDimensions({
    clientX: parseInt(Math.random() * c.width, 10),
    clientY: parseInt(Math.random() * c.height, 10)
  });
  createImage({});

  enabledAutoCreate && setTimeout(autoCreate, 10);
}

// -------------------------------------------------
// This is the game loop engine itself
// -------------------------------------------------
function runGame() {

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  render(ctx);

  // Keeps track of the FPS
  var nowTime = new Date().getTime();
  var diffTime = nowTime - lastTime;
  tfps = parseInt(1000 / (diffTime || 1), 10);
  frame += diffTime;
  count++;
  if(frame > 1000){
	   frame -= 1000;
	   jfps = count;
	   count = 0;
  }

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, 100, 40);
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 4, 10);
  ctx.fillText('Mouse:(' + mousex + ',' + mousey + ')' , 4, 20);
  ctx.fillText('Image Count:' + intArray.length, 4, 30);

  lastTime = nowTime;
}





// --------------------------------
// Code by Simon Willison
// --------------------------------

function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

