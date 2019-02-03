/*
 * JSlix Image Engine
 *
 * Future: Might need to modularize this a bit
 */

 // Let's define all the constants of jslix under one function
const jslix = {

	// ImageLibrary Stuff
	view: undefined,
	lx: 0,
	ly: 0,

	//These are arrays that store multiple images
	viewArray: [],
	locxArray: [],
	locyArray: [],
	imgQueue: [],
	imgArray: [],
	imgReady: [],
	imgMap: [],
	mapX: [],
	mapY: [],
	busy: 0,

	// Drastically decrease copy times
	imgcanvas: undefined,
	imgctx: undefined,
	imgsData: undefined,

	// Manipulation
	colormap: 0,
	Xflip: 0,
	Yflip: 0,
	rotate: 0,
	invert: 0,
	refText: "",
	imgColor: [],
	blend: [],
	shift: [],
	drop: [],
	cut: [],
	ref: [],

	// Manipulation Array
	intArray: [],
	mapArray: [],
	flipXArray: [],
	flipYArray: [],
	rotateArray: [],
	imgColorArray: [],
	blendArray: [],
	shiftArray: [],
	dropArray: [],
	invertArray: [],
	cutArray: [],
	refArray: []

}

// -----------------------------------------
// This starts ImageLibrary
// -----------------------------------------

// -----------------------------------------
// Adder functions
// -----------------------------------------

// Adds a Color map (an array of recolors using UnitBaseColors.png example) for recoloring
export function addColorMap(text){
	jslix.colormap = 1;
	addImage(text);
}

// Adds a flat colored box to the list of images
// Not all too useful yet, until extra functionality is added in
export function addColorBox(red, green, blue, alpha, sizex, sizey){

	//Simple error checking for the colors
	const boxColors = new Uint8Array([red, green, blue, alpha]);
	sizex = (sizex < 1) ? 1 : sizex;
	sizey = (sizey < 1) ? 1 : sizey;

	let imgcanvas = document.getElementById("store");
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "store");
	imgcanvas.setAttribute("width", sizex);
	imgcanvas.setAttribute("height", sizey);
	imgcanvas.setAttribute("style", "display:none");
	const ctx = imgcanvas.getContext("2d");
	const imgData = ctx.createImageData(sizex, sizey);
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
export function addImage(text){

	//Add manipulations
	jslix.mapArray.push(jslix.colormap);
	jslix.colormap = 0;
	jslix.flipXArray.push(jslix.Xflip);
	jslix.Xflip = 0;
	jslix.flipYArray.push(jslix.Yflip);
	jslix.Yflip = 0;
	jslix.rotateArray.push(jslix.rotate);
	jslix.rotate = 0;
	jslix.invertArray.push(jslix.invert);
	jslix.invert = 0;
	jslix.imgColorArray.push(jslix.imgColor);
	jslix.imgColor = [];
	jslix.blendArray.push(jslix.blend);
	jslix.blend = [];
	jslix.shiftArray.push(jslix.shift);
	jslix.shift = [];
	jslix.dropArray.push(jslix.drop);
	jslix.drop = [];
	jslix.cutArray.push(jslix.cut);
	jslix.cut = [];
	jslix.ref.push((jslix.refText == "") ? text : jslix.refText);
	jslix.refText = "";

	//This will combine both queue and addImage.
	//This function has to be here to keep data integrity
	if(jslix.busy == 1){
		jslix.imgQueue.push(text);
		return;
	}

	jslix.busy = 1;

	//This grabs an image and temporarily stores it in memory
	let imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	// This pretty much makes sure that a valid value is entering for numbers
	imgStorage.setAttribute("src", (typeof text !== "number")
	  ? text : (text >= 0 && text < jslix.intArray.length)
		? getImg(jslix.intArray[text]).src : getImg(text).toDataURL());
	imgStorage.setAttribute("style", "display:none");
	imgStorage.onload = function(){
		 storeImage()
	};
	imgStorage.onerror = function(){
		 imgError(this);
	};
}

// This adds a basic image to the DOM with the name specified
// Note: this is not part of the manipulation pipeline
export function addDomImage(name, text){
	let imgStorage = document.getElementById("cwt-"+name);
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "cwt-"+name);
	// This pretty much makes sure that a valid value is entering for numbers
	imgStorage.setAttribute("src", (typeof text !== "number")
	  ? text : (text >= 0 && text < intArray.length)
	  ? getImg(intArray[text]).src : getImg(text).toDataURL());
	imgStorage.setAttribute("style", "display:none");
	imgStorage.onerror = function(){
		  imgError(this);
	};

	return imgStorage
}

// This adds a reference to a image (doesn't need to be created)
export function addReference(name, imgIndex){
	let temp = [name, imgIndex];
	jslix.refArray.push(temp);
}

// Add Attributes
// -----------------------------------

// This function makes an image flip by its X-axis
export function addFlipX(){
	jslix.Xflip = 1;
}
// This function makes an image flip by its Y-axis
export function addFlipY(){
	jslix.Yflip = 1;
}
// This function rotates an image 90 degrees
export function addRotate90(){
	jslix.rotate = 1;
}
// This function inverts the colors of an image
export function addInvert(){
	jslix.invert = 1;
}
// Adds a single cut to an image (will overwrite previous)
// Note: Cut function ignores rotations, cuts exactly where you ask
export function addCut(locx, locy, sizex, sizey){
	jslix.cut = [locx, locy, sizex, sizey];
}
// This changes the image reference  to the name specified (before addImage)
export function changeReference(name){
	jslix.refText = ((typeof name === 'string') ? name : "");
}
// This function adds a color change to the image
export function addColorChange(mapIndex, colorIndex){
	let temp = [mapIndex, colorIndex];
	jslix.imgColor.push(temp);
}
// This function adds a color blend to the image
// rgba int[0-255] = the color to blend to
// opacity int[0-100] = How much effect the blend has
// opt int[0] = RGB only
//     int[1] = ALPHA only
//     int[2] = RGBA only
export function addBlendChange(red, green, blue, alpha, opacity, opt){
	let blendColors = new Uint8Array([red, green, blue, alpha]);
	let temp = [blendColors, opacity, opt];
	jslix.blend.push(temp);
}

// This gets the pixels to shift along the x-axis
// posx - How many pixels it shifts by
// posy - The position of the first shift
// repeat - positive numbers will repeat a shift every # row (where # is repeat)
//          zero and negative numbers will create a shift once at that location
export function addPixelXShift(posx, posy, repeat){
	let temp = [0, posx, posy, repeat];
	jslix.shift.push(temp);
}

// This gets the pixels to shift along the x-axis
// posx - How many pixels it shifts by
// posy - The position of the first shift
// repeat - positive numbers will repeat a shift every # row (where # is repeat)
//          zero and negative numbers will create a shift once at that location
export function addPixelYShift(posx, posy, repeat){
	let temp = [1, posx, posy, repeat];
	jslix.shift.push(temp);
}

// This adds a image drop to the current image
export function addPixelDrop(imgIndex, posx, posy, opacity){
	let temp = [imgIndex, posx, posy, opacity];
	jslix.drop.push(temp);
}

// -----------------------------------------
// Getter functions
// -----------------------------------------

// The fastest way to get an image onscreen for testing
export function getQuickImage(text){

	// For quick testing
	return addDomImage('quick', text)
}

// This function will draw a slide image stored in the DOM
export function getDomImage(name){
	let imgStorage = document.getElementById("cwt-"+name);
	if(imgStorage == null){
		return canvasImg(-1).toDataURL();
	}
	return (imgStorage.src == null) ? canvasImg(-1).toDataURL() : imgStorage;
}

// The getImage stuff - to get rid of the slow time of Internet Explorer
export function getImg(num){
	if(jslix.imgReady[num] != num){
		addLoadEvent(loadImage(num));
		return canvasImg(num);
	}

	return jslix.imgArray[num];
}

// This is the most flexible getImg functions
export function getRefImg(ind){
	return getImg((typeof ind === "string") ? getRef(ind) : ind)
}

// Gives you an index of a referenced image
export function getRef(name){
	for(let i = 0; i < jslix.refArray.length; i++){
		if(jslix.refArray[i][0] == name)
			return jslix.refArray[i][1];
	}
	return -1
}

// -------------------------------------------
// Remove functions
// -------------------------------------------

// CLears all images from the lineup
export function removeAllImages(){
	jslix.intArray = [];
	jslix.viewArray = [];
	jslix.viewArray = [];
	jslix.locxArray = [];
	jslix.locyArray = [];
	jslix.imgArray = [];
	jslix.imgReady = [];
	jslix.refArray = [];
}

// Clears a single DOM image from the body
export function removeDOMImage(name){
	let imgStorage = document.getElementById("cwt-"+name);
	if(imgStorage != null){
		document.body.removeChild(imgStorage)
	}
}

// CLears the colormap images
export function removeAllMaps(){
	jslix.mapArray = [];
	jslix.mapX = []
	jslix.mapY = [];
}

// -----------------------------------------
// Private functions
// -----------------------------------------

// This function is literally a callback function to actually store the image
function storeImage(){

	let i, j, imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");

	//This sets up any rotation effects we have
	let dimSwitch = jslix.rotateArray.shift();
	//This sets up any cut actions we have
	let tmpCut = jslix.cutArray.shift();
	//Error check all the cut values;
	if(tmpCut.length > 0){
		tmpCut[0] = (tmpCut[0] > imgStorage.width-1) ? imgStorage.width-1 : tmpCut[0];
		tmpCut[1] = (tmpCut[1] > imgStorage.height-1) ? imgStorage.height-1 : tmpCut[1];
		tmpCut[2] = (tmpCut[0] + tmpCut[2] > imgStorage.width) ? imgStorage.width - tmpCut[0] : tmpCut[2];
		tmpCut[3] = (tmpCut[1] + tmpCut[3] > imgStorage.height) ? imgStorage.height - tmpCut[1] : tmpCut[3];
	}

	let canvas = document.getElementById("store");
	if(canvas == null){
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	}
	canvas.setAttribute("id", "store");
	canvas.setAttribute("style", "display:none");

	if(tmpCut.length > 0){
		if(dimSwitch === 0){
			canvas.setAttribute("width", tmpCut[2]);
			canvas.setAttribute("height", tmpCut[3]);
		}else{
			canvas.setAttribute("height", tmpCut[2]);
			canvas.setAttribute("width", tmpCut[3]);
		}
	}else{
		if(dimSwitch === 0){
			canvas.setAttribute("width", imgStorage.width);
			canvas.setAttribute("height", imgStorage.height);
		}else{
			canvas.setAttribute("height", imgStorage.width);
			canvas.setAttribute("width", imgStorage.height);
		}
	}

	console.log("("+canvas.width+","+canvas.height+")");

	let ctx = canvas.getContext("2d");
	if(tmpCut.length > 0){
		if(dimSwitch === 0){
			ctx.drawImage(imgStorage, tmpCut[0], tmpCut[1], tmpCut[2], tmpCut[3],
				0, 0, tmpCut[2], tmpCut[3]);
		}else{
			ctx.rotate(90*Math.PI/180);
			ctx.drawImage(imgStorage, tmpCut[0], tmpCut[1], tmpCut[2], tmpCut[3],
				0, -tmpCut[3], tmpCut[2], tmpCut[3]);
		}
	}else{
		if(dimSwitch === 0){
			ctx.drawImage(imgStorage, 0, 0);
		}else{
			ctx.rotate(90*Math.PI/180);
			ctx.drawImage(imgStorage, 0, -imgStorage.height);
		}
	}

	let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let imgWidth = canvas.width;
	let imgHeight = canvas.height;
	let data = new Uint8Array(imgData.data);
	let tmpColor = jslix.imgColorArray.shift();
	let tmpBlend = jslix.blendArray.shift();
	let tmpShift = jslix.shiftArray.shift();
	let tmpDrop = jslix.dropArray.shift();
	let tmpName = jslix.ref.shift();

	//Do a bunch of manipulation checks before drawing out the image
	if(jslix.flipXArray.shift() == 1)
		data = flipX(data, imgWidth, imgHeight);
	if(jslix.flipYArray.shift() == 1)
		data = flipY(data, imgWidth, imgHeight);
	if(tmpColor.length > 0){
		for(i = 0; i < tmpColor.length; i++){
			data = changeMapColor(data, tmpColor[i][0], tmpColor[i][1]);
		}
	}
	if(tmpBlend.length != 0){
		for(i = 0; i < tmpBlend.length; i++){
			data = changeBlendColor(data, tmpBlend[i][0], tmpBlend[i][1], tmpBlend[i][2]);
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
	if(jslix.invertArray.shift() == 1)
		data = invertColors(data);

	// This allows Safari to reenact onload functionality
	if(imgStorage){
		imgStorage.parentNode.removeChild(imgStorage);
	}

	// Used to store things on the colormap (Have to do it after manipulations)
	if(jslix.mapArray.shift() == 1){
		jslix.imgMap.push(data);
		jslix.mapX.push(imgWidth);
		jslix.mapY.push(imgHeight);
		queueNext();
		return;
	}

	addReference(tmpName, jslix.intArray.length);

	for(i = 0; i < jslix.viewArray.length; i++){
		// This check makes sure all images are unique
		if(imgWidth != jslix.locxArray[i] || imgHeight != jslix.locyArray[i])
			continue;
		if(data.length === jslix.viewArray[i].length){
			for(j = 0; j < jslix.viewArray[i].length; j++){
				if(data[j] != jslix.viewArray[i][j]){
					break;
				}
			}
			if(j == jslix.viewArray[i].length){
				jslix.intArray.push(i);
				queueNext();
				return;
			}
		}
	}

	jslix.intArray.push(jslix.viewArray.length);
	//This pushes the images into an array
	jslix.viewArray.push(data);
	jslix.locxArray.push(imgWidth);
	jslix.locyArray.push(imgHeight);
	jslix.imgArray.push(new Image());
	jslix.imgReady.push(-1);

	queueNext();
}

// A wrapper function for drawing the next image since the calls are getting numerous
function queueNext(){
	jslix.busy = 0;
	if(jslix.imgQueue.length > 0){
		addImage(jslix.imgQueue.shift());
	}
}

// This inverts all the colors of an image
function invertColors(data){
	let temp = new Uint8Array(data);
	for (let i = 0; i < temp.length; i+=4){
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
  let temp = new Uint8Array(data);
  for(let i = 0; i < sx; i++){
    for(let j = 0; j < sy; j++){
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
  let temp = new Uint8Array(data);
  for(let i = 0; i < sx; i++){
    if(rp < 1 && i == px || rp > 0 && i >= px && (px-i)%rp == 0){
      for(let j = 0; j < sy; j++){
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
  let temp = new Uint8Array(data);
  for(let i = 0; i < sx; i++){
    for(let j = 0; j < sy; j++){
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
  let temp = new Uint8Array(data);
  for(let i = 0; i < sx; i++){
      for(let j = 0; j < sy; j++){
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
	let temp = new Uint8Array(data);
	if(mapIndex >= 0 && mapIndex < jslix.imgMap.length){
		let colorData = new Uint8Array(jslix.imgMap[mapIndex]);
		if(columnIndex >= 0 && columnIndex < jslix.mapY[mapIndex]){
			for (let i = 0; i < temp.length; i+=4){
				//Skip out alpha recoloring
				if(temp[i+3] === 0)
					continue;
				for(let j = 0; j < jslix.mapX[mapIndex]*4; j+=4){
					if((colorData[j] == temp[i] || colorData[j]-1 == temp[i]) &&
					   (colorData[j+1] == temp[i+1] || colorData[j+1]+1 == temp[i+1]) &&
					   (colorData[j+2] == temp[i+2] || colorData[j+2]+1 == temp[i+2])){
						temp[i] = colorData[4*jslix.mapX[mapIndex]*columnIndex+j];
						temp[i+1] = colorData[4*jslix.mapX[mapIndex]*columnIndex+j+1];
						temp[i+2] = colorData[4*jslix.mapX[mapIndex]*columnIndex+j+2];
					}
				}
			}
		}
	}
	return temp;
}

// This function is for blending colors within a color map
function changeBlendColor(data, color, opacity, opt){
	let temp = new Uint8Array(data);
	if(opacity >= 0 && opacity <= 100){
		for (let i = 0; i < temp.length; i+=4){
			// Skip out alpha recoloring
			if(temp[i+3] === 0){
				continue;
			}
			if(opt != 1){
				temp[i] += (color[0] - temp[i])*(opacity / 100);
				temp[i+1] += (color[1] - temp[i+1])*(opacity / 100);
				temp[i+2] += (color[2] - temp[i+2])*(opacity / 100);
			}
			if(opt != 0){
				temp[i+3] += (color[3] - temp[i+3])*(opacity / 100);
			}
		}
	}
	return temp;
}

// This function was made to drop an already existing image over one you are creating
// Uses for this are mostly for future proofing, but it may come in handy.
function dropPixels(data, sx, sy, imgID, px, py, opacity){
	let temp = new Uint8Array(data);
	if(opacity >= 0 && opacity <= 100){
		for(let i = 0; i < sx; i++){
			for(let j = 0; j < sy; j++){
				// If I'm planning to loop through everything, I need a k!
				if(i >= px && i < px+jslix.locxArray[imgID] && j >= py && j < py+jslix.locyArray[imgID]){
					// Don't blend in transparent pixels
					if(jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+3] === 0)
						continue;
					temp[(i+j*sx)*4] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4] - temp[(i+j*sx)*4])*(opacity / 100);
					temp[(i+j*sx)*4+1] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+1] - temp[(i+j*sx)*4+1])*(opacity / 100);
					temp[(i+j*sx)*4+2] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+2] - temp[(i+j*sx)*4+2])*(opacity / 100);
					temp[(i+j*sx)*4+3] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+3] - temp[(i+j*sx)*4+3])*(opacity / 100);
				}
			}
		}
	}
	return temp;
}

//Canvas Image with a speed mechanic included
export function canvasImg(num){

	let i, change = 0;

	if(num >= 0 && num < jslix.viewArray.length){
		jslix.view = jslix.viewArray[num];

		if(jslix.lx !== jslix.locxArray[num] || jslix.ly !== jslix.locyArray[num]){
			jslix.lx = jslix.locxArray[num];
			jslix.ly = jslix.locyArray[num];
			change = 1;
		}
	}else{
		jslix.view = null;
		if(jslix.lx !== 1 || jslix.ly !== 1){
			jslix.lx = 1;
			jslix.ly = 1;
			change = 1;
		}
	}

	//This makes a canvas storage module for the image
	if(change == 1){
		jslix.imgcanvas = document.getElementById("store");
		if(jslix.imgcanvas == null){
			jslix.imgcanvas = document.createElement("canvas");
			document.body.appendChild(jslix.imgcanvas);
		}
		jslix.imgcanvas.setAttribute("id", "store");
		jslix.imgcanvas.setAttribute("width", jslix.lx);
		jslix.imgcanvas.setAttribute("height", jslix.ly);
		jslix.imgcanvas.setAttribute("style", "display:none");
		jslix.imgctx = jslix.imgcanvas.getContext("2d");
		jslix.imgsData = jslix.imgctx.createImageData(jslix.lx, jslix.ly);
	}else{
		jslix.imgctx.clearRect(0, 0, jslix.lx, jslix.ly);
	}

	// This is the color for an errored image
	if(jslix.view == null){
		for (i = 0; i < jslix.imgsData.data.length; i += 4){
			jslix.imgsData.data[i+0]=255;//255
			jslix.imgsData.data[i+1]=0;//255
			jslix.imgsData.data[i+2]=0;//255
			jslix.imgsData.data[i+3]=25;//0
		}
	}else{
		for (i = 0; i < jslix.imgsData.data.length; i+=8){
			jslix.imgsData.data[i]=jslix.view[i];
			jslix.imgsData.data[i+1]=jslix.view[i+1];
			jslix.imgsData.data[i+2]=jslix.view[i+2];
			jslix.imgsData.data[i+3]=jslix.view[i+3];
			jslix.imgsData.data[i+4]=jslix.view[i+4];
			jslix.imgsData.data[i+5]=jslix.view[i+5];
			jslix.imgsData.data[i+6]=jslix.view[i+6];
			jslix.imgsData.data[i+7]=jslix.view[i+7];
		}
	}

	//Draws the image
	jslix.imgctx.putImageData(jslix.imgsData,0,0);

	return jslix.imgcanvas;
}

function loadImage(num){
	var tempImg = new Image();
	tempImg.onload = function(){
		// Catches those pasky errors
		if(this.src === undefined || jslix.imgArray[num] === undefined)
			return

		jslix.imgArray[num].src = this.src;

		if(this.height == jslix.locyArray[num] && this.width == jslix.locxArray[num]){
			jslix.imgReady[num] = num;
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
  let oldonload = window.onload;
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
