// ScreenLibrary.js
// Contains the run loop and the background of the trait system
import * as performance from "./screenstate.js"

let canvas = document.querySelector("#gamecanvas")

// Let's save this program from itself
if(canvas === null)
  canvas = setSize(300, 300);

const ctx = canvas.getContext("2d")

// This stores the type of mode for the loop
let intervalMode = false
let loopId = -1
let loopTime = 16
let w = 0
let h = 0
let change = 0

// These holds the various traits
let traits = []
// This holds the actual screens
let traitname = []

// Let's just push the traits on the system
export function addTrait (trait){
  // Traits are always ran, unless they have names
  traits.push(trait)

  // If the trait has a name, it's a screen
  if (trait.name) {
    traitname.push(trait.name)
    if (traitname.length === 1)
      performance.state.current = trait.name
  }
}

// Uses a name or number to change the screen to a new one
// This can also be done directly altering the screenstate state.next
export function changeScreen (val){

  if (typeof val === "number"){
    if(val > 0 && val < traitname.length)
      performance.state.next = traitname[val]
  }else if(typeof val === "string"){
    if(traitname.includes(val))
      performance.state.next = val
  }

}

// A boolean value that determines whether to run the Canvas using
// Timeout mode (false) or Interval Mode (true)
export function setIntervalMode (isOn) {
  intervalMode = isOn
}

// -looptime will use Math.max to get a differential of time (Tapsi's method)
// +looptime will use a constant measure to set the frames (JSRulz's method)
export function setIntervalTime (value) {
  loopTime = value
}

// This allows you to do some canvas editing
export function setSize (width, height) {

  // Creates a new canvas if one isn't made already
	let tmpcanvas = document.getElementById("gamecanvas");
	if(tmpcanvas == null){
		tmpcanvas = document.createElement("canvas");
		document.body.appendChild(tmpcanvas);
	}

	//Sets up the canvas if it isn't set up already
	tmpcanvas.setAttribute("id", "gamecanvas");
  tmpcanvas.setAttribute("width", parseInt(width));
	tmpcanvas.setAttribute("height", parseInt(height));
	tmpcanvas.setAttribute("style", "position:absolute; border: 1px solid #d3d3d3;");
	tmpcanvas.innerHTML = "Your browser does not support the HTML5 canvas tag.";

  if(performance.view != undefined){
    performance.view.sizex = parseInt(width)
    performance.view.sizey = parseInt(height)
    performance.view.lscape = (width >= height) ? 1 : 0
  }

  return tmpcanvas
}

// This widens the Canvas class to do a full window (default behaviour)
export function setCanvasSize() {
  w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

  w *= 0.98
  h *= 0.98

  setSize(w, h)
}

window.onresize = setWindowSize
window.onorientationchange = setWindowSize
window.onscroll = setWindowScroll

// A function for dealing with setting the window size
export function setWindowSize() {
  change = 3
  setCanvasSize()
}

// A function for dealing with scrolling of the window
export function setWindowScroll(){
  if(change > 1){
    setCanvasSize()
    change -= 1
  }
}

// This runs the canvas
export function run () {
  var time = new Date().getTime()

  // This will initialize all the traits
  traits.forEach(trait => {
    if (trait.init) trait.init()
  })

  const triggerLoop = function () {

      performance.stopMeasure("gameloop")
      performance.startMeasure("gameloop")

      const now = new Date().getTime()
      const delta = now - time

      // We will determine which looptime to use with positive
      // and negative values
      const ltime = loopTime >= 0 ? loopTime : Math.max(0, (-loopTime) - delta)

      // This will update all the traits
      performance.startMeasure("screen_update")
      performance.update(delta)
      for (let i = 0; i < traits.length; i++){

        // Validates if the screen has a name, it is the current screen
        if (traits[i].name){
          if(traits[i].name !== performance.state.current)
            continue
        }

        if (traits[i].update)
          traits[i].update()
      }
      performance.stopMeasure("screen_update")

      // This will update the render logic of all the traits
      performance.startMeasure("screen_render")

      // Let's clear the canvas every time
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < traits.length; i++){

        // Validates if the screen has a name, it is the current screen
        if (traits[i].name){
          if(traits[i].name !== performance.state.current)
            continue
        }

        if (traits[i].render)
          traits[i].render(canvas, ctx)
      }
      performance.stopMeasure("screen_render")

      if (intervalMode) {
          if (loopId >= 0)
              clearInterval(loopId);
          loopId = setInterval(triggerLoop, ltime);
      }else{
          loopId = setTimeout(triggerLoop, ltime)
      }

      time = now
  }

  performance.startMeasure("gameloop")
  triggerLoop()
}

export function stop() {

  if (loopId === -1) {
    console.error("could not stop game loop, because no loop is running")
    return
  }

  if (intervalMode) {
      clearInterval(loopId)
  }else{
      clearTimeout(loopId)
  }
  loopId = -1

}
