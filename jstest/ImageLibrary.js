//Okay, time to start the first steps of creating the Image Library.
//I think the first step would be to actually store an image. But let's get this to work first...

var x = 0;
var y = 0;
var counter = 0;
var text = "CWT_MECH.png";

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
	
	var unit = document.getElementById("image");
	if(unit != null)
		ctx.drawImage(unit, 60, 30+y);
				
	y+= 10;
}

// The top will deprecate as I figure out more about the system
// Now I need to play around with getting the pixels

function store(){

	//This grabs an image and temporarily stores it in memory
	var imgStorage = document.getElementById("image");
	if(imgStorage == null){
		imgStorage = document.createElement("img");
		document.body.appendChild(imgStorage);
	}
	imgStorage.setAttribute("id", "image");
	imgStorage.setAttribute("src", text);
	imgStorage.setAttribute("style", "display:none");
	
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
	
	//Attempt to draw something in the newly created canvas
	var ctx = canvas.getContext("2d");
	ctx.drawImage(image, 0, 0);
	
	//Get the pixels from the image
	var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	for(var i = 0; i < imgData.data.length; i+=4){
	}
	
	//After we get all the pixels, then we have to create the buffer to store each pixel into.
	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays
	//The type we are trying to get is...
	
	// var buffer = new ArrayBuffer(a); (Where "a" is the total number of bytes in the buffer)	
	// var Uint8View = new Uint8Array(buffer);
}
