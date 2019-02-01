import { TILE_SIDE_LENGTH } from "../config/constants.js"
import { input, state, map, cursor } from "../state.js"
import * as jslix from "../jslix.js"

const animate = {
  step: 0
}

export function setup () {
  jslix.addImage("../image/cwt_tileset/terrain(C)/CWT_PLIN.png")

  jslix.addColorMap("../image/UnitBaseColors.png")
  jslix.addFlipX()
  jslix.addColorChange(0, 5)
  jslix.addImage("../image/cwt_tileset/units/CWT_INFT.png")

  jslix.addColorChange(0, 8)
  jslix.addImage("../image/cwt_tileset/units/CWT_MECH.png")

  map.width = 10
  map.height = 10
}

export function update () {
  if (input.CANCEL) {
    state.next = "INITIAL"
  }

  if (input.LEFT ) cursor.map.x = Math.max(cursor.map.x - 1, 0)
  if (input.RIGHT) cursor.map.x = Math.min(cursor.map.x + 1, map.width - 1)
  if (input.UP   ) cursor.map.y = Math.max(cursor.map.y - 1, 0)
  if (input.DOWN ) cursor.map.y = Math.min(cursor.map.y + 1, map.height - 1) 

  animate.step++
  if( animate.step == 3)
    animate.step = 0
}

function renderCursor(ctx) {
  ctx.strokeStyle = "black"
  ctx.strokeRect(
    TILE_SIDE_LENGTH * cursor.map.x, 
    TILE_SIDE_LENGTH * cursor.map.y, 
    TILE_SIDE_LENGTH, TILE_SIDE_LENGTH)
}

function renderTestUnits(ctx) {
  ctx.drawImage(jslix.getImg(2), animate.step*32, 0, 32, 32, 100, 100, 32, 32)
  ctx.drawImage(jslix.getImg(3), animate.step*32, 0, 32, 32, 50, 50, 32, 32)
}

export function render (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "lightgrey"
  ctx.strokeStyle = "black"

  for (let columnId = 0; columnId < map.width; columnId++) {
    const column = map.tiles[columnId]

    for (let rowId = 0; rowId < map.height; rowId++) {
      const tile = column[rowId]

      ctx.drawImage(jslix.getImg(1),
        (columnId * TILE_SIDE_LENGTH),
        -TILE_SIDE_LENGTH + (rowId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH, TILE_SIDE_LENGTH*2)
    }
  }

  renderTestUnits(ctx)
  renderCursor(ctx)
}
