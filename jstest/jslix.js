//The battle to make a decent screen organization system begins here
//Anything that loads has to be connected to the body.

//http://localhost:8000/jslix.html

// JSlix stuff
var interval = null;
var lastTime = new Date();
var imgQueue = [];
var frame = 0;
var count = 0;
var fps = 0;
var sec = 16;
var cx = 0;
var cy = 0;
//animation stuff
var step = 0;


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
var imgsData;
var imgview;
var i;

var newImg = new Image();
newImgReady = -1;

// This is the game test itself
function run(sec){
	if(interval == null)
		init();
	else
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

function test(){
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
	
	var ctx = imgStorage.getContext("2d")
	
	for(var i = 0; i < 20; i++){
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10, 32, 32);
	}
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(1), step*32, 0, 32, 32, 10*i, 10+16, 32, 32);
	
	
	//newImg.height = canvasImg(1).height;
	//newImg.width = canvasImg(1).width;
	newImg.src = canvasImg(0).toDataURL();
	newImg.onload = function(){
		for(var i = 0; i < 20; i++){
			ctx.drawImage(newImg, step*32, 0, 32, 32, 10*i, 10+32, 32, 32);
		}
	}
	newImgReady++;
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
	//for(var i = 0; i < 20; i++){
	//	ctx.drawImage(newImg, step*32, 0, 32, 32, 10*i, 10, 32, 32);
	//}
	for(var i = 0; i < 20; i++){
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10, 32, 32);
	}
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(1), step*32, 0, 32, 32, 10*i, 10+16, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(getImg(0), step*32, 0, 32, 32, 10*i, 10+32, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10+32, 32, 32);
	/*for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(1), step*32, 0, 32, 32, 10*i, 10+48, 32, 32);
	for(var i = 0; i < 100; i++)
		ctx.drawImage(canvasImg(0), step*32, 0, 32, 32, 10*i, 10+64, 32, 32);//*/
	
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
	
	var change = 0;

	if(num >= 0 && num < bufferArray.length){
		buffer = bufferArray[num];
		if(lx != locxArray[num] || ly != locyArray[num]){
			lx = locxArray[num];
			ly = locyArray[num];
			change = 1;
		}
	}else{
		buffer = null;
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
		
	
	if(buffer == null){
		for (i = 0; i < imgsData.data.length; i += 4){
			imgsData.data[i+0]=255;
			imgsData.data[i+1]=0;
			imgsData.data[i+2]=0;
			imgsData.data[i+3]=100;
		}
	}else{
		imgview = new Uint8Array(buffer);
		//imgsData = imgview;
		//for (i = 0; i < imgsData.data.length; i++)
		//	imgsData.data[i] = imgview[i];
		//i = 0;
		//while (i++ < imgsData.data.length)
		//	imgsData.data[i]=imgview[i];
		//while((i+=4) < imgsData.data.length){
		//	imgsData.data[i]=imgview[i];
		//	imgsData.data[i+1]=imgview[i+1];
		//	imgsData.data[i+2]=imgview[i+2];
		//	imgsData.data[i+3]=imgview[i+3];
		//}
		/*for (i = 0; i < imgsData.data.length; i+=4){
			imgsData.data[i]=imgview[i];
			imgsData.data[i+1]=imgview[i+1];
			imgsData.data[i+2]=imgview[i+2];
			imgsData.data[i+3]=imgview[i+3];
		}//*/
		for (i = 0; i < imgsData.data.length; i+=8){
			imgsData.data[i]=imgview[i];
			imgsData.data[i+1]=imgview[i+1];
			imgsData.data[i+2]=imgview[i+2];
			imgsData.data[i+3]=imgview[i+3];
			imgsData.data[i+4]=imgview[i+4];
			imgsData.data[i+5]=imgview[i+5];
			imgsData.data[i+6]=imgview[i+6];
			imgsData.data[i+7]=imgview[i+7];
		}
	}
	//Draws the image
	imgctx.putImageData(imgsData,0,0);
	
	/*if(newImgReady == 0){
		newImgReady = 1;
		clearInterval(interval);
		console.log("Goes here");
		
		var imgStorage = document.getElementById("ttt");
		if(imgStorage == null){
			imgStorage = document.createElement("img");
			document.body.appendChild(imgStorage);
		}
		imgStorage.setAttribute("id", "ttt");
		imgStorage.setAttribute("src", imgcanvas.toDataURL());
		imgStorage.setAttribute("onload", "setInterval(runGame, sec)");
		
		
		//clearInterval(interval);
		//newImg = new Image();
		//newImg.onload = function(){
		//	console.log("Most definitely ready");
		//	interval = setInterval(runGame, sec);
		//	newImgReady++;
		//};
		//newImg.height = imgcanvas.height;
		//newImg.width = imgcanvas.width;
		//newImg = imgcanvas.toDataURL();
	}//*/
	
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

function getImg(num){
	if(newImgReady != num){
		console.log("Goes here");
		var tempImg = new Image();
		tempImg.onload = function(){
			newImg.src = this.src;
		};
		tempImg.src = canvasImg(num).toDataURL();
		newImgReady = num;
	}
	return newImg;
}

function getImg(ctx, num){

	//if(newImgReady == 0){
	//	newImg.src = canvasImg(num).toDataURL();
	//	newImg.onload = function(){
	//		console.log("Most definitely ready");
	//	};
	//	newImgReady = 1;
	//}
	
	//if(newImgReady == 1)
		return newImg;
	/*if(newImg == null)
		newImg = new Image();
	
	newImg.height = canvasImg(num).height;
	newImg.width = canvasImg(num).width;
	newImg.src = canvasImg(num).toDataURL();
	newImg.onload = function(){
		for(var i = 0; i < 20; i++){
			ctx.drawImage(newImg, step*32, 0, 32, 32, 10*i, 10, 32, 32);
		}
	}//*/
}
/*function getImg(num){
	
	imgctx = imgcanvas.getContext("2d");
	
	newImg.src = canvasImg(num).toDataURL();
	
	newImg.onload = function(){
		imgctx.drawImage(newImg, 0, 0, newImg.width, newImg.height);
	}
	return imgcanvas;
}//*/

function getImg(){
	return newImg;
}

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
