// This is a trait class

import { input as actionStatusMap } from "../screenstate.js"

const actionStatusCounterMap = {}
const keyStatusCounterMap = {}

export const mapping = {
  "keyboard": {

    "ArrowRight": "RIGHT",
    "ArrowLeft": "LEFT",
    "ArrowUp": "UP",
    "ArrowDown": "DOWN",

    "KeyD": "RIGHT",
    "KeyA": "LEFT",
    "KeyW": "UP",
    "KeyS": "DOWN",
    "KeyQ": "DEBUG_A",
    "KeyE": "DEBUG_B",

    "Space": "ACTION",
    "ControlLeft": "CANCEL",

    "KeyN": "ACTION",
    "KeyM": "CANCEL",
  }
}

function evaluateKeyEvent(keyStatusModifier, event) {
  const eventKey = event.code
  const keyCode = event.which || event.keyCode
  //console.log("Keyboard Key: " + eventKey + " - " + keyCode)
  const newKeyStatus = keyStatusModifier === 1 ? true : false

  if (keyStatusCounterMap[eventKey] === newKeyStatus) {
    return
  }

  const eventAction = mapping.keyboard[eventKey]

  if (!eventAction) {
    return
  }

  const currentCounter = actionStatusCounterMap[eventAction] || 0
  const newCounter = currentCounter + keyStatusModifier

  if (newCounter < 0) {
    throw new Error("illegal state, action status counter is below 0")
  }

  keyStatusCounterMap[eventKey] = newKeyStatus
  actionStatusCounterMap[eventAction] = newCounter

  event.preventDefault();
}

document.onkeydown = evaluateKeyEvent.bind(null, +1)
document.onkeyup = evaluateKeyEvent.bind(null, -1)

function updateActionStatus(keyId, counterStatus) {
  const currentStatus = actionStatusMap[keyId]

  if (currentStatus !== counterStatus) {
    console.log("changed key status,", keyId, "is now", (counterStatus ? "PRESSED" : "RELEASED"))
    actionStatusMap[keyId] = counterStatus
  }
}

export function init() {

  Object.keys(actionStatusCounterMap).forEach(key => actionStatusCounterMap[key] = 0)

  Object.keys(actionStatusCounterMap).forEach(key => {
    if (key.includes("ShiftLeft") || key.includes("ShiftRight")) {
      throw new Error("Shift key is not supported right now")
    }
  })

  // Let's get some defaults for the inputs
  // Currently, it doesn't support mouse or touch
  actionStatusMap["MOUSE"] = 0
  actionStatusMap["TOUCH"] = 0
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
}
