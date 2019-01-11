import * as INITIAL from "./screens/initial" 

const canvas = document.querySelector("#gamecanvas")
const ctx = canvas.getContext("2d")

const SCREENS = {
  INITIAL: INITIAL
}

Object.keys(SCREENS).forEach(key => {
  const noop = () => {}
 
  SCREENS[key].update = SCREENS[key].update || noop
  SCREENS[key].render = SCREENS[key].render || noop
})

export function update () {
  SCREENS[data.state.current].update()  
  SCREENS[data.state.current].render(canvas, ctx)
}
