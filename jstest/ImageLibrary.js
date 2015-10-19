//Okay, time to start the first steps of creating the Image Library.
//I think the first step would be to actually store an image. But let's get this to work first...

var x = 0;
var y = 0;
var counter = 0;
var text = "CWT_MECH.png";
var buffer;
var lx = 0;
var ly = 0;

//The images have to be loaded within the function. I guess they can't load in time...
//Let me try putting the images in head...
function copy(){
	//var imgData=ctx.getImageData(10,10,50,50);
	//ctx.putImageData(imgData,10,70);
				
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
			
	var inft = document.getElementById("inft");
	ctx.drawImage(inft, 10, 10 +y);
				
	var unit = document.getElementById("unit");
	ctx.drawImage(unit, 130, 30+y);
	
	var image = document.getElementById("image");
	if(image != null)
		ctx.drawImage(image, 60, 30+y);
				
	y+= 10;
}

// The top will deprecate as I figure out more about the system
// Now I need to play around with getting the pixels

// http://www.w3schools.com/tags/ev_onload.asp
// It looks like the only way to do it in JavaScript is to create a chain of triggers
// It'll be messy, but if we do it just right, we may be able to create a domino effect
// that loads the images.

function store(){

	y=0;
	//This grabs an image and temporarily stores it in memory
	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	imgStorage.setAttribute("src", text);
	imgStorage.setAttribute("style", "display:none");
	
	//Man is this ugly, but it is so JavaScript...
	imgStorage.onload = function(){
		
		//This makes a canvas storage module for the image
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
	
		//Attempt to draw something in the newly created canvas
		var ctx = canvas.getContext("2d");
		ctx.drawImage(imgStorage, 0, 0);
	
		//Get the pixels from the image
		//Got tainted? From this point forward, you have to be in a server context...
		//https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
		var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		
		//Creates the buffer for storage
		lx = imgStorage.width;
		ly = imgStorage.height;
		buffer = new ArrayBuffer(imgData.data.length);
		var view = new Uint8Array(buffer);
		
		//After we get all the pixels, then we have to create the buffer to store each pixel into.
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
		//The type we are trying to get is...
		for(var i = 0; i < imgData.data.length; i++){
			view[i] = imgData.data[i];
			if(view[i] != 0)
				console.log("Color "+i+": "+view[i]);
		}
		
		//List of buffers (ArrayBuffer)
		//List of buffer sizes (int)
		//Do manipulations while pulling out of the buffer...
		
		//Make 4 different types of compression. 
		//One for 1/2byte (4bit), one for 1 byte (8bit), 2 bytes (16bit), 4 bytes (32bit)
		//multiply and add to get the values...
	}
}

function pull(){

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

	ctx.drawImage(canvas, 10, 10);
	//Makes images bigger...
	//ctx.drawImage(canvas, 10, 10, canvas.width, canvas.height, 0, 0, (canvas.width*2), (canvas.height*2));
}

// A function for pulling an image out of the buffer, and hopefully drawing it too.
function pullWrong(){

	var c=document.getElementById("myCanvas");
	//Why does this default to false, it ruins my images...
	var ctx=c.getContext("2d", { alpha: true });
	ctx.globalCompositeOperation="lighter";
		
	if(buffer == null){
		var imgData = ctx.createImageData(100,100);
		for (var i = 0; i < imgData.data.length; i += 4){
			imgData.data[i+0]=255;
			imgData.data[i+1]=0;
			imgData.data[i+2]=0;
			imgData.data[i+3]=100;
		}
		ctx.putImageData(imgData,10,10);
	}else{
		var imgData = ctx.createImageData(lx,ly);
		var view = new Uint8Array(buffer);
		
		for (var i = 0; i < imgData.data.length; i++){
			imgData.data[i] = view[i];
		}
		ctx.putImageData(imgData,10,10);
		//ctx.putImageData(imgData, 0, 0, 0, 0, (lx*5), (ly*5)); 
	}
}
	
//This function shouldn't be called directly...
function pushToCanvas(){

	//This grabs an image and temporarily stores it in memory
	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	
	//This makes a canvas storage module for the image
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
	
	var canv = document.getElementById("store");
	//Attempt to draw something in the newly created canvas
	var ctx = canv.getContext("2d");
	ctx.drawImage(image, 0, 0);
	
	//Get the pixels from the image
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	
	//Freezes until image is loaded... hopefully.
	//while(imgData.data.length == 0);
	
	//Creates the buffer for storage
	//var buffer = new ArrayBuffer(imgData.data.length);
	//var view = new UInt8Array(buffer);
	
	//for(var i = 0; i < imgData.data.length; i++){
	//	view[i] = imgData.data[i];
	//	console.log("Entry "+i+" in the unsigned 8-bit array is now " + view[i]);	
	//}
	
	//After we get all the pixels, then we have to create the buffer to store each pixel into.
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
	//The type we are trying to get is...
	
	// var buffer = new ArrayBuffer(a); (Where "a" is the total number of bytes in the buffer)	
	// var Uint8View = new Uint8Array(buffer);
}

//Random junk from the old imglibrary.html (Out with the old, in with the new.
/*
<!DOCTYPE html>

<!-- 
Make sure that Doctype is the first line EVERY TIME!!! 
Creating ImgLibrary within Javascript
Honestly, I have absolutely no idea how I'm going to do this, all I know is that it has to be done 
To hide elements: Using hidden isn't available on IE
	              Using style.display = none (inline, block) => hides the element with no space taken in memory
				  Using style.visibility = hidden (visible)  => hides the element with space taken in memory
-->

<html>
	<head>
		<title>Creating ImgLibrary within JavaScript</title>	
	</head>
	<body>
		<img id="inft" src="AWDS_INFT.png" style="display: none;" />
		<img id="unit" src="UnitBaseColors.png" style="visibility: hidden;"/>

		<canvas id="myCanvas" width="300" height="150" style="border:1px solid #d3d3d3;">
			Your browser does not support the HTML5 canvas tag.</canvas>
		
		<script>
		<!--
			var x = 0;
			var y = 0;
			//var c=document.getElementById("myCanvas");
			//var ctx=c.getContext("2d");
			
			//var inft = document.getElementById("inft");
			//ctx.drawImage(inft, 10, 10);
			
			//ctx.fillStyle="red";
			//ctx.fillRect(10,10,50,50);

			//var imgData = ctx.getImageData(10, 10, 50, 50);
			//for(var i = 0; i < imgData.data.length; i+=4){
    
			//	if(imgData.data[i] === 255 && imgData.data[i+1] === 0 && imgData.data[i+2] === 0){
			//		imgData.data[i] = 255;
			//		imgData.data[i+1] = 255;
			//		imgData.data[i+2] = 0;
			//	}	
			//}
			//ctx.putImageData(imgData, 120, 20);
			
			
			
            //The images have to be loaded within the function. I guess they can't load in time...
			//Let me try putting the images in head...
			function copy(){
				//var imgData=ctx.getImageData(10,10,50,50);
				//ctx.putImageData(imgData,10,70);
				
				var c=document.getElementById("myCanvas");
				var ctx=c.getContext("2d");
			
				var inft = document.getElementById("inft");
				ctx.drawImage(inft, 10, 10 +y);
				
				var unit = document.getElementById("unit");
				ctx.drawImage(unit, 130, 30+y);
				
				y+= 10;
			}
		//-->
		</script>
	</body>
	
	<button onclick="copy()">Copy</button>
</html>
*/
