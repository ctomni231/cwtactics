import { TILE_SIDE_LENGTH } from "../config/constants.js"
import { input, state, map } from "../state.js"
import * as jslix from "../jslix.js"

const animate = {
  step: 0
}

export function setup () {
  jslix.addImage("../image/cwt_tileset/terrain(C)/CWT_PLIN.png")

  jslix.addImage("../image/cwt_tileset/units/CWT_INFT.png")

  map.width = 10
  map.height = 10
}

export function update () {
  if (input.CANCEL) {
    state.next = "INITIAL"
  }

  animate.step++
  if( animate.step == 3)
    animate.step = 0
}

export function render (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "lightgrey"
  ctx.strokeStyle = "black"

  for (let columnId = 0; columnId < map.width; columnId++) {
    const column = map.tiles[columnId]

    for (let rowId = 0; rowId < map.height; rowId++) {
      const tile = column[rowId]

      ctx.fillRect(
        TILE_SIDE_LENGTH + (columnId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH + (rowId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH,
        TILE_SIDE_LENGTH)

      ctx.drawImage(jslix.getImg(1),
        TILE_SIDE_LENGTH + (columnId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH*0 + (rowId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH,
        TILE_SIDE_LENGTH*2)

      ctx.strokeRect(
        TILE_SIDE_LENGTH + (columnId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH + (rowId * TILE_SIDE_LENGTH),
        TILE_SIDE_LENGTH,
        TILE_SIDE_LENGTH)

      ctx.drawImage(jslix.getImg(2),
        animate.step*32, 0, 32, 32,
        100, 100, 32, 32)

    }
  }
}
