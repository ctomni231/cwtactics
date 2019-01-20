import * as INITIAL from "./screens/initial.js" 
import { state } from "./state.js"

const canvas = document.querySelector("#gamecanvas")
const ctx = canvas.getContext("2d")

const SCREENS = {
  INITIAL: INITIAL
}

export function setup () {
  Object.values(SCREENS).forEach(screen => {
    if (screen.setup) screen.setup()
  })
}

export function update () {
  SCREENS[state.current].update()  
  SCREENS[state.current].render(canvas, ctx)
}
