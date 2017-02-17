// Since Final JSlix was not final. This will be the last attempt to make it work

/*
 * JSlixRefined
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
var blend = new Uint8ClampedArray(32);

//These are arrays that store multiple images
var viewArray = [];
var locxArray = [];
var locyArray = [];
var imgQueue = [];
var imgArray = [];
var imgReady = [];
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

// Manipulation
var Xflip = 0;
var Yflip = 0;
var rotate = 0;

// Manipulation Array
var flipXArray = [];
var flipYArray = [];
var rotateArray = [];

// --------------------------------------
// Functions start here
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

//var color = document.getElementById("colorBox");
//var iflipx = document.getElementById("flipX");
//var iflipy = document.getElementById("flipY");
//var irotate = document.getElementById("rotate90");
//It is important these manipulations are done after the checks
//due to the rotations.
//if(iflipx.checked == 1)
 // view = flipX(view, lx, ly);
//if(iflipy.checked == 1)
//  view = flipY(view, lx, ly);
//if(irotate.checked == 1)
//view = rotate90(view, lx, ly);

// Creates the image specified
function createImage(event){
	var text = document.getElementById("textBox");

	//intArray.push(viewArray.length);
	mxArray.push(mousex);
	myArray.push(mousey);

	var iflipx = document.getElementById("flipX");
	var iflipy = document.getElementById("flipY");
	//var irotate = document.getElementById("rotate90");
	
	if(iflipx.checked == 1)
		addFlipX();
	if(iflipy.checked == 1)
		addFlipY();
	/*//if(irotate.checked == 1)
		addRotate90();//*/
		
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

  // For animation testing
	for(var i = 0; i < intArray.length; i++){
		ctx.drawImage(getImg(intArray[i]), step*32, 0, 32, 32, mxArray[i], myArray[i], 32, 32);
	}//*/

  /*// For ratation testing only
  for(var i = 0; i < intArray.length; i++){
    ctx.drawImage(getImg(intArray[i]), mxArray[i], myArray[i]);
  }//*/
}

// -----------------------------------------
// This starts ImageLibrary
// -----------------------------------------

// This function adds an image from text.
function addImage(text){

	// This checks to see if a file exists on the server first
	//if(isNaN(text)){
	//	if(!fileExists(text)){
	//		console.log("Image not found: "+text);
	//		return;
	//	}
	//}
	
	//Add manipulations
	flipXArray.push(Xflip);
	Xflip = 0;
	flipYArray.push(Yflip);
	Yflip = 0;
	rotateArray.push(rotate);
	rotate = 0;
	
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
	imgStorage.setAttribute("src", isNaN(text) 
									? text : (text >= 0 && text < intArray.length) 
									? getImg(intArray[text]).src : getImg(text).toDataURL());
	imgStorage.setAttribute("onload", "storeImage()");
	imgStorage.setAttribute("onerror", "imgError(this)");
	imgStorage.setAttribute("style", "display:none");

	//Makes a new storage spot for an image
	//imgArray.push(new Image());
	//imgReady.push(-1);
}

// This is pretty overkill to test if a file exists on the server
//function fileExists(url)
//{
//    var http = new XMLHttpRequest();
//    http.open('HEAD', url, false);
 //   http.send();
 //   return http.status == 200;
//}

// This function is literally a callback function to actually store the image
function storeImage(){

	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	
	//This sets up any rotation effects we have
	var dimSwitch = rotateArray.shift();

	var canvas = document.getElementById("store");
	if(canvas == null){
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	}
	canvas.setAttribute("id", "store");
	canvas.setAttribute("style", "display:none");
	canvas.setAttribute("width", imgStorage.width);
	canvas.setAttribute("height", imgStorage.height);
	if(dimSwitch === 1){
		canvas.setAttribute("height", imgStorage.width);
		canvas.setAttribute("width", imgStorage.height);
	}
	
	console.log("("+imgStorage.width+","+imgStorage.height+")");
	
	var ctx = canvas.getContext("2d");
	if(dimSwitch === 0){
		ctx.drawImage(imgStorage, 0, 0);
	}else{
		ctx.rotate(90*Math.PI/180);
		ctx.drawImage(imgStorage, imgStorage.height, -imgStorage.height);
	}
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		
	var data = new Uint8ClampedArray(imgData.data);
	var imgWidth = canvas.width;
	var imgHeight = canvas.height;
	
	//Do a bunch of manipulation checks before drawing out the image
	if(flipXArray.shift() == 1)
		data = flipX(data, imgWidth, imgHeight);
	if(flipYArray.shift() == 1)
		data = flipY(data, imgWidth, imgHeight);

	for(var i = 0, j; i < viewArray.length; i++){
		if(data.length === viewArray[i].length){
			for(j = 0; j < viewArray[i].length; j++){
				if(data[j] != viewArray[i][j]){
					break;
				}
			}
			if(j == viewArray[i].length){
				intArray.push(i);
				busy = 0;
				if(imgQueue.length > 0){
					addImage(imgQueue.shift());
				}
				return;
			}
		}
	}
	
	intArray.push(viewArray.length);
	//This pushes the images into an array
	viewArray.push(data);
	locxArray.push(imgWidth);
	locyArray.push(imgHeight);
	imgArray.push(new Image());
	imgReady.push(-1);

	busy = 0;
	if(imgQueue.length > 0){
		addImage(imgQueue.shift());
	}
}

// This function makes an image flip by its X-axis
function addFlipX(){
	Xflip = 1;
}
// This function makes an image flip by its Y-axis
function addFlipY(){
	Yflip = 1;
}
// This function rotates an image 90 degrees
function addRotate90(){
	rotate = 1;
}

		
// Works with canvas Image to flip image horizontally
function flipX(data, sx, sy){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
    for(var j = 0; j < sy; j++){
      temp[((sx-i-1)+(j*sx))*4] = data[(i+j*sx)*4];
      temp[((sx-i-1)+(j*sx))*4+1] = data[(i+j*sx)*4+1];
      temp[((sx-i-1)+(j*sx))*4+2] = data[(i+j*sx)*4+2];
      temp[((sx-i-1)+(j*sx))*4+3] = data[(i+j*sx)*4+3];
    }
  }
  return temp;
}

// This is used to shift all pixels in a certain direction
function shiftY(data, sx, sy, py){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
      for(var j = 0; j < sy; j++){
        temp[(i+((j+py)%sy)*sx)*4] = data[(i+j*sx)*4];
        temp[(i+((j+py)%sy)*sx)*4+1] = data[(i+j*sx)*4+1];
        temp[(i+((j+py)%sy)*sx)*4+2] = data[(i+j*sx)*4+2];
        temp[(i+((j+py)%sy)*sx)*4+3] = data[(i+j*sx)*4+3];
      }
  }
  return temp;
}

// Used to shift multiple pixels in a certain direction dependant on row.
// rp = repeater
function slitIntY(data, sx, sy, px, py, rp){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
    if(rp < 1 && i == px || rp > 0 && i >= px && (px-i)%rp == 0){
      for(var j = 0; j < sy; j++){
        temp[(i+((j+py)%sy)*sx)*4] = data[(i+j*sx)*4];
        temp[(i+((j+py)%sy)*sx)*4+1] = data[(i+j*sx)*4+1];
        temp[(i+((j+py)%sy)*sx)*4+2] = data[(i+j*sx)*4+2];
        temp[(i+((j+py)%sy)*sx)*4+3] = data[(i+j*sx)*4+3];
      }
    }
  }
  return temp;
}

// Used to shift pixels in a certain direction dependant on row.
function slitY(data, sx, sy, px, py){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
    if(i == px){
      for(var j = 0; j < sy; j++){
        temp[(i+((j+py)%sy)*sx)*4] = data[(i+j*sx)*4];
        temp[(i+((j+py)%sy)*sx)*4+1] = data[(i+j*sx)*4+1];
        temp[(i+((j+py)%sy)*sx)*4+2] = data[(i+j*sx)*4+2];
        temp[(i+((j+py)%sy)*sx)*4+3] = data[(i+j*sx)*4+3];
      }
    }
  }
  return temp;
}

// Works with canvas Image to flip image vertically
function flipY(data, sx, sy){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
    for(var j = 0; j < sy; j++){
      temp[(i+((sy-j-1)*sx))*4] = data[(i+j*sx)*4];
      temp[(i+((sy-j-1)*sx))*4+1] = data[(i+j*sx)*4+1];
      temp[(i+((sy-j-1)*sx))*4+2] = data[(i+j*sx)*4+2];
      temp[(i+((sy-j-1)*sx))*4+3] = data[(i+j*sx)*4+3];
    }
  }
  return temp;
}

// This is used to shift all pixels in a certain direction
function shiftX(data, sx, sy, px){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
      for(var j = 0; j < sy; j++){
        temp[(((i+px)%sx)+j*sx)*4] = data[(i+j*sx)*4];
        temp[(((i+px)%sx)+j*sx)*4+1] = data[(i+j*sx)*4+1];
        temp[(((i+px)%sx)+j*sx)*4+2] = data[(i+j*sx)*4+2];
        temp[(((i+px)%sx)+j*sx)*4+3] = data[(i+j*sx)*4+3];
      }
  }
  return temp;
}

// Used to shift multiple pixels in a certain direction dependant on column.
// rp = repeater
function slitIntX(data, sx, sy, px, py, rp){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
      for(var j = 0; j < sy; j++){
		if(rp < 1 && j == py || rp > 0 && j >= py && (py-j)%rp == 0){
          temp[(((i+px)%sx)+j*sx)*4] = data[(i+j*sx)*4];
          temp[(((i+px)%sx)+j*sx)*4+1] = data[(i+j*sx)*4+1];
          temp[(((i+px)%sx)+j*sx)*4+2] = data[(i+j*sx)*4+2];
          temp[(((i+px)%sx)+j*sx)*4+3] = data[(i+j*sx)*4+3];
        }
      }
  }
  return temp;
}

// Used to shift pixels in a certain direction dependant on column.
function slitX(data, sx, sy, px, py){
  var temp = new Uint8ClampedArray(data);
  for(var i = 0; i < sx; i++){
      for(var j = 0; j < sy; j++){
        if(py == j){
          temp[(((i+px)%sx)+j*sx)*4] = data[(i+j*sx)*4];
          temp[(((i+px)%sx)+j*sx)*4+1] = data[(i+j*sx)*4+1];
          temp[(((i+px)%sx)+j*sx)*4+2] = data[(i+j*sx)*4+2];
          temp[(((i+px)%sx)+j*sx)*4+3] = data[(i+j*sx)*4+3];
        }
      }
  }
  return temp;
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
		if(lx !== 1 || ly !== 1){
			lx = 1;
			ly = 1;
			change = 1;
		}
	}

	//This makes a canvas storage module for the image
	if(change == 1){
		imgcanvas = document.getElementById("store");
		if(imgcanvas == null){
			imgcanvas = document.createElement("canvas");
			document.body.appendChild(imgcanvas);
		}
		imgcanvas.setAttribute("id", "store");
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

// This function handles the onError call of a dead image
function imgError(deadImg){
	deadImg.src = canvasImg(-1).toDataURL();
	deadImg.onerror = "";
	return true;
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

  enabledAutoCreate && setTimeout(autoCreate, 10);
}
