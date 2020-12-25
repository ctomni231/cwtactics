// This is a trait class

import { input as actionStatusMap } from "../screenstate.js"

const actionStatusCounterMap = {}
let click = 0

export const mapping = {
  "keyboard": {

    39: "RIGHT",
    37: "LEFT",
    38: "UP",
    40: "DOWN",

    68: "RIGHT",
    65: "LEFT",
    87: "UP",
    83: "DOWN",
    81: "DEBUG_A",
    69: "DEBUG_B",

    32: "ACTION",
    17: "CANCEL",

    78: "ACTION",
    77: "CANCEL",
  },

  "mouse": {
    0: "ACTION", // left-mouse
    //1: This triggers middle mouse
    2: "CANCEL"  // right-mouse

  }
}

document.body.onkeydown = processKeyDown
document.body.onkeyup = processKeyUp

function processKeyDown(event) {

  const keyCode = event.which || event.keyCode
  const eventAction = mapping.keyboard[keyCode]
  //console.log("Keyboard KeyUp: " + keyCode)
  actionStatusMap["MOUSE"] = 0
  actionStatusMap["TOUCH"] = 0

  if (!eventAction) { return }

  actionStatusCounterMap[eventAction] = 1

  event.preventDefault();
}

function processClick(event){
    click = 5
    processMouseDown(event)
}

function processMouseDown(event) {
  const mouseCode = event.button
  const eventAction = mapping.mouse[mouseCode]
  //console.log("Mouse Down: " + mouseCode)

  actionStatusMap["MOUSE"] = 1
  if(event.button !== 0)
    actionStatusMap["TOUCH"] = 0

  if (!eventAction) { return }

  actionStatusCounterMap[eventAction] = 1

  event.preventDefault();
}

function processKeyUp(event){

  const keyCode = event.which || event.keyCode
  const eventAction = mapping.keyboard[keyCode]
  //console.log("Keyboard KeyDown: " + keyCode)

  actionStatusMap["MOUSE"] = 0
  actionStatusMap["TOUCH"] = 0

  if (!eventAction) { return }

  actionStatusCounterMap[eventAction] = 0

  event.preventDefault();
}

function processMouseUp(event){

  const mouseCode = event.button
  const eventAction = mapping.mouse[mouseCode]
  //console.log("Mouse Up: " + mouseCode)
  actionStatusMap["MOUSE"] = 1
  if(event.button !== 0)
    actionStatusMap["TOUCH"] = 0

  if (!eventAction) { return }

  actionStatusCounterMap[eventAction] = 0

  event.preventDefault();
}

function getDimensions(event){
  let mouseX = event.clientX - 8;
  let mouseY = event.clientY - 8;
	if(navigator.userAgent.toLowerCase().indexOf('safari') >= 0){
		mouseX += window.pageXOffset;
		mouseY += window.pageYOffset;
	}

  actionStatusMap["MOUSEX"] = mouseX
  actionStatusMap["MOUSEY"] = mouseY
  actionStatusMap["MOUSE"] = 1
}

function updateActionStatus(keyId, counterStatus) {
  const currentStatus = actionStatusMap[keyId]

  if (currentStatus !== counterStatus) {
    console.log("changed key status,", keyId, "is now", (counterStatus ? "PRESSED" : "RELEASED"))
    actionStatusMap[keyId] = counterStatus
  }
}

export function init() {

  // Creates a new canvas if one isn't made already
	let tmpcanvas = document.getElementById("gamecanvas");
	if(tmpcanvas == null){
		tmpcanvas = document.createElement("gamecanvas");
		document.body.appendChild(tmpcanvas);
	}

  //Sets up the canvas if it isn't set up already
  tmpcanvas.onclick = processClick
  tmpcanvas.onmousedown = processMouseDown
  tmpcanvas.onmouseup = processMouseUp
  tmpcanvas.onmousemove = getDimensions

  Object.keys(actionStatusCounterMap).forEach(key => actionStatusCounterMap[key] = 0)

  Object.keys(actionStatusCounterMap).forEach(key => {
    if (key.includes("ShiftLeft") || key.includes("ShiftRight")) {
      throw new Error("Shift key is not supported right now")
    }
  })

  // Let's get some defaults for the inputs
  actionStatusMap["MOUSE"] = 0
  actionStatusMap["TOUCH"] = 1
}

export function update () {
  updateActionStatus("DEBUG_A", actionStatusCounterMap["DEBUG_A"] > 0)
  updateActionStatus("DEBUG_B", actionStatusCounterMap["DEBUG_B"] > 0)
  updateActionStatus("DOWN", actionStatusCounterMap["DOWN"] > 0)
  updateActionStatus("UP", actionStatusCounterMap["UP"] > 0)
  updateActionStatus("RIGHT", actionStatusCounterMap["RIGHT"] > 0)
  updateActionStatus("LEFT", actionStatusCounterMap["LEFT"] > 0)
  updateActionStatus("ACTION", actionStatusCounterMap["ACTION"] > 0)
  updateActionStatus("CANCEL", actionStatusCounterMap["CANCEL"] > 0)

  if (click > 0) {
    click -= 1
    if (click == 0){
      Object.keys(actionStatusCounterMap).forEach(key => actionStatusCounterMap[key] = 0)
    }
  }
}
