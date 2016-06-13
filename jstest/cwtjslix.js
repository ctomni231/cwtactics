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
	imgStorage.setAttribute("src", text);
	imgStorage.setAttribute("onload", "storeImage()");
	imgStorage.setAttribute("style", "display:none");

	//Makes a new storage spot for an image
	imgArray.push(new Image());
	imgReady.push(-1);
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

	//This pushes the images into an array
	viewArray.push(new Uint8ClampedArray(imgData.data));
	locxArray.push(imgStorage.width);
	locyArray.push(imgStorage.height);

	busy = 0;
	if(imgQueue.length > 0){
		addImage(imgQueue.pop());
	}
}

//Canvas Image with a speed mechanic included
function canvasImg(num){

	var color = document.getElementById("colorBox");
  var iflipx = document.getElementById("flipX");
  var iflipy = document.getElementById("flipY");
  var irotate = document.getElementById("rotate90");

	var change = 0;

	if(num >= 0 && num < viewArray.length){
    view = viewArray[num];

		if(lx != locxArray[num] || ly != locyArray[num]){
      lx = locxArray[num];
			ly = locyArray[num];
			change = 1;
		}

    //It is important these manipulations are done after the checks
    //due to the rotations.
    if(iflipx.checked == 1)
      view = flipX(view, lx, ly);
    if(iflipy.checked == 1)
      view = flipY(view, lx, ly);
    //if(irotate.checked == 1)
      //view = rotate90(view, lx, ly);

	}else{
		view = null;
		if(lx != 100 || ly != 100){
			lx = 100;
			ly = 100;
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
	}else if(color.value >= 0 && color.value <= 19 ){
		var imgStorage = document.getElementById("color");

		var canvas = document.getElementById("colorCanvas");
		if(canvas == null){
			canvas = document.createElement("canvas");
			document.body.appendChild(canvas);
		}
		canvas.setAttribute("id", "colorCanvas");

		canvas.setAttribute("width", imgStorage.width);
		canvas.setAttribute("height", imgStorage.height);
		canvas.setAttribute("style", "display:none");

		var ctx = canvas.getContext("2d");
		ctx.drawImage(imgStorage, 0, 0);
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < imgsData.data.length; i+=4){
			imgsData.data[i]=view[i];
			imgsData.data[i+1]=view[i+1];
			imgsData.data[i+2]=view[i+2];
			imgsData.data[i+3]=view[i+3];
			for(var j = 0; j < imgStorage.width*4; j+=4){
				if((imgData.data[j] == view[i] || imgData.data[j]-1 == view[i]) &&
				   (imgData.data[j+1] == view[i+1] || imgData.data[j+1]+1 == view[i+1]) &&
				   (imgData.data[j+2] == view[i+2] || imgData.data[j+2]+1 == view[i+2])){
					imgsData.data[i] = imgData.data[4*imgStorage.width*color.value+j];
					imgsData.data[i+1] = imgData.data[4*imgStorage.width*color.value+j+1];
					imgsData.data[i+2] = imgData.data[4*imgStorage.width*color.value+j+2];
				}
			}
		}
	}else{
		for (var i = 0; i < imgsData.data.length; i+=8){
			imgsData.data[i]=(view[i]+0)/2;
			imgsData.data[i+1]=(view[i+1]+0)/2;
			imgsData.data[i+2]=(view[i+2]+0)/2;
			imgsData.data[i+3]=view[i+3];
			imgsData.data[i+4]=(view[i+4]+0)/2;
			imgsData.data[i+5]=(view[i+5]+0)/2;
			imgsData.data[i+6]=(view[i+6]+0)/2;
			imgsData.data[i+7]=view[i+7];
		}//*/
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
		if((this.height == locyArray[num] && this.width == locxArray[num]) ||
       (this.width == locyArray[num] && this.height == locxArray[num])){
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