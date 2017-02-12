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

// Okay, I should store these pixels within a double array
// Every extra image should be stored inside the pixel array
// I think the image array should only deal with the individual pixels
// That way the pixel array has the most difficult pipeline before the image is created
// So get image stores a new pixel array with the pixel manipulations
// and places where it is in the duel array
// Then the comparisons should be rather short, as well as placing new images
// Another thing about this is the recolors and pixel blends
// They should have their own image pipeline because they are small and won't be shown

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

// ImageLibrary Stuff
var view;
var imgcanvas;
var imgctx;
var imgsData;
var ctxlx = 0;
var ctxly = 0;

// Image Library Array Handling
var busy = false;
var imgQueue = [];
var viewArray = [];
var locxArray = [];
var locyArray = [];
var viewRedir = [];
var imgArray = [];
var imgReady = [];
var imgRedir = [];

// These are just for holding the test images
var step = 0;
var intArray = [];
var mxArray = [];
var myArray = [];

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

	intArray.push(imgArray.length);
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

  // For rotation testing only
  //for(var i = 0; i < intArray.length; i++){
   // ctx.drawImage(getImg(intArray[i]), mxArray[i], myArray[i]);
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
// ImageLibrary
// --------------------------------

// Stupid redirection arrays, I have to make them in storeImage

// This function adds an image from text.
function addImage(text){

	//This will combine both queue and addImage.
	if(busy){
		imgQueue.push(text);
		return;
	}

	//if(!fileExists(text)){
	////	console.log("Image not found: "+text);
	//	viewRedir.push(-1);
	//	return;
	//}
		
	busy = true;
	//This grabs an image and temporarily stores it in memory
	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	imgStorage.setAttribute("src", text);
	imgStorage.setAttribute("onload", "storeImage()");
	imgStorage.setAttribute("style", "display:none");
}

// This function is literally a callback function to actually store the image
function storeImage(){

	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");

	var canvas = document.getElementById("store");
	if(canvas == null){
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	}
	canvas.setAttribute("id", "store");
	canvas.setAttribute("width", imgStorage.width);
	canvas.setAttribute("height", imgStorage.height);
	canvas.setAttribute("style", "display:none");

	console.log("("+imgStorage.width+","+imgStorage.height+")");

	var ctx = canvas.getContext("2d");
	ctx.drawImage(imgStorage, 0, 0);
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	var redir = false;
	//We have to check to see if this was created before, and if so, set up a redirection
	for(var i = 0, j; i < viewArray.length; i++){
		if(imgData.data.length == viewArray[i].length){
			for(j = 0; j < viewArray[i].length; j++){
				if(imgData.data[j] != viewArray[i][j]){
					break;
				}
			}
			if(j == viewArray[i].length){
				viewRedir.push(i);
				redir = true;
				break;
			}
		}
	}
	
	
	//This pushes the images into an array
	if(!redir){
		viewRedir.push(viewArray.length);
		viewArray.push(new Uint8ClampedArray(imgData.data));
		locxArray.push(imgStorage.width);
		locyArray.push(imgStorage.height);
		imgArray.push(new Image());
		imgReady.push(false);
		//imgRedir.push(-1);
	}
		
	busy = false;
	if(imgQueue.length > 0){
		addImage(imgQueue.pop());
	}
}

// The number inserted here must be pure (from viewRedir)
function canvasImg(num){

	// Holds to see if the size of the ctx changed 
	var ctxChange = false;
	
	//If we have a new image
	if(num >= 0 && num < viewArray.length){
		view = viewArray[num];
		
		if(ctxlx != locxArray[num] || ctxly != locyArray[num]){
			ctxlx = locxArray[num];
			ctxly = locyArray[num];
			ctxChange = true;
		}
		
	}else{
		view = null;
		if(ctxlx != 100 || ctxly != 100){
			ctxlx = 100;
			ctxly = 100;
			ctxChange = true;
		}
	}
	
	//This makes a canvas storage module for the image
	if(ctxChange){
		imgcanvas = document.getElementById("store");
		if(imgcanvas == null){
			imgcanvas = document.createElement("canvas");
			document.body.appendChild(imgcanvas);
		}
		imgcanvas.setAttribute("id", "store");
		imgcanvas.setAttribute("width", ctxlx);
		imgcanvas.setAttribute("height", ctxly);
		imgcanvas.setAttribute("style", "display:none");
		imgctx = imgcanvas.getContext("2d");
		imgsData = imgctx.createImageData(ctxlx, ctxly);
	}else{
		imgctx.clearRect(0, 0, ctxlx, ctxly);
	}

	if(view == null){
		for (var i = 0; i < imgsData.data.length; i += 4){
			imgsData.data[i+0] = 255;//255
			imgsData.data[i+1] = 0;//255
			imgsData.data[i+2] = 0;//255
			imgsData.data[i+3] = 100;//0
		}
	}else{
		for (var i = 0; i < imgsData.data.length; i+=8){
			imgsData.data[i] = view[i];
			imgsData.data[i+1] = view[i+1];
			imgsData.data[i+2] = view[i+2];
			imgsData.data[i+3] = view[i+3];
			imgsData.data[i+4] = view[i+4];
			imgsData.data[i+5] = view[i+5];
			imgsData.data[i+6] = view[i+6];
			imgsData.data[i+7] = view[i+7];
		}
	}
	
	//Draws the image
	imgctx.putImageData(imgsData,0,0);

	return imgcanvas;
}

// The getImage stuff - to get rid of the slow time of Internet Explorer
function getImg(num){
	
	// If this is an image out of range
	//if(num < 0 || num >= viewRedir.length){
	//	return canvasImg(num);
	//}
	
	//Change the number to the viewRedirection
	//num = viewRedir[num];
	
	// Makes a new Image if one does not exist yet
	//if(imgRedir[num] == -1){
	//	imgRedir[num] = imgArray.length;
	//	imgArray.push(new Image());
	//	imgReady.push(false);
	//}
	
	// Makes sure that we get the correct image
	//num = imgRedir[num];
	
	if(!imgReady[num]){	
		addLoadEvent(num);
		return canvasImg(num);
	}

	return imgArray[num];
}

// This function loads an image into memory
function loadImage(num){
	var tempImg = new Image();
	tempImg.onload = function(){
		imgArray[num].src = this.src;
		if(this.height == locyArray[num] && this.width == locxArray[num]){
			imgReady[num] = true;
		}
	};
	tempImg.src = canvasImg(num).toDataURL();
}

// This is pretty overkill to test if a file exists on the server
//function fileExists(url)
//{
//    var http = new XMLHttpRequest();
//    http.open('HEAD', url, false);
//    http.send();
 //   return http.status == 200;
//}
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

