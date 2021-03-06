import * as gif from "./gif.js"

/*
 * JSlix Image Engine
 *
 * Currently:
 * Font and text - After \n, Need to create max lines, which will cut paragraphs
 *
 * Future: Might need to modularize this a bit (Deprecated)
 */

export const jslix = {

	// ImageLibrary Stuff
	view: undefined,
	lx: 0,
	ly: 0,
	count: 0,

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
	textInfo: {},
	busy: 0,

	// Spcifically for GIF Images
	myGif: undefined,

	// Drastically decrease copy times
	imgcanvas: undefined,
	imgctx: undefined,
	imgsData: undefined,

	// Font Specific
	fontName: "",
	fontSize: 0,
	fontText: "",
	fontStroke: 0,
	defName: "sans-serif",
	defSize: 10,
	defText: "ABCjgq|",

	// Text specific
	ASCII_COMBINE: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'-=_",

	// Manipulation
	colormap: 0,
	textmap: 0,
	Xflip: 0,
	Yflip: 0,
	rotate: 0,
	pixels: 0,
	invert: 0,
	refText: "",
	imgColor: [],
	color: [],
	blend: [],
	shift: [],
	drop: [],
	cutdrop: [],
	imgdrop: [],
	cut: [],
	ref: [],
	textdraw: [],

	// Manipulation Array
	intArray: [],
	mapArray: [],
	textArray: [],
	infoArray: [],
	flipXArray: [],
	flipYArray: [],
	rotateArray: [],
	pixelArray: [],
	imgColorArray: [],
	colorArray: [],
	blendArray: [],
	shiftArray: [],
	dropArray: [],
	cutDropArray: [],
	imgDropArray: [],
	invertArray: [],
	cutArray: [],
	textDrawArray: [],
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
	jslix.count += 1;
	addImage(text);
}

// Adds a flat colored box to the list of images
// Not all too useful yet, until extra functionality is added in
export function addColorBox(red, green, blue, alpha, sizex, sizey){

	//Simple error checking for the colors
	const boxColors = new Uint8Array([red, green, blue, alpha]);
	sizex = (sizex < 1) ? 1 : sizex;
	sizey = (sizey < 1) ? 1 : sizey;

	let imgcanvas = document.getElementById("cwtj-store");
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "cwtj-store");
	imgcanvas.setAttribute("width", sizex);
	imgcanvas.setAttribute("height", sizey);
	imgcanvas.setAttribute("style", "display:none");
	const ctx = imgcanvas.getContext("2d");
	const imgData = ctx.createImageData(sizex, sizey);
	for (let i = 0; i < imgData.data.length; i += 4){
		imgData.data[i+0] = boxColors[0];
		imgData.data[i+1] = boxColors[1];
		imgData.data[i+2] = boxColors[2];
		imgData.data[i+3] = boxColors[3];
	}

	changeReference("colorbox_"+red+"_"+green+"_"+blue+"_"+alpha+"_"+sizex+"_"+sizey)
	ctx.putImageData(imgData,0,0);

	addImage(imgcanvas.toDataURL());
}

// Text Library Suite of functionality
// ------------------------------------

// A helper function for addTextImage adding a limit to how far one
// can move along the x-axis
export function addLetterImage(index, str, limit){
	addTextImage(index, str, -1, -limit)
}

// A helper function for addTextImage turns words into paragraphs
export function addParagraghImage(index, str, limit){
	addTextImage(index, str, -1, limit)
}

// A helper function for getting words out of an image, use row to
// target getting words out of a paragraph
export function addWordImage(index, str, row, limit){
	addTextImage(index, str, row, limit)
}

// A helper function for getting pieces of words out of a limited line
export function addTextLineImage(index, str, row, limit){
	addTextImage(index, str, row, -limit)
}

// Adds an image to the list made purely of text image characters you choose.
// Also can be used for spritesheets, if savvy enough.
// index - The image index to use (negative for font images)
// str - The string to try and draw out
// row (Opt) - used to pull a specific row from an image (negative for all)
// limit (Opt) - length of pixels to go before spacing the word (for best fit)
// limit (negative) - for letter spacing
// limit (zero) - the entire word
// limit (positive) - for word spacing
export function addTextImage(index, str, row, limit){

	// If you send in a dud image, give them a font
	if(index < 0 || jslix.textInfo[index] === undefined){
		addFontImage(str);
		// If the image hasn't been setup for text, give the message
		if(index >= 0)
			console.log("addTextImage: Image Text Information Paramenters Is Not Set")
		return;
	}

	// Normalize the default values
	row = (row === undefined) ? -1 : row;
	limit = (limit === undefined) ? 0 : limit;

	// Finish getting the dimensions
	var textdim = getTextDim(index, str);
	console.log("Str: "+str)

	if( textdim[0] == 0 ){
		console.log("Do it the color way: "+str);

		jslix.textdraw = [index, str, row, limit]
		addColorBox(0, 0, 0, 255, 1, 1)
	}

	else{
		console.log("Do it the canvas way: "+str);

		let imgcanvas = document.getElementById("cwtj-font");
		if(imgcanvas == null){
			imgcanvas = document.createElement("canvas");
			document.body.appendChild(imgcanvas);
		}
		imgcanvas.setAttribute("id", "cwtj-font");

	  const ctx = imgcanvas.getContext("2d");
		let sizex = textdim[0];
		let sizey = textdim[1];

		imgcanvas.setAttribute("width", sizex);
		imgcanvas.setAttribute("height", sizey);
		imgcanvas.setAttribute("style", "display:none");

		// Pulls relevant information from the textInfo class
		let tmpInfo = jslix.textInfo[index];
		str = normalizeStr([index, str, row, limit]);
		let drop = 0;
    let back = 0;

		for(let i = 0; i < str.length; i++){

			let chart = tmpInfo[7];

			// If we have an enter, time for manipulation
    	if(str.charAt(i) == '\n') {
    		drop += 1;
    		back = i+1;
    		continue;
    	}

			let tmplps = chart.indexOf(str.charAt(i));

			if(tmplps >= 0){

				let tmppx = tmpInfo[0]
				let tmppy = tmpInfo[1]
				let tmpsx = (tmpInfo[2] < 1) ? jslix.locxArray[index]-tmppx : tmpInfo[2];
				let tmpsy = (tmpInfo[3] < 1) ? jslix.locyArray[index]-tmppy : tmpInfo[3];
				let tmpslx = (tmpInfo[4] < 1) ? 1 : tmpInfo[4];
				let tmpsly = (tmpInfo[5] < 1) ? 1 : tmpInfo[5];
				let start = (tmpInfo[6] < 0) ? 0 : tmpInfo[6];

				let letsx = ((tmpsx/tmpslx) > 0) ? tmpsx/tmpslx : tmpsx;
				let letsy = ((tmpsy/tmpsly) > 0) ? tmpsy/tmpsly : tmpsy;

				let posx = tmplps % tmpslx
				let posy = Math.floor(tmplps / tmpslx)

				console.log("Canvas - Letter: "+str.charAt(i)+" ("+posx+","+posy+")")
				placeCutImg(ctx, getImg(index), tmppx+((i-back)*letsx), tmppy+(drop*(letsy+1)), posx*letsx, posy*letsy, letsx, letsy);
			}
		}
		addImage(imgcanvas.toDataURL());
	}
}

export function addFontImage(str){

	let fontName = (jslix.fontName == "") ? jslix.defName : jslix.fontName;
	let fontSize = (jslix.fontSize == 0) ? jslix.defSize : jslix.fontSize;
	let fontText = (jslix.fontText == "") ? jslix.defText : jslix.fontText;

	let imgcanvas = document.getElementById("cwtj-font");
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "cwtj-font");

  const ctx = imgcanvas.getContext("2d");
	ctx.font = fontSize+"px "+fontName
	let sizex = parseInt(""+ctx.measureText(str).width)+1;
	let sizey = getFontHeight(fontName, fontSize, fontText);

	imgcanvas.setAttribute("width", sizex);
	imgcanvas.setAttribute("height", sizey);
	imgcanvas.setAttribute("style", "display:none");

	ctx.font = fontSize+"px "+fontName;
	if(jslix.fontStroke === 0)
		ctx.fillText(str, 0, sizey);
	else
		ctx.strokeText(str, 0, sizey);

	changeReference("fonttext_"+str)
	addImage(imgcanvas.toDataURL());
}

// This function adds an image from text (a.k.a. filename or dataURL).
export function addImage(text){

	//Add manipulations
	jslix.mapArray.push(jslix.colormap);
	jslix.colormap = 0;
	jslix.textArray.push(jslix.textmap);
	jslix.textmap = 0;
	jslix.flipXArray.push(jslix.Xflip);
	jslix.Xflip = 0;
	jslix.flipYArray.push(jslix.Yflip);
	jslix.Yflip = 0;
	jslix.rotateArray.push(jslix.rotate);
	jslix.rotate = 0;
	jslix.pixelArray.push(jslix.pixels);
	jslix.pixels = 0;
	jslix.invertArray.push(jslix.invert);
	jslix.invert = 0;
	jslix.colorArray.push(jslix.color);
	jslix.color = [];
	jslix.imgColorArray.push(jslix.imgColor);
	jslix.imgColor = [];
	jslix.blendArray.push(jslix.blend);
	jslix.blend = [];
	jslix.shiftArray.push(jslix.shift);
	jslix.shift = [];
	jslix.dropArray.push(jslix.drop);
	jslix.drop = [];
	jslix.cutDropArray.push(jslix.cutdrop);
	jslix.cutdrop = [];
	jslix.imgDropArray.push(jslix.imgdrop);
	jslix.imgdrop = [];
	jslix.textDrawArray.push(jslix.textdraw);
	jslix.textdraw = [];
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
	let imgStorage = document.getElementById("cwtj-image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "cwtj-image");
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

// This adds a reference to a image (doesn't need to be created)
export function addReference(name, imgIndex){
	let temp = [name, imgIndex];
	jslix.refArray.push(temp);
}

// Create Attributes
// -----------------------------------

// Make objects that aren't part of the manipulation pipeline

// This creates a basic image to the DOM with the name specified
export function createDomImage(name, text){
	let imgStorage = document.getElementById("cwti-"+name);
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "cwti-"+name);
	// This pretty much makes sure that a valid value is entering for numbers
	imgStorage.setAttribute("src", (typeof text !== "number")
	  ? text : (text >= 0 && text < jslix.intArray.length)
	  ? getImg(jslix.intArray[text]).src : getImg(text).toDataURL());
	imgStorage.setAttribute("style", "display:none");
	imgStorage.onerror = function(){
		  imgError(this);
	};

	return imgStorage;
}

// This creates a basic canvas to the DOM for drawing purposes
// Gives back the canvas for drawing
export function createDomCanvas(name, sizex, sizey){
	let imgcanvas = document.getElementById("cwtc-"+name);
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "cwtc-"+name);
	imgcanvas.setAttribute("width", sizex);
	imgcanvas.setAttribute("height", sizey);
	imgcanvas.setAttribute("style", "display:none");

	return imgcanvas;
}

// This creates a GIF image
// WARNING: GIF Image can't be used with JSlix, as it isn't a normal image
export function createGIFImage(text){
	if(jslix.myGif === undefined){
		jslix.myGif = gif.GIF();
		jslix.myGif.onerror = function(e){
       console.log("Gif loading error " + e.type);
    }
    jslix.myGif.load(text);
	}
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
// This function rotates an image 90 degrees
export function addRotatePixels(){
	jslix.pixels = 1;
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
// This function changes the pixels 'from' one color 'to' the color inputted
// opt int[0] = RGB only
//     int[1] = ALPHA only
//     int[2] = RGBA only
export function addColorChange(fromRed, fromGreen, fromBlue, fromAlpha,
									             toRed, toGreen, toBlue, toAlpha, opt){
	let fromColor = new Uint8Array([fromRed, fromGreen, fromBlue, fromAlpha]);
	let toColor = new Uint8Array([toRed, toGreen, toBlue, toAlpha]);
	let temp = [fromColor, toColor, opt];
	jslix.color.push(temp);
}
// This function adds a color map change to the image
export function addColorMapChange(mapIndex, colorIndex){
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
// posy - How many pixels it shifts by
// posx - The position of the first shift
// repeat - positive numbers will repeat a shift every # row (where # is repeat)
//          zero and negative numbers will create a shift once at that location
export function addPixelYShift(posx, posy, repeat){
	let temp = [1, posx, posy, repeat];
	jslix.shift.push(temp);
}

// This adds a cut image to the current image, before manipulations (color off)
// (Optional) locx, locy, sizex, sizey
export function addImageDrop(imgIndex, posx, posy, locx, locy, sizex, sizey){
	let ind = imgIndex
	if(imgIndex >= 0 && imgIndex < jslix.intArray.length)
		ind = jslix.intArray[imgIndex]
	let temp = [ind, posx, posy,
		(locx === undefined) ? 0 : locx,
		(locy === undefined) ? 0 : locy,
		(sizex === undefined) ? 0 : sizex,
		(sizey === undefined) ? 0 : sizey]
	jslix.imgdrop.push(temp)
}

// This adds a image drop to the current image, after manipulations
// opt int[0] = RGB only
//     int[1] = ALPHA only
//     int[2] = RGBA only
export function addPixelDrop(imgIndex, posx, posy, opacity, opt){
	let temp = [imgIndex, posx, posy, opacity, opt];
	jslix.drop.push(temp);
}

// This adds a cut image drop to the current image, before manipulations
// opt int[0] = RGB only
//     int[1] = ALPHA only
//     int[2] = RGBA only
export function addCutPixelDrop(imgIndex, posx, posy, locx, locy, sizex, sizey, opacity, opt){
	let temp = [imgIndex, posx, posy, locx, locy, sizex, sizey, opacity, opt];
	jslix.cutdrop.push(temp);
}

// This adds textual split information for a specific image
// index = Which image this refers to
// slicex = The number of horizontal slices to give an image
// slicey = The number of vertical slices to giv an image
// start = Where in the grid to start from left-to-right up-to-down (Optional)
// chart = A string containing the characters for the image (Optional)
// posx = the x-axis location where you want the slices to start (Optional)
// posy = the y-axis location where you want the slices to start (Optional)
// sizex = the x-axis total length of all slices (Optional)
// sizey = the y-axis total length of all slices (Optional)
// caseSensitive = Whether the chart is case sensitive (Deprecated)
export function addTextInfo(index, slicex, slicey, start, chart, posx, posy, sizex, sizey){
	jslix.textInfo[index] = [(posx === undefined) ? 0 : posx,
		(posy === undefined) ? 0 : posy, (sizex === undefined) ? 0 : sizex,
		(sizey === undefined) ? 0 : sizey, slicex, slicey,
		(start === undefined) ? 0 : start,
		(chart === undefined) ? jslix.ASCII_COMBINE : chart];
}

// This changes the font family of font images
export function changeFontFamily(fontFamily){
	jslix.fontName = fontFamily
}
// This changes the font size for font images
export function changeFontSize(fontSize){
	jslix.fontSize = fontSize
}
// This changes the template which helps a font generate its height
export function changeFontTemplateText(fontText){
	jslix.fontText = fontText
}
// This changes if a text blurb will be written in a
// stroke [num=1] or normal [num=0]
export function changeFontStroke(num){
	jslix.fontStroke = num
}

// -----------------------------------------
// Getter functions
// -----------------------------------------

// The fastest way to get an image onscreen for testing
export function getQuickImage(text){

	// For quick testing
	return createDomImage('quick', text)
}

// This function will draw a slide image stored in the DOM
export function getDomImage(name){
	let imgStorage = document.getElementById("cwti-"+name);
	if(imgStorage == null){
		return canvasImg(-1).toDataURL();
	}
	return (imgStorage.src == null) ? canvasImg(-1).toDataURL() : imgStorage;
}

// This creates a basic canvas to the DOM for drawing purposes
// Gives you an image that you can use
export function getDomCanvasImg(name){
	let imgcanvas = document.getElementById("cwtc-"+name);
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "cwtc-"+name);

	return imgcanvas.toDataURL();
}

// Currently only handles on GIF image, but good for displaying them
export function getGIFImg(){

	if(jslix.myGif){
		// Shows the fully loaded GIF
		if(!jslix.myGif.loading)
			return jslix.myGif.image;
		// Shows the last Frame of the GIF
		else if(jslix.myGif.lastFrame !== null)
			return jslix.myGif.lastFrame.image;
		// Return a waiting dot
		else
			return canvasImg(-1);
	}
}

// The getImage stuff - to get rid of the slow time of Internet Explorer
export function getImg(num){
	if(num >= 0 && num < jslix.intArray.length)
		num = jslix.intArray[num];
	if(jslix.imgReady[num] != num){
		addLoadEvent(loadImage(num));
		return canvasImg(num);
	}
	return jslix.imgArray[num];
}

// Gets the x-axis width of an image
export function getX(num){
	if(num >= 0 && num < jslix.intArray.length)
		num = jslix.intArray[num];
	if(jslix.imgReady[num] != num){
		addLoadEvent(loadImage(num));
		return 1;
	}
	return jslix.locxArray[num];
}

// Gets the y-axis height of an image
export function getY(num){
	if(num >= 0 && num < jslix.intArray.length)
		num = jslix.intArray[num];
	if(jslix.imgReady[num] != num){
		addLoadEvent(loadImage(num));
		return 1;
	}
	return jslix.locyArray[num];
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

// Holds the length of the image array
export function length(){
	return jslix.intArray.length+jslix.imgQueue.length+jslix.busy-jslix.count;
}

// -------------------------------------------
// Draw Functions
// -------------------------------------------

// This function places an image on a destination screen
export function placeImg(ctx, img, dlx, dly){
	ctx.drawImage(img, dlx, dly);
}

// This function draws the image on a destination screen
export function drawImg(ctx, img, dlx, dly, dsx, dsy){
	if(dsx < 0 || dsy < 0){

		// Get the adjustments
		dlx = (dsx < 0) ? dlx-dsx : dlx;
		dly = (dsy < 0) ? dly-dsy : dly;
		// Move the canvas to the location
		ctx.translate(dlx, dly);
    // scale by the width or the height depending on the one needed
    ctx.scale((dsx<0)?-1:1, (dsy<0)?-1:1);
    // Draw the Img: no need for x,y since we've already translated
		ctx.drawImage(img, 0, 0, dsx*((dsx<0)?-1:1), dsy*((dsy<0)?-1:1));
    // always clean up -- reset transformations to default
    ctx.setTransform(1,0,0,1,0,0);

	}else
		ctx.drawImage(img, dlx, dly, dsx, dsy);
}

// This function is used for placing a shifted image on the destination screen
export function placeCropImg(ctx, img, dlx, dly, slx, sly){
	ctx.drawImage(img, slx, sly, img.width, img.height,
	                   dlx, dly, img.width, img.height);
}

// This function is used for drawing a shifted image on the destination screen
export function drawCropImg(ctx, img, dlx, dly, dsx, dsy, slx, sly){
	if(dsx < 0 || dsy < 0){

		// Get the adjustments
		dlx = (dsx < 0) ? dlx-dsx : dlx;
		dly = (dsy < 0) ? dly-dsy : dly;
		// Move the canvas to the location
		ctx.translate(dlx, dly);
    // scale by the width or the height depending on the one needed
    ctx.scale((dsx<0)?-1:1, (dsy<0)?-1:1);
    // Draw the Img: no need for x,y since we've already translated
		ctx.drawImage(img, slx, sly, img.width, img.height,
		              0, 0, dsx*((dsx<0)?-1:1), dsy*((dsy < 0)?-1:1));
    // always clean up -- reset transformations to default
    ctx.setTransform(1,0,0,1,0,0);

	}else
		ctx.drawImage(img, slx, sly, img.width, img.height,
		                           dlx, dly, dsx, dsy);
}

// This function is used to place a cut image on the destination screen
export function placeCutImg(ctx, img, dlx, dly, slx, sly, ssx, ssy){
	ctx.drawImage(img, slx, sly, ssx, ssy, dlx, dly, ssx, ssy);
}

// This function is used to draw a cut image on the destination screen
export function drawCutImg(ctx, img, dlx, dly, dsx, dsy, slx, sly, ssx, ssy){
	if(dsx < 0 || dsy < 0){

		// Get the adjustments
		dlx = (dsx < 0) ? dlx-dsx : dlx;
		dly = (dsy < 0) ? dly-dsy : dly;
		// Move the canvas to the location
		ctx.translate(dlx, dly);
    // scale by the width or the height depending on the one needed
    ctx.scale((dsx<0)?-1:1, (dsy<0)?-1:1);
    // Draw the Img: no need for x,y since we've already translated
		ctx.drawImage(img, slx, sly, ssx, ssy,
		                     0, 0, dsx*((dsx<0)?-1:1), dsy*((dsy < 0)?-1:1));
    // always clean up -- reset transformations to default
    ctx.setTransform(1,0,0,1,0,0);

	}else
		ctx.drawImage(img, slx, sly, ssx, ssy, dlx, dly, dsx, dsy);
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
	let imgStorage = document.getElementById("cwti-"+name);
	if(imgStorage != null)
		document.body.removeChild(imgStorage);
}

// Clears a single DOM image from the body
export function removeDOMCanvas(name){
	let imgCanvas = document.getElementById("cwtc-"+name);
	if(imgCanvas != null)
		document.body.removeChild(imgCanvas);
}

// CLears the colormap images
export function removeAllMaps(){
	jslix.mapArray = [];
	jslix.mapX = []
	jslix.mapY = [];
}

// -----------------------------------------
// Text Manipulation Functions
// -----------------------------------------

// A function for getting the length and width of a text string
// drop (opt) = Handles newlines, always maxed out defualt
function getTextDim(index, str, drop){
	let dim = getLetterDim(index)

	drop = (drop === undefined) ? str.length : 1;
	let max = 0;
	for(let i = 0; i < str.length; i++){
		if(str.charAt(i) == '\n'){
			drop += 1;
			if(i - max >= max)
				max = i-max;
		}
	}
	if(max == 0)
		max = str.length;

	return [dim[0]*max, (dim[1]+1)*drop]
}

// A function for getting the length and width of a letter in an image
function getLetterDim(index){

	if(index < 0)
		return [0, 0];

	// Sets the index straight
	index = jslix.intArray[index];

	// Let's get the relevant Text Array
	let tmpInfo = jslix.textInfo[index]

	if(tmpInfo === undefined)
		return [0, 0];

	// Let's then get the size of the letter in the array
	let tmpsx = (tmpInfo[2] < 1) ? jslix.locxArray[index] : tmpInfo[2];
	let tmpsy = (tmpInfo[3] < 1) ? jslix.locyArray[index] : tmpInfo[3];
	let tmpslx = (tmpInfo[4] < 1) ? 1 : tmpInfo[4];
	let tmpsly = (tmpInfo[5] < 1) ? 1 : tmpInfo[5];

	// Let's get the length and width of a letter first
	let letsx = ((tmpsx/tmpslx) > 0) ? tmpsx/tmpslx : tmpsx;
	let letsy = ((tmpsy/tmpsly) > 0) ? tmpsy/tmpsly : tmpsy;

	console.log("Letter Dimensions: ("+letsx+","+letsy+")")
	// Return the size of the letter
	return [letsx, letsy]
}

// txtArray = index, str, row, limit
function normalizeStr(txtArr){

	let ind = (txtArr[0] === undefined) ? -1 : txtArr[0];
	let str = (txtArr[1] === undefined) ? "" : txtArr[1];
	// If row is negative, you are getting the entire string
	let row = (txtArr[2] === undefined) ? -1 : txtArr[2];
	// Sets the limit for how much you can get
	let lim = (txtArr[3] === undefined) ? 0 : txtArr[3];

	let letdim = getLetterDim(ind);

	if(letdim[0] > 0 && letdim[1] > 0){

		// Set the mode (which determines \n spacing)
		let wordmode = (lim > 0);

		// Make sure limit is always valid
		if(lim <= 0)
			lim = (lim < 0) ? -lim : str.length*letdim[0];

		let newstr = "";
		let max = 0;

		if(wordmode){
			let tracker = -1;
			let word = "";
			for(let i = 0; i < str.length; i++){
				max += 1;
				word += str[i];
				if(str.charAt(i) === ' ' || str.charAt(i) === '-') {
					tracker = i;
					newstr += word;
					word = "";
				}
				if(str.charAt(i) === '\n' || max*letdim[0] > lim){
					if(tracker >= 0){
						if(str.charAt(i) !== '\n')
							newstr += '\n';
						newstr += word;
						max = word.length;
						word = "";
					}else{
						newstr += word;
						word = "";
						max = 0
						if(str.charAt(i) !== '\n'){
							if(i+1 < str.length){
								if(str.charAt(i+1) === '\n')
									continue
							}
							newstr += '\n';
						}
					}
				}
			}
			if(word.length > 0)
    		newstr += word;
		}
		// This is the lettermode stuff
		else{
			for(let i = 0; i < str.length; i++){
				max += 1;
				newstr += str[i];
				if(str.charAt(i) === '\n' || max*letdim[0] > lim){
					max = 0
					if(str.charAt(i) !== '\n'){
						if(i+1 < str.length){
							if(str.charAt(i+1) === '\n')
								continue
						}
						newstr += '\n';
					}
				}
			}
		}

		// If we have a row, the string is now that row (or blank)
    if(row >= 0) {
    	let strArr = newstr.split("\n");
    	newstr = (row < strArr.length) ? strArr[row].trim() : "";
    }
		// Return to sender
		str = newstr;
	}
	return str;
}

// A function for plotting out the string onto a Canvas using pixels
function drawLetters(data, sx, sy, txtArray, cutArray){

	// Pulls relevant information from the textInfo class
	let index = txtArray[0];
	let tmpInfo = jslix.textInfo[index];
	let str = normalizeStr(txtArray);
	console.log(txtArray);
	let drop = 0;
  let back = 0;

	if(tmpInfo !== undefined){

		for(let i = 0; i < str.length; i++){

			let chart = tmpInfo[7];

			// If we have an enter, time for manipulation
    		if(str.charAt(i) == '\n') {
    			drop += 1;
    			back = i+1;
    			continue;
    		}

			let tmplps = chart.indexOf(str.charAt(i));

			if(tmplps >= 0){

				let tmppx = tmpInfo[0]
				let tmppy = tmpInfo[1]
				let tmpsx = (tmpInfo[2] < 1) ? jslix.locxArray[index]-tmppx : tmpInfo[2];
				let tmpsy = (tmpInfo[3] < 1) ? jslix.locyArray[index]-tmppy : tmpInfo[3];
				let tmpslx = (tmpInfo[4] < 1) ? 1 : tmpInfo[4];
				let tmpsly = (tmpInfo[5] < 1) ? 1 : tmpInfo[5];
				let start = (tmpInfo[6] < 0) ? 0 : tmpInfo[6];

				let letsx = ((tmpsx/tmpslx) > 0) ? tmpsx/tmpslx : tmpsx;
				let letsy = ((tmpsy/tmpsly) > 0) ? tmpsy/tmpsly : tmpsy;

				let posx = tmplps % tmpslx
				let posy = Math.floor(tmplps / tmpslx)

				console.log("Draw - Letter: "+str.charAt(i)+" ("+posx+","+posy+")")
				let tmpArray = [index, tmppx+((i-back)*letsx), tmppy+(drop*(letsy+1)),
					              posx*letsx, posy*letsy, letsx, letsy, 100, 2];
				data = dropCutPixels(data, sx, sy, tmpArray);
			}
		}
	}

	return data
}

// -----------------------------------------
// Private functions
// -----------------------------------------

// This function is literally a callback function to actually store the image
function storeImage(){

	let i, j, imgStorage = document.getElementById("cwtj-image");
	let suffix = "store";
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "cwtj-image");

	//This sets up any rotation effects we have
	let dimSwitch = jslix.rotateArray.shift();
	//This sets up any cut actions we have
	let tmpCut = jslix.cutArray.shift();
	// Deals with drawing text correctly on the screen
	let tmpText = jslix.textDrawArray.shift();

	// If we are doing a text cut, better check that first
	if(tmpText.length > 0){
		suffix = "font";
		console.log("Drawing Text: "+tmpText[1])
		let textdim = getTextDim(tmpText[0], tmpText[1])
		if(tmpCut.length > 0){
			tmpCut[0] = (tmpCut[0] > textdim[0]-1) ? textdim[0]-1 : tmpCut[0];
			tmpCut[1] = (tmpCut[1] > textdim[1]-1) ? textdim[1]-1 : tmpCut[1];
			tmpCut[2] = (tmpCut[0] + tmpCut[2] > textdim[0]) ? textdim[0] - tmpCut[0] : tmpCut[2];
			tmpCut[3] = (tmpCut[1] + tmpCut[3] > textdim[1]) ? textdim[1] - tmpCut[1] : tmpCut[3];
		}else{
			tmpCut = [0, 0, textdim[0], textdim[1]]
		}
	}//
	//Error check all the cut values
	else if(tmpCut.length > 0){ // Original line*/
	//if(tmpCut.length > 0){ // New line
		tmpCut[0] = (tmpCut[0] > imgStorage.width-1) ? imgStorage.width-1 : tmpCut[0];
		tmpCut[1] = (tmpCut[1] > imgStorage.height-1) ? imgStorage.height-1 : tmpCut[1];
		tmpCut[2] = (tmpCut[0] + tmpCut[2] > imgStorage.width) ? imgStorage.width - tmpCut[0] : tmpCut[2];
		tmpCut[3] = (tmpCut[1] + tmpCut[3] > imgStorage.height) ? imgStorage.height - tmpCut[1] : tmpCut[3];
	}

	// This sets up images to drop
	let tmpImg = jslix.imgDropArray.shift();

	let canvas = document.getElementById("cwtj-"+suffix);
	if(canvas == null){
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	}
	canvas.setAttribute("id", "cwtj-"+suffix);
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
	if(dimSwitch === 0){
		if(tmpCut.length > 0)
			ctx.drawImage(imgStorage, tmpCut[0], tmpCut[1], tmpCut[2], tmpCut[3],
				            0, 0, tmpCut[2], tmpCut[3]);
		else
			ctx.drawImage(imgStorage, 0, 0);
	}else{
		ctx.rotate(90*Math.PI/180);
		if(tmpCut.length > 0)
			ctx.drawImage(imgStorage, tmpCut[0], tmpCut[1], tmpCut[2], tmpCut[3],
				            0, -tmpCut[3], tmpCut[2], tmpCut[3]);
		else
			ctx.drawImage(imgStorage, 0, -imgStorage.height);
	}
	for(i = 0; i < tmpImg.length; i++){
		dropImage(ctx, tmpImg[i], dimSwitch)
	}

	// This allows Safari to reenact onload functionality
	if(imgStorage)
		imgStorage.parentNode.removeChild(imgStorage);

	let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	let imgWidth = canvas.width;
	let imgHeight = canvas.height;
	let data = new Uint8Array(imgData.data);
	let tmpColor = jslix.colorArray.shift();
	let tmpColorMap = jslix.imgColorArray.shift();
	let tmpBlend = jslix.blendArray.shift();
	let tmpShift = jslix.shiftArray.shift();
	let tmpDrop = jslix.dropArray.shift();
	let tmpCutDrop = jslix.cutDropArray.shift();
	let tmpName = jslix.ref.shift();

	//Do a bunch of manipulation checks before drawing out the image
	if(tmpText.length > 0){
		console.log("Gets to trying to draw text")
		data = drawLetters(data, imgWidth, imgHeight, tmpText, tmpCut);
	}//*/
	if(tmpCutDrop.length != 0){
		for(i = 0; i < tmpCutDrop.length; i++){
			data = dropCutPixels(data, imgWidth, imgHeight, tmpCutDrop[i]);
		}
	}
	if(jslix.flipXArray.shift() == 1)
		data = flipX(data, imgWidth, imgHeight);
	if(jslix.flipYArray.shift() == 1)
		data = flipY(data, imgWidth, imgHeight);
	if(jslix.pixelArray.shift() == 1){
		data = rotatePixels(data, imgWidth, imgHeight);
		let tmp = imgWidth;
		imgWidth = imgHeight;
		imgHeight = tmp;
	}
	if(tmpColor.length != 0){
			for(i = 0; i < tmpColor.length; i++){
				data = changeColor(data, tmpColor[i][0], tmpColor[i][1], tmpColor[i][2]);
			}
		}
	if(tmpColorMap.length != 0){
		for(i = 0; i < tmpColorMap.length; i++){
			data = changeMapColor(data, tmpColorMap[i][0], tmpColorMap[i][1]);
		}
	}
	if(tmpBlend.length != 0){
		for(i = 0; i < tmpBlend.length; i++){
			data = changeBlendColor(data, tmpBlend[i][0], tmpBlend[i][1], tmpBlend[i][2]);
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
	if(tmpDrop.length != 0){
		for(i = 0; i < tmpDrop.length; i++){
			data = dropPixels(data, imgWidth, imgHeight, jslix.intArray[tmpDrop[i][0]], tmpDrop[i][1], tmpDrop[i][2], tmpDrop[i][3], tmpDrop[i][4]);
		}
	}

	// This allows Safari to reenact onload functionality
	//if(imgStorage)
	//	imgStorage.parentNode.removeChild(imgStorage);

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
	if(jslix.imgQueue.length > 0)
		addImage(jslix.imgQueue.shift());
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

function rotatePixels(data, sx, sy){
	let temp = new Uint8Array(data);
	for(let i = 0; i < sy; i++){
    for(let j = 0; j < sx; j++){
      temp[(i+(j*sy))*4] = data[(j+(i*sx))*4];
      temp[(i+(j*sy))*4+1] = data[(j+(i*sx))*4+1];
      temp[(i+(j*sy))*4+2] = data[(j+(i*sx))*4+2];
      temp[(i+(j*sy))*4+3] = data[(j+(i*sx))*4+3];
    }
  }
  return temp;
}

// This function is for changing raw colors
function changeColor(data, fromColor, toColor, opt){
	let temp = new Uint8Array(data);
	for (let i = 0; i < temp.length; i+=4){
		//Skip out alpha recoloring
		if(opt == 0 && temp[i+3] === 0)
			continue;
		if(opt != 1 &&
			 (fromColor[0] == temp[i] || fromColor[0]-1 == temp[i]) &&
			 (fromColor[1] == temp[i+1] || fromColor[1]+1 == temp[i+1]) &&
		   (fromColor[2] == temp[i+2] || fromColor[2]+1 == temp[i+2])){
			temp[i] = toColor[0];
			temp[i+1] = toColor[1];
			temp[i+2] = toColor[2];
		}
		if(opt != 0 && fromColor[3] == temp[i+3]){
			temp[i+3] = toColor[3];
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

// This function drops an image on the location specified
// img => [0]imgIndex, [1]posx, [2]posy, [3]locx, [4]locy, [5]sizex, [6]sizey
// rot => rotation
function dropImage(ctx, img, rot){
	// The imgID can be negative to reference the textmap
	if(rot === 0){
		if(img[5] * img[6] > 0)
			ctx.drawImage(jslix.imgArray[img[0]],
				            img[3], img[4], img[5], img[6],
				            img[1], img[2], img[5], img[6]);
		else
			ctx.drawImage(jslix.imgArray[img[0]], img[1], img[2]);
	}else{
		ctx.rotate(90*Math.PI/180);
		if(img[5] * img[6] > 0)
			ctx.drawImage(jslix.imgArray[img[0]],
				            img[3], img[4], img[5], img[6],
				            img[1], img[2]-img[5], img[5], img[6]);
		else
			ctx.drawImage(jslix.imgArray[img[0]],
				img[1], img[2]-jslix.locyArray[img[0]]);
	}
}

// This function was made to drop an already existing image over one you are creating
// Uses for this are mostly for future proofing, but it may come in handy.
function dropPixels(data, sx, sy, imgID, px, py, opacity, opt){
	let temp = new Uint8Array(data);
	if(opacity >= 0 && opacity <= 100){
		for(let i = 0; i < sx; i++){
			for(let j = 0; j < sy; j++){
				// If I'm planning to loop through everything, I need a k!
				if(i >= px && i < px+jslix.locxArray[imgID] && j >= py && j < py+jslix.locyArray[imgID]){
					// Don't blend in transparent pixels
					if(opt == 0 && jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+3] === 0)
						continue;
					if(opt != 1){
						temp[(i+j*sx)*4] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4] - temp[(i+j*sx)*4])*(opacity / 100);
						temp[(i+j*sx)*4+1] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+1] - temp[(i+j*sx)*4+1])*(opacity / 100);
						temp[(i+j*sx)*4+2] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+2] - temp[(i+j*sx)*4+2])*(opacity / 100);
					}
					if(opt != 0){
						temp[(i+j*sx)*4+3] += (jslix.viewArray[imgID][((i-px)+(j-py)*jslix.locxArray[imgID])*4+3] - temp[(i+j*sx)*4+3])*(opacity / 100);
					}
				}
			}
		}
	}
	return temp;
}

// need ilx, ily, isx, isy and handle cut Image position before dropping it
// imgIndex, posx, posy, locx, locy, sizex, sizey, opacity, opt
function dropCutPixels(data, sx, sy, idata){

	//setup all the variables first
	let imgID = jslix.intArray[idata[0]];
	let px = idata[1]
	let py = idata[2]
	let ilx = idata[3]
	let ily = idata[4]
	let isx = idata[5]
	let isy = idata[6]
	let opacity = idata[7]
	let opt = idata[8]

	// Technically here, we can reproportion the image to rid of black spots

	// Then do the original cut function
	let temp = new Uint8Array(data);

	if(opacity >= 0 && opacity <= 100){
		for(let i = 0; i < sx; i++){
			for(let j = 0; j < sy; j++){
				// If I'm planning to loop through everything, I need a k!
				if(i >= px && i < px+jslix.locxArray[imgID] && i < px+isx &&
					 j >= py && j < py+jslix.locyArray[imgID] && j < py+isy){
					// Don't blend in transparent pixels
					if(opt == 0 && jslix.viewArray[imgID][((i-px+ilx)+(j-py+ily)*jslix.locxArray[imgID])*4+3] === 0)
						continue;
					if(opt != 1){
						temp[(i+j*sx)*4] += (jslix.viewArray[imgID][((i-px+ilx)+(j-py+ily)*jslix.locxArray[imgID])*4] - temp[(i+j*sx)*4])*(opacity / 100);
						temp[(i+j*sx)*4+1] += (jslix.viewArray[imgID][((i-px+ilx)+(j-py+ily)*jslix.locxArray[imgID])*4+1] - temp[(i+j*sx)*4+1])*(opacity / 100);
						temp[(i+j*sx)*4+2] += (jslix.viewArray[imgID][((i-px+ilx)+(j-py+ily)*jslix.locxArray[imgID])*4+2] - temp[(i+j*sx)*4+2])*(opacity / 100);
					}
					if(opt != 0){
						temp[(i+j*sx)*4+3] += (jslix.viewArray[imgID][((i-px+ilx)+(j-py+ily)*jslix.locxArray[imgID])*4+3] - temp[(i+j*sx)*4+3])*(opacity / 100);
					}
				}
			}
		}
	}

	return temp;
}

//Font Specific function for getting the Font Size
// Heavily adapted from Sinisa - Stack Overflow
// fontFamily = The font family the font is in
// fontSize = The font size in pixels
// fontText = The font Text
function getFontHeight(fontName, fontSize, fontText){
	let text = document.createElement("span");
	if(fontName != "")
		text.style.fontFamily = fontName;
	if(fontSize > 0)
		text.style.fontSize = fontSize + "px";
	text.innerHTML = ((fontText == "") ? "ABCjgq|" : fontText)

	let block = document.createElement("div");
	block.style.display = "inline-block";
	block.style.width = "1px";
	block.style.height = "0px";

	let div = document.createElement("div");
	div.appendChild(text);
	div.appendChild(block);
	//Test div must be visible for this to work
	div.style.height = "0px";
	div.style.overflow = "hidden";

	// Attach to body (necessary for this to work)
	document.body.appendChild(div);

	block.style.verticalAlign = "bottom";

  // Object Offset Function - Take 1
	let currtop = 0;
	let currleft = 0;
	if(block.offsetParent){
		do{
			currleft += block.offsetLeft;
			currtop += block.offsetTop;
		}while(block = block.offsetParent);
	}else{
		currleft += block.offsetLeft;
		currtop += block.offsetTop;
	}
	//Store bottom position
	let bp = currtop;

	// Object Offset Function - Take 2
	currleft = 0;
	currtop = 0;
	if(text.offsetParent){
		do{
			currleft += text.offsetLeft;
			currtop += text.offsetTop;
		}while(text = text.offsetParent);
	}else{
		currleft += text.offsetLeft;
		currtop += text.offsetTop;
	}
	// Store top position
	let tp = currtop;

	// Remove the div
	document.body.removeChild(div);

	// return the height
	return (bp - tp);
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
		jslix.imgcanvas = document.getElementById("cwtj-store");
		if(jslix.imgcanvas == null){
			jslix.imgcanvas = document.createElement("canvas");
			document.body.appendChild(jslix.imgcanvas);
		}
		jslix.imgcanvas.setAttribute("id", "cwtj-store");
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
