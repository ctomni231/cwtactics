import * as tween from "../tween.js"
import * as gamestate from "../state.js"
import * as jslix from "../jslix.js"
import * as file from "../filelib.js"
import * as fps from "../fps.js"

var colorTween = null
var red = 0
var green = 0
var blue = 0

export function setup() {
  // Sets up JSLix
  //jslix.addColorMap("../image/UnitBaseColors.png")
  //jslix.addColorChange(0, 3)
  //jslix.addImage("../image/cwt_tileset/units/CWT_AAIR.png")

  jslix.addImage("../image/mobile/cwttitle.png")

  // This is to load the Json file
  //json.addFile("./json/options.json")
}

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

  if (!gamestate.input.status.CANCEL) {
    tween.updateTween(colorTween, delta)
  }

  red = parseInt(colorTween.red.value, 10)
  green = parseInt(colorTween.green.value, 10)
  blue = parseInt(colorTween.blue.value, 10)

  // This is to finish testing the dynamic Json functionality
  /*if(json.getFile(0) !== undefined){
    alert(json.getJson(0).select)
  }//*/

}

export function render (canvas, ctx) {

  // Added to get rid of artifacts from dead pictures
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")"
  ctx.fillRect(0,0,canvas.width,canvas.height)

  // This draws the image onto the screen
	ctx.drawImage(jslix.getImg(0), 90, 120, 200, 20)
  //ctx.drawImage(jslix.quickImage("../image/mobile/cwttitle.png"), 10, 120, 200, 20)

  fps.display(ctx, 4, 10)
}
