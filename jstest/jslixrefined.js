// Since Final JSlix was not final. This will be the last attempt to make it work.
// Added in the code that allows this thing to work on Safari. 

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
 * Took out requestAnimationFrame because it does not work on Windows Safari 5.1 for
 * some odd reason. The functionality was left in comments to allow for testing using
 * that functionality. SetInterval works for all cases.
 *
 * After some research
 * --------------------
 *
 * canvas.scale() - Will be good for zooming. In order to handle layers, I'll split the
 * rendering into three separate layers:
 * - Background layer [static] - Holds the backgrounds for the game
 * - Map layer [Scaled] - Holds the map, anything in this layer is scaled up
 * - Foreground layer [Static] - Holds the foreground for the game
 * Note that the names of the layers don't matter much, if something needs to be scaled
 * then just draw it in the map layer. Layers will be further separated by slides, but
 * that manipulation is easier to show than explain (no I won't do it here).
 *
 * Stuff still to do for this
 * --------------------------
 * 
 * Draw DOM Images - This draws images directly to the DOM
 * Cut functionality is partially complete, needs error checking for position
 */

// This is the timing variable of the second (setInterval) [currently 16 = 60FPS]
var second = 16;

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

// Manipulation
var colormap = 0;
var Xflip = 0;
var Yflip = 0;
var rotate = 0;
var invert = 0;
var imgColor = [];
var blend = [];
var shift = [];
var drop = [];
var cut = [];

// Manipulation Array
var mapArray = [];
var flipXArray = [];
var flipYArray = [];
var rotateArray = [];
var imgColorArray = [];
var blendArray = [];
var shiftArray = [];
var dropArray = [];
var invertArray = [];
var cutArray = [];

// --------------------------------------
// Functions start here
// --------------------------------------

// This runs the setInterval form of the game
function run(sec) {

  // Sets it to default if not set already (Comment out for requestAnimationFrame)
  if(sec <= 0){
	sec = second;
  }//*/
	
  //Set up the color map once (this should do the trick)
  addColorMap("UnitBaseColors.png");
  /*//Uncomment to test out adding a Colored Box
  addColorBox(0,255,255,100, 64, 256);//*/
  
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

    // Comment this out if you want to run with requestAnimationFrame
	interval = setInterval(runGame, sec);
	
	/*// Un-comment this if you want to run with requestAnimationFrame
	if (sec > 0)
		interval = setInterval(runGame, sec);
	else
		requestAnimationFrame(runFrame);//*/
}

/*// Supplementary runner for running a requestAnimationFrame
function runFrame() {
  runGame();
  requestAnimationFrame(runFrame);
}//*/

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
	var icolor = document.getElementById("colorBox");
	var idarken = document.getElementById("darken");
	var itrans = document.getElementById("transparent");
	var iinvert = document.getElementById("invert");
	
	if(iflipx.checked == 1)
		addFlipX();
	if(iflipy.checked == 1)
		addFlipY();
	/*//if(irotate.checked == 1)
		addRotate90();//*/
	if(icolor.value >= 0)
		addColorChange(0, icolor.value);
	if(itrans.checked == 1)
		addBlendChange(0, 0, 0, 0, 150);
	if(idarken.checked == 1)
		addBlendChange(0, 0, 0, 0, 50);
	if(iinvert.checked == 1)
		addInvert();
	
	//manual adds here
	
	/*// Uncomment to see an example of the pixel shifts
	addPixelXShift(2, 0, 4);
	addPixelYShift(16, 16, 32);//*/
	
	/*// Uncomment to see unit pairs after the third image
	if(intArray.length > 2)
		addPixelDrop(0, 5, 5, 100);//*/
		
	/*//Uncomment if you want to see an image cut
	addCut(16,16,256,200);//*/
		
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

  /*// For rotation testing only
  for(var i = 0; i < intArray.length; i++){
    ctx.drawImage(getImg(intArray[i]), mxArray[i], myArray[i]);
  }//*/
}

// -----------------------------------------
// This starts ImageLibrary
// -----------------------------------------

// Adds a Color map (an array of recolors using UnitBaseColors.png example) for recoloring 
function addColorMap(text){
	colormap = 1;
	addImage(text);
}

// Adds a flat colored box to the list of images
// Not all too useful yet, until extra functionality is added in
function addColorBox(red, green, blue, alpha, sizex, sizey){
	
	//Simple error checking for the colors
	var boxColors = new Uint8Array([red, green, blue, alpha]);
	sizex = (sizex < 1) ? 1 : sizex;
	sizey = (sizey < 1) ? 1 : sizey;
		
	var imgcanvas = document.getElementById("store");
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "store");
	imgcanvas.setAttribute("width", sizex);
	imgcanvas.setAttribute("height", sizey);
	imgcanvas.setAttribute("style", "display:none");
	var ctx = imgcanvas.getContext("2d");
	var imgData = ctx.createImageData(sizex, sizey);	
	for (var i = 0; i < imgData.data.length; i += 4){
		imgData.data[i+0] = boxColors[0];
		imgData.data[i+1] = boxColors[1];
		imgData.data[i+2] = boxColors[2];
		imgData.data[i+3] = boxColors[3];
	}
	
	ctx.putImageData(imgData,0,0);

	addImage(imgcanvas.toDataURL());
}

// This function adds an image from text.
function addImage(text){

	/*// This checks to see if a file exists on the server first
	if(isNaN(text)){
		if(!fileExists(text)){
			console.log("Image not found: "+text);
			return;
		}
	}//*/
	
	//Add manipulations
	mapArray.push(colormap);
	colormap = 0;
	flipXArray.push(Xflip);
	Xflip = 0;
	flipYArray.push(Yflip);
	Yflip = 0;
	rotateArray.push(rotate);
	rotate = 0;
	invertArray.push(invert);
	invert = 0;
	imgColorArray.push(imgColor);
	imgColor = [];
	blendArray.push(blend);
	blend = [];
	shiftArray.push(shift);
	shift = [];
	dropArray.push(drop);
	drop = [];
	cutArray.push(cut);
	cut = [];
	
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
}

/*// This is pretty overkill to test if a file exists on the server
function fileExists(url){
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
   return http.status == 200;
}//*/

// This function is literally a callback function to actually store the image
function storeImage(){

	var i, j;
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
	var imgWidth = canvas.width;
	var imgHeight = canvas.height;
	
	//Deals with Cut Images
	var tmpCut = cutArray.shift();
	if(tmpCut.length != 0){
		imgData = ctx.getImageData(tmpCut[0], tmpCut[1], tmpCut[2], tmpCut[3]);
		imgWidth = (tmpCut[0] + tmpCut[2] > imgWidth) ? imgWidth - tmpCut[0] : tmpCut[2];
		imgHeight = (tmpCut[1] + tmpCut[3] > imgHeight) ? imgHeight - tmpCut[1] : tmpCut[3];
	}
	
	var data = new Uint8Array(imgData.data);
	var tmpColor = imgColorArray.shift();
	var tmpBlend = blendArray.shift();
	var tmpShift = shiftArray.shift();
	var tmpDrop = dropArray.shift();
	
	//Do a bunch of manipulation checks before drawing out the image
	if(flipXArray.shift() == 1)
		data = flipX(data, imgWidth, imgHeight);
	if(flipYArray.shift() == 1)
		data = flipY(data, imgWidth, imgHeight);
	if(tmpColor.length != 0){
		for(i = 0; i < tmpColor.length; i++){
			data = changeMapColor(data, tmpColor[i][0], tmpColor[i][1]);
		}
	}
	if(tmpBlend.length != 0){
		for(i = 0; i < tmpBlend.length; i++){
			data = changeBlendColor(data, tmpBlend[i][0], tmpBlend[i][1]);
		}
	}
	if(tmpDrop.length != 0){
		for(i = 0; i < tmpDrop.length; i++){
			data = dropPixels(data, imgWidth, imgHeight, tmpDrop[i][0], tmpDrop[i][1], tmpDrop[i][2], tmpDrop[i][3]);
		}
	}
	if(tmpShift.length != 0){
		for(i = 0; i < tmpShift.length; i++){
			if(tmpShift[i][0] == 0)
				data = slitIntX(data, imgWidth, imgHeight, tmpShift[i][1], tmpShift[i][2], tmpShift[i][3]);
			else
				data = slitIntY(data, imgWidth, imgHeight, tmpShift[i][1], tmpShift[i][2], tmpShift[i][3]);
		}
	}
	if(invertArray.shift() == 1)
		data = invertColors(data);
	
	// This allows Safari to reenact onload functionality
	if(imgStorage){
		imgStorage.parentNode.removeChild(imgStorage);
	}

	// Used to store things on the colormap (Have to do it after manipulations)
	if(mapArray.shift() == 1){
		imgMap.push(data);
		mapX.push(imgWidth);
		mapY.push(imgHeight);
		queueNext();
		return;
	}
	
	for(i = 0; i < viewArray.length; i++){
		// This check makes sure all images are unique
		if(imgWidth != locxArray[i] || imgHeight != locyArray[i])
			continue;
		if(data.length === viewArray[i].length){
			for(j = 0; j < viewArray[i].length; j++){
				if(data[j] != viewArray[i][j]){
					break;
				}
			}
			if(j == viewArray[i].length){
				intArray.push(i);
				queueNext();
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

	queueNext();
}

// A wrapper function for drawing the next image since the calls are getting numerous
function queueNext(){
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
// This function inverts the colors of an image
function addInvert(){
	invert = 1;
}
// Adds a single cut to an image (will overwrite previous)
// Note: Cut function ignores rotations, cuts exactly where you ask
function addCut(locx, locy, sizex, sizey){
	cut = [locx, locy, sizex, sizey];
}
// This function adds a color change to the image
function addColorChange(mapIndex, colorIndex){
	var temp = [mapIndex, colorIndex];
	imgColor.push(temp);
}
// This function adds a color blend to the image
// rgba int[0-255] = the color to blend to
// opacity int[0-100] = How much effect the blend has regular colors (rgb only)
//         int[100-200] = How much effect the blend has just alpha (a only)
//         int[200-300] = How much effect the blend has all colors (rgba)
function addBlendChange(red, green, blue, alpha, opacity){
	var blendColors = new Uint8Array([red, green, blue, alpha]);
	var temp = [blendColors, opacity];
	blend.push(temp);
}

// This gets the pixels to shift along the x-axis
// posx - How many pixels it shifts by
// posy - The position of the first shift
// repeat - positive numbers will repeat a shift every # row (where # is repeat)
//          zero and negative numbers will create a shift once at that location
function addPixelXShift(posx, posy, repeat){
	var temp = [0, posx, posy, repeat];
	shift.push(temp);
}

// This gets the pixels to shift along the x-axis
// posx - How many pixels it shifts by
// posy - The position of the first shift
// repeat - positive numbers will repeat a shift every # row (where # is repeat)
//          zero and negative numbers will create a shift once at that location
function addPixelYShift(posx, posy, repeat){
	var temp = [1, posx, posy, repeat];
	shift.push(temp);
}

// This adds a image drop to the current image
function addPixelDrop(imgIndex, posx, posy, opacity){
	var temp = [imgIndex, posx, posy, opacity];
	drop.push(temp);
}
	
// This inverts all the colors of an image
function invertColors(data){
	var i;
	var temp = new Uint8Array(data);
	for (i = 0; i < temp.length; i+=4){
		if(temp[i+3] !== 0){
			temp[i] = 255-temp[i];
			temp[i+1] = 255-temp[i+1];
			temp[i+2] = 255-temp[i+2];
		}
	}
	return temp;
}
	
// Works with canvas Image to flip image horizontally
function flipX(data, sx, sy){
  var i, j;
  var temp = new Uint8Array(data);
  for(i = 0; i < sx; i++){
    for(j = 0; j < sy; j++){
      temp[((sx-i-1)+(j*sx))*4] = data[(i+j*sx)*4];
      temp[((sx-i-1)+(j*sx))*4+1] = data[(i+j*sx)*4+1];
      temp[((sx-i-1)+(j*sx))*4+2] = data[(i+j*sx)*4+2];
      temp[((sx-i-1)+(j*sx))*4+3] = data[(i+j*sx)*4+3];
    }
  }
  return temp;
}

// Used to shift multiple pixels in a certain direction dependant on row.
// rp = repeater
function slitIntY(data, sx, sy, px, py, rp){
  var i, j;
  var temp = new Uint8Array(data);
  for(i = 0; i < sx; i++){
    if(rp < 1 && i == px || rp > 0 && i >= px && (px-i)%rp == 0){
      for(j = 0; j < sy; j++){
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
  var i, j;
  var temp = new Uint8Array(data);
  for(i = 0; i < sx; i++){
    for(j = 0; j < sy; j++){
      temp[(i+((sy-j-1)*sx))*4] = data[(i+j*sx)*4];
      temp[(i+((sy-j-1)*sx))*4+1] = data[(i+j*sx)*4+1];
      temp[(i+((sy-j-1)*sx))*4+2] = data[(i+j*sx)*4+2];
      temp[(i+((sy-j-1)*sx))*4+3] = data[(i+j*sx)*4+3];
    }
  }
  return temp;
}

// Used to shift multiple pixels in a certain direction dependant on column.
// rp = repeater
function slitIntX(data, sx, sy, px, py, rp){
  var i, j;
  var temp = new Uint8Array(data);
  for(i = 0; i < sx; i++){
      for(j = 0; j < sy; j++){
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

// This function is for changing colors for a data map 
function changeMapColor(data, mapIndex, columnIndex){
	var i, j;
	var temp = new Uint8Array(data);
	if(mapIndex >= 0 && mapIndex < imgMap.length){
		var colorData = new Uint8Array(imgMap[mapIndex]);
		if(columnIndex >= 0 && columnIndex < mapY[mapIndex]){
			for (i = 0; i < temp.length; i+=4){
				//Skip out alpha recoloring
				if(temp[i+3] === 0)
					continue;
				for(j = 0; j < mapX[mapIndex]*4; j+=4){
					if((colorData[j] == temp[i] || colorData[j]-1 == temp[i]) &&
					   (colorData[j+1] == temp[i+1] || colorData[j+1]+1 == temp[i+1]) &&
					   (colorData[j+2] == temp[i+2] || colorData[j+2]+1 == temp[i+2])){
						temp[i] = colorData[4*mapX[mapIndex]*columnIndex+j];
						temp[i+1] = colorData[4*mapX[mapIndex]*columnIndex+j+1];
						temp[i+2] = colorData[4*mapX[mapIndex]*columnIndex+j+2];
					}
				}
			}
		}
	}
	return temp;
}

// This function is for blending colors within a color map
function changeBlendColor(data, color, opacity){	
	var i;
	var temp = new Uint8Array(data);
	if(opacity >= 0 && opacity < 300){
		for (i = 0; i < temp.length; i+=4){
			// Skip out alpha recoloring
			if(temp[i+3] === 0){
				continue;
			}else if(opacity > 200){
				temp[i] += (color[0] - temp[i])*((opacity-200) / 100);
				temp[i+1] += (color[1] - temp[i+1])*((opacity-200) / 100);
				temp[i+2] += (color[2] - temp[i+2])*((opacity-200) / 100);
				temp[i+3] += (color[3] - temp[i+3])*((opacity-200)/ 100);
			}else if(opacity > 100){
				temp[i+3] += (color[3] - temp[i+3])*((opacity-100)/ 100);
			}else{
				temp[i] += (color[0] - temp[i])*(opacity / 100);
				temp[i+1] += (color[1] - temp[i+1])*(opacity / 100);
				temp[i+2] += (color[2] - temp[i+2])*(opacity / 100);
			}
		}
	}
	return temp;
}

// This function was made to drop an already existing image over one you are creating
// Uses for this are mostly for future proofing, but it may come in handy.
function dropPixels(data, sx, sy, imgID, px, py, opacity){
	var i, j;
	var temp = new Uint8Array(data);
	if(opacity >= 0 && opacity <= 100){
		for(i = 0; i < sx; i++){
			for(j = 0; j < sy; j++){
				// If I'm planning to loop through everything, I need a k!
				if(i >= px && i < px+locxArray[imgID] && j >= py && j < py+locyArray[imgID]){
					// Don't blend in transparent pixels
					if(viewArray[imgID][((i-px)+(j-py)*locxArray[imgID])*4+3] === 0)
						continue;
					temp[(i+j*sx)*4] += (viewArray[imgID][((i-px)+(j-py)*locxArray[imgID])*4] - temp[(i+j*sx)*4])*(opacity / 100);
					temp[(i+j*sx)*4+1] += (viewArray[imgID][((i-px)+(j-py)*locxArray[imgID])*4+1] - temp[(i+j*sx)*4+1])*(opacity / 100);
					temp[(i+j*sx)*4+2] += (viewArray[imgID][((i-px)+(j-py)*locxArray[imgID])*4+2] - temp[(i+j*sx)*4+2])*(opacity / 100);
					temp[(i+j*sx)*4+3] += (viewArray[imgID][((i-px)+(j-py)*locxArray[imgID])*4+3] - temp[(i+j*sx)*4+3])*(opacity / 100);			
				}
			}
		}
	}
	return temp;
}

//Canvas Image with a speed mechanic included
function canvasImg(num){

	var i, change = 0;

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
		for (i = 0; i < imgsData.data.length; i += 4){
			imgsData.data[i+0]=255;//255
			imgsData.data[i+1]=0;//255
			imgsData.data[i+2]=0;//255
			imgsData.data[i+3]=100;//0
		}
	}else{
		for (i = 0; i < imgsData.data.length; i+=8){
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

  enabledAutoCreate && setTimeout(autoCreate, 25);
}
