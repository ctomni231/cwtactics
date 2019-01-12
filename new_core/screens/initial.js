import * as tween from "../tween.js"
import * as gamestate from "../state.js"

var colorTween = null
var red = 0
var green = 0
var blue = 0
  
export function update () {
  const delta = gamestate.loop.delta

  if (!colorTween || colorTween.duration.value == colorTween.duration.target) {
    const newRed = parseInt(Math.random() * 256, 10)
    const newGreen = parseInt(Math.random() * 256, 10)
    const newBlue = parseInt(Math.random() * 256, 10)
    
    colorTween = tween.createTween({
      red: newRed,
      green: newGreen,
      blue: newBlue,
      duration: 500
    })
    
    tween.prepareTween(colorTween, {
      red: red,
      green: green,
      blue: blue
    })
  }
  
  tween.updateTween(colorTween, delta)
  
  red = parseInt(colorTween.red.value, 10)
  green = parseInt(colorTween.green.value, 10)
  blue = parseInt(colorTween.blue.value, 10)
}

export function render (canvas, ctx) {
  ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")"
  ctx.fillRect(0,0,canvas.width,canvas.height)
}