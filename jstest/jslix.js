//The battle to make a decent screen organization system begins
//here

//http://localhost:8000/jslix.html

// JSlix stuff
var interval;
var lastTime = new Date();
var imgQueue = [];
var frame = 0;
var count = 0;
var fps = 0;
var sec = 16;
var cx = 0;
var cy = 0;

// ImageLibrary Stuff
var buffer;
var lx = 0;
var ly = 0;

//These are arrays that store multiple images
var bufferArray = [];
var locxArray = [];
var locyArray = [];

// Drastically decrease copy times
var imgcanvas;
var imgctx;
var imgnum = -1;

//animation stuff
var step = 0;

function run(sec){
	init();
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var imgStorage = document.getElementById("myCanvas");
	if(imgStorage == null){
		imgStorage = document.createElement("canvas");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "myCanvas");
	imgStorage.setAttribute("width", w);
	imgStorage.setAttribute("height", h);
	imgStorage.innerHTML = "Your browser does not support the HTML5 canvas tag.";
	interval = setInterval(runGame, sec);
}

function rebase(sec){
	clearInterval(interval);
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	var imgStorage = document.getElementById("myCanvas");
	if(imgStorage == null){
		imgStorage = document.createElement("canvas");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "myCanvas");
	imgStorage.setAttribute("width", w);
	imgStorage.setAttribute("height", h);
	imgStorage.innerHTML = "Your browser does not support the HTML5 canvas tag.";
	interval = setInterval(runGame, sec);
}

function init(){
	queueImage("MinuteWars.png");
	queueImage("CWT_MECH.png");
	addImage("AWDS_INFT.png");
}

function queueImage(text){
	imgQueue.push(text);
}

function startQueue(){
	addImage(imgQueue.pop());
}

function runGame(){

	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	
	ctx.clearRect(0, 0, c.width, c.height);
	
	step++;
	if( step == 3 ) step = 0;
	
	//quickImage(ctx, 1);
	ctx.drawImage(image, 0, 0, c.width, c.height);
	//ctx.drawImage(canvasImage(1), 0, 0, c.width, c.height);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(1), step*32, 0, 32, 32, 10*i, 10+16, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10+32, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(1), step*32, 0, 32, 32, 10*i, 10+48, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10+64, 32, 32);
	
	var nowTime = new Date();
	//var diffTime = Math.ceil((nowTime.getTime() - lastTime.getTime()));
	var diffTime = nowTime.getTime() - lastTime.getTime();
	//fps = 1000/diffTime;
	frame += diffTime;
	count++;
	//ctx.save();
	if(frame > 1000){
		frame -= 1000;
		fps = count;
		count = 0;
	}
	ctx.fillStyle = '#000000';
	ctx.font = 'bold 10px sans-serif';
	ctx.fillText('FPS: ' + fps , 4, 10);
	
	lastTime = new Date();
}

// This function adds an image from text.
function addImage(text){
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
	
	/*var button = document.getElementById("button"+bufferArray.length);
	if(button == null){
		button = document.createElement("button");
		document.body.appendChild(button);
	}
	button.setAttribute("onclick", "display("+(bufferArray.length-1)+")");
	button.innerHTML = "Display #"+(bufferArray.length);//*/
	
	if(imgQueue.length > 0){
		addImage(imgQueue.pop());
	}
	
	rebase(sec);
}

//Canvas Image with a speed mechanic included
function canvasImg(num){

	if(num == imgnum){
		return imgcanvas;
	}

	if(num >= 0 && num < bufferArray.length){
		buffer = bufferArray[num];
		lx = locxArray[num];
		ly = locyArray[num];
	}else{
		buffer = null;
	}

	//This makes a canvas storage module for the image
	imgcanvas = document.getElementById("store");
	if(imgcanvas == null){
		imgcanvas = document.createElement("canvas");
		document.body.appendChild(imgcanvas);
	}
	imgcanvas.setAttribute("id", "store");
	if(buffer == null){
		imgcanvas.setAttribute("width", 100);
		imgcanvas.setAttribute("height", 100);
	}else{
		imgcanvas.setAttribute("width", lx);
		imgcanvas.setAttribute("height", ly);
	}
	imgcanvas.setAttribute("style", "display:none");
	imgctx = imgcanvas.getContext("2d");
	
	if(buffer == null){
		var imgData = ctx2.createImageData(100,100);
		for (var i = 0; i < imgData.data.length; i += 4){
			imgData.data[i+0]=255;
			imgData.data[i+1]=0;
			imgData.data[i+2]=0;
			imgData.data[i+3]=100;
		}
		imgctx.putImageData(imgData,0,0);
	}else{
		var imgData = imgctx.createImageData(lx,ly);
		var view = new Uint8Array(buffer);
		
		for (var i = 0; i < imgData.data.length; i++){
			imgData.data[i] = view[i];
		}
		imgctx.putImageData(imgData,0,0);
	}
	
	imgnum = num;
	return imgcanvas;
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
	var ctx2 = canvas.getContext("2d");
	
	if(buffer == null){
		var imgData = ctx2.createImageData(100,100);
		for (var i = 0; i < imgData.data.length; i += 4){
			imgData.data[i+0]=255;
			imgData.data[i+1]=0;
			imgData.data[i+2]=0;
			imgData.data[i+3]=100;
		}
		ctx2.putImageData(imgData,0,0);
	}else{
		var imgData = ctx2.createImageData(lx,ly);
		var view = new Uint8Array(buffer);
		
		for (var i = 0; i < imgData.data.length; i++){
			imgData.data[i] = view[i];
		}
		ctx2.putImageData(imgData,0,0);
	}
	
	return canvas;
}

// This is extra stuff for drawing an image
// ----------------------------------------

//This function draws the image directly to the canvas
function quickImage(ctx, num){
	if(num >= 0 && num < bufferArray.length){
		buffer = bufferArray[num];
		lx = locxArray[num];
		ly = locyArray[num];
	}else{
		buffer = null;
	}
	
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
}
