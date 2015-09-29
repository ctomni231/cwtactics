//Okay, time to start the first steps of creating the Image Library.
//I think the first step would be to actually store an image. But let's get this to work first...

var x = 0;
var y = 0;

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

// The top will deprecate as I figure out more about the system
// Now I need to play around with getting the pixels

