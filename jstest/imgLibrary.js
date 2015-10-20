// imgLibrary.js

// This is the real deal. This is the JavaScript class that will contain
// all the real elements that is going into the main game. This class
// will stretch image loading and rendering to its limits, and provide
// tools that allow control over the display, without breaking the memory
// and speed.

var buffer;
var lx = 0;
var ly = 0;

// This function adds an image from text.
function addImage(){
	//This grabs an image and temporarily stores it in memory
	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	imgStorage.setAttribute("src", document.getElementById("textBox").value);
	imgStorage.setAttribute("onload", "storeImage()");
	imgStorage.setAttribute("style", "display:none");
}

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
	
	//Creates the buffer for storage
	lx = imgStorage.width;
	ly = imgStorage.height;
	buffer = new ArrayBuffer(imgData.data.length);
	var view = new Uint8Array(buffer);
	
	for(var i = 0; i < imgData.data.length; i++)
		view[i] = imgData.data[i];
}

function displayImage(){

	//This makes a canvas storage module for the image
	var canvas = document.getElementById("store");
	if(canvas == null){
		canvas = document.createElement("canvas");
		document.body.appendChild(canvas);
	}
	canvas.setAttribute("id", "store");
	if(buffer == null){
		canvas.setAttribute("width", 100);
		canvas.setAttribute("height", 100);
	}else{
		canvas.setAttribute("width", lx);
		canvas.setAttribute("height", ly);
	}
	canvas.setAttribute("style", "display:none");
	var ctx = canvas.getContext("2d");
	
	if(buffer == null){
		var imgData = ctx.createImageData(100,100);
		for (var i = 0; i < imgData.data.length; i += 4){
			imgData.data[i+0]=255;
			imgData.data[i+1]=0;
			imgData.data[i+2]=0;
			imgData.data[i+3]=100;
		}
		ctx.putImageData(imgData,0,0);
	}else{
		var imgData = ctx.createImageData(lx,ly);
		var view = new Uint8Array(buffer);
		
		for (var i = 0; i < imgData.data.length; i++){
			imgData.data[i] = view[i];
		}
		ctx.putImageData(imgData,0,0);
	}
	
	//Reassigns it to the current canvas
	var c = document.getElementById("myCanvas");
	ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(canvas, 10, 10);
}