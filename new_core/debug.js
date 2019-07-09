import * as fps from "./performance.js"
import * as state from "./state.js"
import { zipLists } from "./utils.js"

import { DEBUG_PAGES } from "./config/debugPages.js"

const FLOW_RESET_TIME_IN_MS = 1000
const SHIFT_LEFT = 10
const SHIFT_TOP = 20
const ROW_HEIGHT = 15
const COLUMN_WIDTH = 50

const MAX_DATA_ROWS = 10
const MAX_DATA_COLUMNS = 3

const TOGGLE_DEBUG_FLOW = [
  "UP", "RIGHT", "DOWN", "LEFT", 
  "UP", "RIGHT", "DOWN", "LEFT"
]

const debugActivationFlow = zipLists(TOGGLE_DEBUG_FLOW, ["", "-"], (id, modifier) => modifier + id)
const loop = state.loop
const input = state.input

let inputPosInToggleFlow = 0
let debugPanelVisible = true
let resetFlowTimer = FLOW_RESET_TIME_IN_MS
let selectedDebugPage = 0

function getDataFromState (key) {
  if (key === "") return key
    
  const keyParts = key.split(".")
  let data = state
  for (let index = 0; index < keyParts.length; index++) {
    data = data[keyParts[index]]
    if (data === undefined) return "N/A"
  }
  return data
} 

export function update() {

  if (input.DEBUG_A) {
    selectedDebugPage = Math.max(0, selectedDebugPage - 1)
    return
  }

  if (input.DEBUG_B) {
    selectedDebugPage = Math.min(DEBUG_PAGES.length - 1, selectedDebugPage + 1)
    return
  }

  const currentExpectedInput = debugActivationFlow[inputPosInToggleFlow]
  const expectedState = currentExpectedInput[0] !== "-"
  const expectedInput = expectedState ? currentExpectedInput : currentExpectedInput.substr(1)
  const expectedStateIsEntered = input[expectedInput] === expectedState
 
  if (!expectedStateIsEntered) {
    resetFlowTimer -= loop.delta

    if (resetFlowTimer <= 0) {
      resetFlowTimer = FLOW_RESET_TIME_IN_MS
      inputPosInToggleFlow = 0
    }
    
    return
  }

  resetFlowTimer = FLOW_RESET_TIME_IN_MS
  inputPosInToggleFlow++

  if (inputPosInToggleFlow === debugActivationFlow.length) {
    debugPanelVisible = !debugPanelVisible
    inputPosInToggleFlow = 0
  }
}

export function render(canvas, ctx) {
  if (debugPanelVisible) {

    const debugSheet = DEBUG_PAGES[selectedDebugPage]

    ctx.fillStyle = "black";
    ctx.font = "8px monospace";
    
    ctx.globalAlpha = 0.9

    ctx.fillText("DEBUG - " + debugSheet.name, SHIFT_LEFT, SHIFT_TOP);

    for (let rowId = 1; rowId <= MAX_DATA_ROWS; rowId++) {
      const rowIdentifier = "row" + rowId

      if (!debugSheet.data[rowIdentifier]) continue

      for (let columnId = 1; columnId <= MAX_DATA_COLUMNS; columnId++) {
        const columnIdentifier = "col" + columnId

        if (!debugSheet.data[rowIdentifier][columnIdentifier]) continue

        const data = debugSheet.data[rowIdentifier][columnIdentifier]
        const key = data[0]
        const value = getDataFromState(data[1])
   
        const xKey = SHIFT_LEFT + (2 * COLUMN_WIDTH * (columnId - 1))
        const xValue = xKey + COLUMN_WIDTH
        const y = SHIFT_TOP + ROW_HEIGHT + (ROW_HEIGHT * (rowId))

        ctx.fillText(key, xKey, y)
        ctx.fillText(value, xValue, y)
      }
    }

    ctx.globalAlpha = 1.0
  }
}