// Now for an even harder assignment. We are going to make a paint program to
// fully test the limits of jslix. Using the images we have already. 

// I need mouse functionality to make this one truly feel special
// And better get keyboard functionality while I'm at it

// Main features (Got the main features completed)

// Point and click draw
// point and click animate
// Able to change the color of an image
// Able to store different colored images
// Speed runs optimally on all browsers

// I have to get rid of the errors in the system. Funnily, the internal queue work best in...
// Internet Explorer, followed By Firefox, Chrome, and Opera.

//http://localhost:8000/testjslix.html

// ImageLibrary Stuff
var view;
var lx = 0;
var ly = 0;

//These are arrays that store multiple images
var viewArray = [];
var locxArray = [];
var locyArray = [];
var imgQueue = [];
var imgArray = [];
var imgReady = [];
var busy = 0;

// Drastically decrease copy times
var imgcanvas;
var imgctx;
var imgnum = -1;
var imgsData;
var imgview;
var i;
var j;

//animation stuff
var step = 0;

// JSlix stuff
var interval = null;
var lastTime = new Date();
var frame = 0;
var count = 0;
var fps = 0;
var sec = 16;
var cx = 0;
var cy = 0;

// getImage stuff
var newImg = new Image();
//var tempImg = new Image();
newImgReady = -1;

//Init stuff
var mousex = 0;
var mousey = 0;

var intArray = [];
var mxArray = [];
var myArray = [];

function init() {

}

function createImage(event) {
  var text = document.getElementById("textBox");

  intArray.push(viewArray.length);
  mxArray.push(mousex);
  myArray.push(mousey);

  addImage(text.value);
}

function runGame() {

  var c = document.getElementById("myCanvas");
  var ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);

  step++;
  if (step == 3) step = 0;

  for (var i = 0; i < intArray.length; i++) {
    //ctx.drawImage(getImg(intArray[i]), mxArray[i], myArray[i]);
    ctx.drawImage(getImg(intArray[i]), step * 32, 0, 32, 32, mxArray[i], myArray[i], 32, 32);
  }

  // Keeps track of the FPS
  var nowTime = new Date();
  var diffTime = nowTime.getTime() - lastTime.getTime();
  frame += diffTime;
  count++;
  if (frame > 1000) {
    frame -= 1000;
    fps = count;
    count = 0;
  }
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('FPS: ' + fps, 4, 10);
  ctx.fillText('Mouse:(' + mousex + ',' + mousey + ')', 4, 20);
  ctx.fillText('Image Count:' + intArray.length, 4, 30);

  lastTime = new Date();
}


// This is the game test itself
function run(sec) {
  if (interval == null)
    init();
  else
    clearInterval(interval);
  var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var imgStorage = document.getElementById("myCanvas");
  if (imgStorage == null) {
    imgStorage = document.createElement("canvas");
    document.body.appendChild(imgStorage);
  }
  imgStorage.setAttribute("id", "myCanvas");
  //imgStorage.setAttribute("width", w);
  //imgStorage.setAttribute("height", h);
  imgStorage.setAttribute("onmousemove", "getDimensions(event)");
  imgStorage.setAttribute("onclick", "createImage(event)");
  imgStorage.innerHTML = "Your browser does not support the HTML5 canvas tag.";
  interval = setInterval(runGame, sec);
}

function getDimensions(event) {
  mousex = event.clientX - 8;
  mousey = event.clientY - 8;
}

// ---------------------------------
// ImageLibrary starts here
// ---------------------------------

// This function adds an image from text.
function addImage(text) {

  //This will combine both queue and addImage.
  if (busy == 1) {
    imgQueue.push(text);
    return;
  }

  busy = 1;
  //This grabs an image and temporarily stores it in memory
  var imgStorage = document.getElementById("image");
  if (imgStorage == null) {
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
function storeImage() {

  var imgStorage = document.getElementById("image");
  if (imgStorage == null) {
    imgStorage = document.createElement("img");
    document.body.appendChild(imgStorage);
  }
  imgStorage.setAttribute("id", "image");

  var canvas = document.getElementById("store");
  if (canvas == null) {
    canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
  }
  canvas.setAttribute("id", "store");
  canvas.setAttribute("width", imgStorage.width);
  canvas.setAttribute("height", imgStorage.height);
  canvas.setAttribute("style", "display:none");

  console.log("(" + imgStorage.width + "," + imgStorage.height + ")");

  var ctx = canvas.getContext("2d");
  ctx.drawImage(imgStorage, 0, 0);
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  //This pushes the images into an array
  viewArray.push(new Uint8ClampedArray(imgData.data));
  locxArray.push(imgStorage.width);
  locyArray.push(imgStorage.height);

  busy = 0;
  if (imgQueue.length > 0) {
    addImage(imgQueue.pop());
  }

  run(sec);
}

//Canvas Image with a speed mechanic included
function canvasImg(num) {

  //if(num == imgnum){
  //	return imgcanvas;
  //}
  var color = document.getElementById("colorBox");

  var change = 0;

  if (num >= 0 && num < viewArray.length) {
    view = viewArray[num];
    if (lx != locxArray[num] || ly != locyArray[num]) {
      lx = locxArray[num];
      ly = locyArray[num];
      change = 1;
    }
  } else {
    view = null;
    if (lx != 100 || ly != 100) {
      lx = 100;
      ly = 100;
      change = 1;
    }
  }

  //This makes a canvas storage module for the image
  if (change == 1) {
    imgcanvas = document.getElementById("store");
    if (imgcanvas == null) {
      imgcanvas = document.createElement("canvas");
      document.body.appendChild(imgcanvas);
    }
    imgcanvas.setAttribute("id", "store");
    imgcanvas.setAttribute("width", lx);
    imgcanvas.setAttribute("height", ly);
    imgcanvas.setAttribute("style", "display:none");
    imgctx = imgcanvas.getContext("2d");
    imgsData = imgctx.createImageData(lx, ly);
  } else {
    imgctx.clearRect(0, 0, lx, ly);
  }

  if (view == null) {
    for (i = 0; i < imgsData.data.length; i += 4) {
      imgsData.data[i + 0] = 255; //255
      imgsData.data[i + 1] = 0; //255
      imgsData.data[i + 2] = 0; //255
      imgsData.data[i + 3] = 100; //0
    }
  } else if (color.value >= 0 && color.value <= 19) {
    var imgStorage = document.getElementById("color");

    var canvas = document.getElementById("colorCanvas");
    if (canvas == null) {
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

    for (var i = 0; i < imgsData.data.length; i += 4) {
      //if(view[i] > 0 || view[i+1] > 0 || view[i+2] > 0)
      //	console.log("Color "+num+": "+view[i]+","+view[i+1]+","+view[i+2]);
      imgsData.data[i] = view[i];
      imgsData.data[i + 1] = view[i + 1];
      imgsData.data[i + 2] = view[i + 2];
      imgsData.data[i + 3] = view[i + 3];
      for (var j = 0; j < imgStorage.width * 4; j += 4) {
        //if(imgData.data[j] === view[i] && imgData.data[j+1] === view[i+1] && imgData.data[j+2] === view[i+2]){
        if ((imgData.data[j] == view[i] || imgData.data[j] - 1 == view[i]) &&
          (imgData.data[j + 1] == view[i + 1] || imgData.data[j + 1] + 1 == view[i + 1]) &&
          (imgData.data[j + 2] == view[i + 2] || imgData.data[j + 2] + 1 == view[i + 2])) {
          imgsData.data[i] = imgData.data[4 * imgStorage.width * color.value + j];
          imgsData.data[i + 1] = imgData.data[4 * imgStorage.width * color.value + j + 1];
          imgsData.data[i + 2] = imgData.data[4 * imgStorage.width * color.value + j + 2];
        }
      }
    }
  } else {
    for (i = 0; i < imgsData.data.length; i += 8) {
      imgsData.data[i] = view[i];
      imgsData.data[i + 1] = view[i + 1];
      imgsData.data[i + 2] = view[i + 2];
      imgsData.data[i + 3] = view[i + 3];
      imgsData.data[i + 4] = view[i + 4];
      imgsData.data[i + 5] = view[i + 5];
      imgsData.data[i + 6] = view[i + 6];
      imgsData.data[i + 7] = view[i + 7];
    } //*/
  }
  //Draws the image
  imgctx.putImageData(imgsData, 0, 0);

  //imgnum = num;

  return imgcanvas;
}

// The getImage stuff - to get rid of the slow time of Internet Explorer
function getImg(num) {
  //if(newImgReady != num){
  if (imgReady[num] != num) {
    //console.log("Goes here "+newImgReady);
    addLoadEvent(loadImage(num));
  }

  return imgArray[num];
  //return newImg;
}

function loadImage(num) {
  var tempImg = new Image();
  tempImg.onload = function () {
    imgArray[num].src = this.src;
    //newImg.src = this.src;
    if (this.height == locyArray[num] && this.width == locxArray[num]) {
      //newImgReady = num;
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
    window.onload = function () {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}

var enabledAutoCreate = false;

function stopAutoCreate() {
  enabledAutoCreate = false;
}

function startAutoCreate() {
  enabledAutoCreate = true;
  autoCreate();
}

function autoCreate() {
  var c = document.getElementById("myCanvas");

  // fake event to act like a mouse
  getDimensions({
    clientX: parseInt(Math.random() * c.width, 10),
    clientY: parseInt(Math.random() * c.height, 10)
  });
  createImage({});

  enabledAutoCreate && setTimeout(autoCreate, 250);
}
