import * as state from "../screenstate.js"
import { zipLists } from "./utils.js"
import { updateTween, createTween, prepareTween } from "./tween.js"

//import { DEBUG_PAGES } from "./config/debugPages.js"
const DEBUG_PAGES = [

	{
	  name: "Input",
	  data: {
			row1: {
	      col1: [ "FPS", "measures.gameloop.fps" ],
				col2: [ "TPS", "measures.gameloop.tps" ]
	    },
	    row2: {
	      col1: [ "ACTION", "input.ACTION" ],
	      col2: [ "CANCEL", "input.CANCEL" ]
	    },
	    row3: {
	      col1: [ "LEFT", "input.LEFT" ],
	      col2: [ "RIGHT", "input.RIGHT" ]
	    },
	    row4: {
	      col1: [ "UP", "input.UP" ],
	      col2: [ "DOWN", "input.DOWN" ]
	    },
	    row5: {
	      col1: [ "DEBUG_A", "input.DEBUG_A" ],
	      col2: [ "DEBUG_B", "input.DEBUG_B" ]
	    },
			row6: {
	      col1: [ "MOUSEX", "input.MOUSEX" ],
	      col2: [ "MOUSEY", "input.MOUSEY" ]
	    },
			row7: {
	      col1: [ "ISMOUSE", "input.MOUSE" ],
	      col2: [ "ISTOUCH", "input.TOUCH" ]
	    },
			row8: {
	      col1: [ "SX", "view.sizex" ],
	      col2: [ "SY", "view.sizey" ],
				col3: [ "LS", "view.lscape"]
	    }
	  }
	},

	{
	  name: "Performance",
	  data: {
	    row1: {
				col1: [ "FPS", "measures.gameloop.fps" ],
				col2: [ "TPS", "measures.gameloop.tps" ]
	    },
	    row2: {
	      col1: [ "update game", ""],
	      col2: [ "average", "measures.gameloop.averageDuration" ],
	      col3: [ "last", "measures.gameloop.lastDuration" ]
	    },
	    row3: {
	      col1: [ "update screen", ""],
	      col2: [ "average", "measures.screen_update.averageDuration" ],
	      col3: [ "last", "measures.screen_update.lastDuration" ]
	    },
	    row4: {
	      col1: [ "render", ""],
	      col2: [ "average", "measures.screen_render.averageDuration" ],
	      col3: [ "last", "measures.screen_render.lastDuration" ]
	    }
	  }
	}
]

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
const view = state.view
const measures = state.measures

let inputPosInToggleFlow = 0
let debugPanelVisible = true
let resetFlowTimer = FLOW_RESET_TIME_IN_MS
let selectedDebugPage = 0

const inputDelay = createTween({ step: 1, duration: 250 })

function getDataFromState (key) {
  if (key === "") return key

  const keyParts = key.split(".")
  let data = state
  for (let index = 0; index < keyParts.length; index++) {
    data = data[keyParts[index]]
    if (data === undefined || data === null) return "N/A"
  }
  return data
}

export function update () {
  const isDebugControlTriggered = input.DEBUG_A || input.DEBUG_B

  updateTween(inputDelay, false, loop.delta)

  if (inputDelay.step.value === 1 && isDebugControlTriggered) {
	//if (isDebugControlTriggered) {
    selectedDebugPage = input.DEBUG_A
      ? Math.max(0, selectedDebugPage - 1)
      : Math.min(DEBUG_PAGES.length - 1, selectedDebugPage + 1)

    prepareTween(inputDelay, { step: 0 })
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

export function render (canvas, ctx) {
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
