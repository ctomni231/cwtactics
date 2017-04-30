/*
 * JSlixTouch
 *
 * This is the testing suite for touch controls. This will allow touch to work seamlessly
 * with mouse, keyboard, and game pad controls. 
 *
 */

// This is the timing variable of the second (setInterval) [currently 16 = 60FPS]
var second = 16;

// This is all timing variable stuff
var interval = null;
var lastTime = new Date();
var diffTime = 0;
var nowTime = 0;
var tfps = 0;
var frame = 0;
var count = 0;
var jfps = 0;

// Init stuff - This is the mouse storage variables
var mousex = 0;
var mousey = 0;

// Touch control functions

var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;

var yummy = "";
 
// --------------------------------------
// Functions start here
// --------------------------------------

// This runs the setInterval form of the game
function run(sec) {

  // Sets it to default if not set already (Comment out for requestAnimationFrame)
  if(sec <= 0){
	  sec = second;
  }//*/
  
  if(sec > 0 && interval != null)
	  clearInterval(interval);

  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	  var imgStorage = document.getElementById("myCanvas");
	  if(imgStorage == null){
		  imgStorage = document.createElement("canvas");
		  document.body.appendChild(imgStorage);
	  }
	  imgStorage.setAttribute("id", "myCanvas");
	  //imgStorage.setAttribute("width", w);
	  //imgStorage.setAttribute("height", h);
	  imgStorage.setAttribute("onmousemove", "getDimensions(event)");
	  //imgStorage.setAttribute("onclick", "createImage(event)");
	  imgStorage.innerHTML = "Your browser does not support the HTML5 canvas tag.";

	  imgStorage.addEventListener("mousedown", function (e) {
		  drawing = true;
		  lastPos = getMousePos(imgStorage, e);
	  }, false);
	  imgStorage.addEventListener("mouseup", function (e) {
		  drawing = false;
	  }, false);
	  imgStorage.addEventListener("mousemove", function (e) {
		  mousePos = getMousePos(imgStorage, e);
	  }, false);
	
	  // Set up touch events for mobile, etc
	  imgStorage.addEventListener("touchstart", function (e) {
		  mousePos = getTouchPos(imgStorage, e);
		  var touch = e.touches[0];
		  var mouseEvent = new MouseEvent("mousedown", {
		  	  clientX: touch.clientX,
			  clientY: touch.clientY
		  });
		  imgStorage.dispatchEvent(mouseEvent);
	  }, false);
	  imgStorage.addEventListener("touchend", function (e) {
		  var mouseEvent = new MouseEvent("mouseup", {});
		  imgStorage.dispatchEvent(mouseEvent);
	  }, false);
	  imgStorage.addEventListener("touchmove", function (e) {
		  var touch = e.touches[0];
		  var mouseEvent = new MouseEvent("mousemove", {
		      clientX: touch.clientX,
			  clientY: touch.clientY
		  });
		  imgStorage.dispatchEvent(mouseEvent);
	  }, false);
	
	  // Prevent scrolling when touching the canvas
	  document.body.addEventListener("touchstart", function (e) {
		  if (e.target == imgStorage) {
			if (e.preventDefault)
				e.preventDefault();
			else
				e.returnValue = false;
		  }
	  }, false);
	  document.body.addEventListener("touchend", function (e) {
		  if (e.target == imgStorage) {
			  if (e.preventDefault)
				e.preventDefault();
			  else
				e.returnValue = false;
		  }
	  }, false);
	  document.body.addEventListener("touchmove", function (e) {
		  if (e.target == imgStorage) {
			  if (e.preventDefault)
				e.preventDefault();
			  else
				e.returnValue = false;
		  }
	  }, false);
	  document.body.addEventListener("mouseup", function (e) {
		  if (e.target == imgStorage) {
			  if (e.preventDefault)
				e.preventDefault();
			  else
				e.returnValue = false;
		  }
	  }, false);
	  document.body.addEventListener("mousedown", function (e) {
		  if (e.target == imgStorage) {
			  if (e.preventDefault)
				e.preventDefault();
			  else
				e.returnValue = false;
		  }
	  }, false);
	  document.body.addEventListener("mousemove", function (e) {
		  if (e.target == imgStorage) {
			  if (e.preventDefault)
				e.preventDefault();
			  else
				e.returnValue = false;
		  }
	  }, false);
	  
      // Comment this out if you want to run with requestAnimationFrame
	  interval = setInterval(runGame, sec);
	
	  /*// Un-comment this if you want to run with requestAnimationFrame
	  if (sec > 0)
		  interval = setInterval(runGame, sec);
	  else
		  requestAnimationFrame(runFrame);//*/
}

/*// Supplementary runner for running a requestAnimationFrame
function runFrame() {
  runGame();
  requestAnimationFrame(runFrame);
}//*/

// Gets the location of the mouse
function getDimensions(event){
	//var imgStorage = document.getElementById("myCanvas");
	
	//mousePos = getMousePos(imgStorage, event);
	mousex = event.clientX - 8;
	mousey = event.clientY - 8;
}

function runGame() {

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    //ctx.clearRect(0, 0, c.width, c.height);

    render(ctx);

    // Keeps track of the FPS
    var nowTime = new Date().getTime();
    var diffTime = nowTime - lastTime;
    tfps = parseInt(1000 / (diffTime || 1), 10);
    frame += diffTime;
    count++;
    if(frame > 1000){
	     frame -= 1000;
	     jfps = count;
	     count = 0;
    }

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 100, 40);
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px sans-serif';
    ctx.fillText('FPS: ' + jfps + ' [' + tfps + ']', 4, 10);
    ctx.fillText('Mouse:(' + mousex + ',' + mousey + ')' , 4, 20);

    lastTime = nowTime;
}

// The true rendering function
function render(ctx){

	ctx.strokeStyle = "#222222";
	ctx.lineWith = 2;
	
	if (drawing) {
		ctx.moveTo(lastPos.x, lastPos.y);
		ctx.lineTo(mousePos.x, mousePos.y);
		ctx.stroke();
		lastPos = mousePos;
	}
}

// For dealing with mouse controls
// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, mouseEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: mouseEvent.clientX - rect.left,
		y: mouseEvent.clientY - rect.top
	};
}

// For dealing with touch controls
// Get the position of a touch relative to the canvas
function getTouchPos(canvasDom, touchEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: touchEvent.touches[0].clientX - rect.left,
		y: touchEvent.touches[0].clientY - rect.top
	};
}

