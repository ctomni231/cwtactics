import * as INITIAL from "./screens/initial.js"
import * as INGAME from "./screens/ingame.js"

import * as performance from "./performance.js"
import { SCREEN_WIDTH, SCREEN_HEIGHT } from "./config/constants.js"
import { state } from "./state.js"
import { update as updateDebug, render as renderDebug } from "./debug.js"

const canvas = document.querySelector("#gamecanvas")
const ctx = canvas.getContext("2d")

const SCREENS = { INITIAL, INGAME }

function setupCanvas () {
  canvas.style.width = SCREEN_WIDTH
  canvas.style.height = SCREEN_HEIGHT
  canvas.width = SCREEN_WIDTH
  canvas.height = SCREEN_HEIGHT
}

function setupScreens () {
  Object.values(SCREENS).forEach(screen => {
    if (screen.setup) screen.setup()
  })
}

export function setup () {
  setupCanvas()
  setupScreens()
}

export function update () {
  const currentState = state.current

  performance.startMeasure("screen_update")
  SCREENS[currentState].update()
  updateDebug()
  performance.stopMeasure("screen_update")

  performance.startMeasure("screen_render")
  SCREENS[currentState].render(canvas, ctx)
  renderDebug(canvas, ctx)
  performance.stopMeasure("screen_render")
}
