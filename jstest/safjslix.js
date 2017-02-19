// Apple Safari has unfortunately forced me to redo JSlix again
// I think saying final has jinxed this whole process

/*
 * safJSlix.js
 * A rework of jSlixRefined built to work with Safari.
 *
 * The redirect array will be there, but separate from the main process. It will only
 * get images that completely match the originals and store them in an array for quick
 * access
 *
 * We are going to mostly use realjslix to build this, with the redirection array
 * produced from finaljslix. This should give the most in speed and efficiency.
 * 
 * All manipulations to images will be done while an image is being created. This will
 * make a lot of new images, but at the very least, it will also make the images
 * load and display the fastest.
 *
 * Slit X and Slit Y will take an offset parameter so negative values can be put into
 * the position for every-other operations
 *
 * Stuff still to do for this
 * --------------------------
 * 
 * Color Functionality - We need to make an array of colors (might need to hijack addImage)
 * Shift Functionality - We need to make functionality for Shift X and Y-axis
 * Slit Functionality - We need to make functionality for Slit X and Y-axis
 * Slit Interval Functionality - We need to make functionality for Slit Interval X & Y-axis
 * Blend Functionality - We need to make functionality for the Blending of colors
 * Cut Image Functionality - We need to make functionality that allows you to slice an image
 */

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

// Init stuff - This is the mouse storage variables
var mousex = 0;
var mousey = 0;

// ImageLibrary Stuff
var view;
var lx = 0;
var ly = 0;

//These are arrays that store multiple images
var viewArray = [];
var locxArray = [];
var locyArray = [];
var imgQueue = [];
var imgArray = [];
var imgReady = [];
var imgMap = [];
var mapX = [];
var mapY = [];
var busy = 0;

// Drastically decrease copy times
var imgcanvas;
var imgctx;
var imgsData;

//animation stuff
var step = 0;

var intArray = [];
var mxArray = [];
var myArray = [];

// This runs the requestAnimationFrame form of the game
function run(){
  run(0);
}

// This runs the setInterval form of the game
function run(sec) {

  if(interval != null)
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

    interval = setInterval(runGame, sec);
}

// Gets the location of the mouse
function getDimensions(event){
	mousex = event.clientX - 8;
	mousey = event.clientY - 8;
}

// Creates the image specified
function createImage(event){
	var text = document.getElementById("textBox");

	intArray.push(viewArray.length);
	mxArray.push(mousex);
	myArray.push(mousey);
		
	addImage(text.value);
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

// The true rendering function
function render(ctx){
	step++;
	if( step == 3 ) step = 0;

  /*// For animation testing
	for(var i = 0; i < intArray.length; i++){
		ctx.drawImage(getImg(intArray[i]), step*32, 0, 32, 32, mxArray[i], myArray[i], 32, 32);
	}//*/

  // For rotation testing only
  for(var i = 0; i < intArray.length; i++){
    ctx.drawImage(getImg(intArray[i]), mxArray[i], myArray[i]);
  }//*/
}

// -----------------------------------------
// This starts ImageLibrary
// -----------------------------------------

// This function adds an image from text.
function addImage(text){
	//This will combine both queue and addImage.
	if(busy == 1){
		imgQueue.push(text);
		return;
	}
	
	busy = 1;
	//This grabs an image and temporarily stores it in memory
	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	// This pretty much makes sure that a valid value is entering for numbers
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
	
	// Lets see if removing the image forces it to do onload again 
	if(imgStorage){
		imgStorage.parentNode.removeChild(imgStorage);
	}

	//This pushes the images into an array
	viewArray.push(new Uint8Array(imgData.data));
	locxArray.push(imgStorage.width);
	locyArray.push(imgStorage.height);
	imgArray.push(new Image());
	imgReady.push(-1);
	
	busy = 0;
	if(imgQueue.length > 0){
		addImage(imgQueue.pop());
	}
}

//Canvas Image with a speed mechanic included
function canvasImg(num){

	var change = 0;

	if(num >= 0 && num < viewArray.length){
		view = viewArray[num];

		if(lx !== locxArray[num] || ly !== locyArray[num]){
			lx = locxArray[num];
			ly = locyArray[num];
			change = 1;
		}
	}else{
		view = null;
		if(lx !== 10 || ly !== 10){
			lx = 10;
			ly = 10;
			change = 1;
		}
	}

	//This makes a canvas storage module for the image
	if(change == 1){
		imgcanvas = document.getElementById("store2");
		if(imgcanvas == null){
			imgcanvas = document.createElement("canvas");
			document.body.appendChild(imgcanvas);
		}
		imgcanvas.setAttribute("id", "store2");
		imgcanvas.setAttribute("width", lx);
		imgcanvas.setAttribute("height", ly);
		imgcanvas.setAttribute("style", "display:none");
		imgctx = imgcanvas.getContext("2d");
		imgsData = imgctx.createImageData(lx,ly);
	}else{
		imgctx.clearRect(0, 0, lx, ly);
	}

	if(view == null){
		for (var i = 0; i < imgsData.data.length; i += 4){
			imgsData.data[i+0]=255;//255
			imgsData.data[i+1]=0;//255
			imgsData.data[i+2]=0;//255
			imgsData.data[i+3]=100;//0
		}
	}else{
		for (var i = 0; i < imgsData.data.length; i+=8){
			imgsData.data[i]=view[i];
			imgsData.data[i+1]=view[i+1];
			imgsData.data[i+2]=view[i+2];
			imgsData.data[i+3]=view[i+3];
			imgsData.data[i+4]=view[i+4];
			imgsData.data[i+5]=view[i+5];
			imgsData.data[i+6]=view[i+6];
			imgsData.data[i+7]=view[i+7];
		}
	}

	//Draws the image
	imgctx.putImageData(imgsData,0,0);

	return imgcanvas;
}

// The getImage stuff - to get rid of the slow time of Internet Explorer
function getImg(num){	
	if(imgReady[num] != num){
		addLoadEvent(loadImage(num));
		return canvasImg(num);
	}

	return imgArray[num];
}

function loadImage(num){
	var tempImg = new Image();
	tempImg.onload = function(){
		imgArray[num].src = this.src;
		if(this.height == locyArray[num] && this.width == locxArray[num]){
			imgReady[num] = num;
		}
	};
	tempImg.src = canvasImg(num).toDataURL();
}

// Code by Simon Willison
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

var enabledAutoCreate = false;

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

  enabledAutoCreate && setTimeout(autoCreate, 100);
}