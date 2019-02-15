import { cursor, map, units } from "../state.js"
import { SCREEN_HEIGHT_IN_TILES, SCREEN_WIDTH_IN_TILES, SCREEN_HEIGHT, SCREEN_WIDTH } from "../config/constants.js"

let positionData = ""
let tileData
let unitData = ""

export function update () {
  const x = cursor.map.x
  const y = cursor.map.y
  const tile = map.tiles[x][y]
  const unit = tile.unitId >= 0 ? units[tile.unitId] : null 

  positionData = "[ " + x + " - " + y + " ]"
  tileData = tile.typeId
  unitData = !!unit ? unit.typeId : ""
}

export function render (ctx) {

  const width = 100
  const height = 55
  const sx = cursor.screen.x < (SCREEN_WIDTH_IN_TILES/2) ? SCREEN_WIDTH - width - 5 : 0
  const sy = SCREEN_HEIGHT - height - 5
  
  ctx.fillStyle = "black"
  ctx.fillRect(sx, sy, width, height)
  
  ctx.fillStyle = "white"
  ctx.fillRect(sx + 1, sy + 1, 98, height - 2)
  
  ctx.fillStyle = "black"
  ctx.fillText(positionData, sx + 5, sy + 15)
  ctx.fillText(tileData, sx + 5, sy + 30) 
  ctx.fillText(unitData, sx + 5, sy + 45)  
}