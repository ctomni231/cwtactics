// imgLibrary.js

// This is the real deal. This is the JavaScript class that will contain
// all the real elements that is going into the main game. This class
// will stretch image loading and rendering to its limits, and provide
// tools that allow control over the display, without breaking the memory
// and speed.

//Working on: Just got images to store in an array and display at will from each location
//            Need a faster way of getting colors from an image (or compression will be a slow process) 

//These are the temporary storage areas for images
var buffer;
var lx = 0;
var ly = 0;
var fps = 0;

//These are arrays that store multiple images
var bufferArray = [];
var locxArray = [];
var locyArray = [];

var everyColor = [];

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
	
	//Creates the buffer for storage
	lx = imgStorage.width;
	ly = imgStorage.height;
	buffer = new ArrayBuffer(imgData.data.length);
	var view = new Uint8Array(buffer);
	
	for(var i = 0; i < imgData.data.length; i++)
		view[i] = imgData.data[i];
		
	
	//This pushes the images into an array
	bufferArray.push(buffer);
	locxArray.push(lx);
	locyArray.push(ly);
	
	var button = document.getElementById("button"+bufferArray.length);
	if(button == null){
		button = document.createElement("button");
		document.body.appendChild(button);
	}
	button.setAttribute("onclick", "display("+(bufferArray.length-1)+")");
	button.innerHTML = "Display #"+(bufferArray.length);
}

function repeatCascade(){
	setInterval(cascade(), 50);
}

function cascade(){

	lastTime = new Date();
	
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	
	for(var i = 0; i < bufferArray.length; i++){
		ctx.drawImage(canvasImage(i), 10*i, 10*i);
	}
	
	//No more double cascade
	//for(var i = 0; i < bufferArray.length; i++){
	//	ctx.drawImage(canvasImage(i), 10*(i+bufferArray.length), 10*(i+bufferArray.length));
	//}
	
	var nowTime = new Date();
	var diffTime = Math.ceil((nowTime.getTime() - lastTime.getTime()));
	fps = 1000/diffTime;
	ctx.save();
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 10px sans-serif';
	ctx.fillText('FPS: ' + fps , 4, 10);
}
//This function displays an image by the number selected
function display(num){
	
	//Reassigns it to the current canvas
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(canvasImage(num), 10, 10);
}

//This function stores an image by the number selected
function canvasImage(num){

	if(num >= 0 && num < bufferArray.length){
		buffer = bufferArray[num];
		lx = locxArray[num];
		ly = locyArray[num];
	}else{
		buffer = null;
	}

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
	
	return canvas;
}

//Displays the image currently in buffer
//Also gets the number of unique colors in an image (for compression later)
//Pretty slow operation for now, will look into faster methods...
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
	
	var time = (new Date()).getTime();
	imageColors();
	console.log("Time took to render: " + ((new Date()).getTime() - time) + "ms");
}

function imageColors(){
	
	var view = new Uint8Array(buffer);
	
	intBuffer = new ArrayBuffer(4);
	intView = new Uint8Array(intBuffer);
	
	var colorData = [];
	
	for (var i = 0, j = 0; i < view.length; i += 4){
		for (j = 0; j < colorData.length; j+=4){
			intBuffer = colorData[j];
			if(intView[j]*1000+intView[j+1] == view[i]*1000+view[i+1] && 
			   intView[j+2]*1000+intView[j+3] == view[i+2]*1000+view[i+3]){
				break;
			}
		}
		if(j >= colorData.length){
			intBuffer = new ArrayBuffer(4);
			intView = new Uint8Array(intBuffer);
			intView[0] = view[i];
			intView[1] = view[i+1];
			intView[2] = view[i+2];
			intView[3] = view[i+3];
			colorData.push(intBuffer);
			
		}
	}
	console.log("Number of colors: "+(colorData.length)+"/"+(view.length/4));
}

function colorInImg(){
	var view = new Uint8Array(buffer);
	var colorData = [];
	for (var i = 0, j = 0; i < view.length; i++){
		for (j = 0; j < colorData.length; j++){
			if(colorData[j] == view[i])
				break;
		}
		if(j >= colorData.length)
			colorData.push(view[i]);
	}
	
	console.log("Number of colors: "+(colorData.length)+"/"+(view.length));
}

function colorSplitFake(){
	var view = new Uint8Array(buffer);
	var colorData = [];
	for (var i = 0, j = 0; i < view.length; i += 2){
		for (j = 0; j < colorData.length; j++){
			if(colorData[j] == view[i]*1000+view[i+1])
				break;
		}
		if(j >= colorData.length)
			colorData.push(view[i]*1000+view[i+1]);
	}
	console.log("Number of colors: "+(colorData.length)+"/"+(view.length / 2));
}
function colorSplit(){
	var view = new Uint8Array(buffer);
	var colorData = [];
	var alphaData = [];
	for (var i = 0, j = 0; i < view.length; i += 4){
		for (j = 0; j < colorData.length; j++){
			if(colorData[j] == view[i]*1000+view[i+1] && alphaData[j] == view[i+2]*1000+view[i+3])
				break;
		}
		if(j >= colorData.length){
			colorData.push(view[i]*1000+view[i+1]);
			alphaData.push(view[i+2]*1000+view[i+3]);
		}
	}
	console.log("Number of colors: "+(colorData.length)+"/"+(view.length/4));
}
function colorInRGB(){
	var view = new Uint8Array(buffer);
	var colorData = [];
	for (var i = 0, j = 0; i < view.length; i += 4){
		for (j = 0; j < colorData.length; j++){
			if(colorData[j] == view[i]*1000000+view[i+1]*1000+view[i+2])
				break;
		}
		if(j >= colorData.length)
			colorData.push(view[i]*1000000+view[i+1]*1000+view[i+2]);
	}
	console.log("Number of colors: "+(colorData.length)+"/"+(view.length / 4));
}

// Finds the number of colors in the current buffer image
// Currently a very slow process (researching better ways)
function colorInImage(){
	var view = new Uint8Array(buffer);
	var colorData = [];
	for (var i = 0, j = 0; i < view.length; i += 4){
		for (j = 0; j < colorData.length; j += 4){
			if(colorData[j] == view[i] && colorData[j+1] == view[j+1] &&
				colorData[j+2] == view[j+2] && colorData[j+3] == view[j+3])
				break;
		}
		if(j >= colorData.length){
			colorData.push(view[i]);
			colorData.push(view[i+1]);
			colorData.push(view[i+2]);
			colorData.push(view[i+3]);
		}
	}
	console.log("Number of colors: "+(colorData.length / 4)+"/"+(view.length / 4));
}