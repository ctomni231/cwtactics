import { input, state, map } from "../state.js"

const TILE_SIDE_LENGTH = 16

export function setup () {
  map.width = 5
  map.height = 5
}

export function update () {
  if (input.CANCEL) {
    state.next = "INITIAL"
  }
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

      ctx.strokeRect(
        TILE_SIDE_LENGTH + (columnId * TILE_SIDE_LENGTH), 
        TILE_SIDE_LENGTH + (rowId * TILE_SIDE_LENGTH), 
        TILE_SIDE_LENGTH,
        TILE_SIDE_LENGTH)
    }
  }
}
