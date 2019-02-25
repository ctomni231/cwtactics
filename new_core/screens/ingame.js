import { SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIDE_LENGTH } from "../config/constants.js"
import { input, state, map, units, cursor, loop } from "../state.js"
import { iterateMatrix } from "../utils.js"
import * as cwtimg from "../cwtimg.js"
import * as jslix from "../jslix.js"
import { createTween, prepareTween, updateTween } from "../tween.js"
import * as tileInfo from "../traits/tileInfo.js"

const animationData = createTween({
  step: 3,
  duration: 750
})

const tempIdMap = {
  "CWT_PLIN": 1,
  "CWT_INFT": 2,
  "CWT_MECH": 3
}

function setupTestMap () {
  map.width = 25
  map.height = 20

  iterateMatrix(map.width, map.height, (x, y) => {
    map.tiles[x][y].typeId = "CWT_PLIN"
  })

  units[0].ownerId = 0
  units[0].typeId = "CWT_INFT"

  units[1].ownerId = 1
  units[1].typeId = "CWT_MECH"

  map.tiles[2][2].unitId = 0
  map.tiles[5][5].unitId = 1
}

export function setup () {
  cwtimg.addImage("../image/cwt_tileset/terrain(C)/CWT_PLIN.png")

  cwtimg.addColorMap("../image/UnitBaseColors.png")
  cwtimg.addCWTImage("../image/cwt_tileset/units/CWT_INFT.png", 0, 3, 1)
  cwtimg.addCWTImage("../image/cwt_tileset/units/CWT_MECH.png", 0, 8, 0)

  jslix.addColorChange(0, 0, 0, 255, 255, 0, 0, 255, 0)
  jslix.addPixelDrop(0, 0, -20, 100, 0)
  jslix.addPixelDrop(0, 0, 50, 50, 0)
  jslix.addCutImageDrop(0, 0, 70, 0, 0, 50, 50)
  //jslix.addFontImage("Advance Wars")
  jslix.addColorBox(255,255,255,255,100,100)

  prepareTween(animationData, { step: 0 })

  setupTestMap()
}

export function update () {
  if (input.CANCEL) {
    state.next = "INITIAL"
  }

  if (input.LEFT ) cursor.map.x = Math.max(cursor.map.x - 1, 0)
  else if (input.RIGHT) cursor.map.x = Math.min(cursor.map.x + 1, map.width - 1)

  if (input.UP   ) cursor.map.y = Math.max(cursor.map.y - 1, 0)
  else if (input.DOWN ) cursor.map.y = Math.min(cursor.map.y + 1, map.height - 1)

  cursor.screen.x = cursor.map.x
  cursor.screen.y = cursor.map.y

  updateTween(animationData, true, loop.delta)
  tileInfo.update()
}

function renderCursor(ctx) {
  ctx.strokeStyle = "black"
  ctx.strokeRect(
    TILE_SIDE_LENGTH * cursor.map.x,
    TILE_SIDE_LENGTH * cursor.map.y,
    TILE_SIDE_LENGTH, TILE_SIDE_LENGTH)
}

function renderTiles (ctx) {
 for (let columnId = 0; columnId < map.width; columnId++) {
    const column = map.tiles[columnId]

    for (let rowId = 0; rowId < map.height; rowId++) {
      const tile = column[rowId]
      const screenX = columnId * TILE_SIDE_LENGTH
      const screenY = -TILE_SIDE_LENGTH + (rowId * TILE_SIDE_LENGTH)
      const tileImageId = tempIdMap[tile.typeId]

      ctx.drawImage(
        cwtimg.getImg(tileImageId),
        screenX, screenY,
        TILE_SIDE_LENGTH, TILE_SIDE_LENGTH * 2)
    }
  }
}

function renderUnits (ctx) {
  const unitAnimationStep = parseInt(animationData.step.value, 10)

  for (let columnId = 0; columnId < map.width; columnId++) {
    const column = map.tiles[columnId]

    for (let rowId = 0; rowId < map.height; rowId++) {
      const tile = column[rowId]
      const screenX = columnId * TILE_SIDE_LENGTH
      const screenY = -TILE_SIDE_LENGTH + (rowId * TILE_SIDE_LENGTH)

      if (tile.unitId >= 0) {
        const unitImageId = tempIdMap[units[tile.unitId].typeId]

        ctx.drawImage(
          cwtimg.getImg(unitImageId),
          unitAnimationStep * TILE_SIDE_LENGTH * 2, 0,
          TILE_SIDE_LENGTH * 2, TILE_SIDE_LENGTH * 2,
          screenX-(TILE_SIDE_LENGTH/2), screenY+(TILE_SIDE_LENGTH/2),
          TILE_SIDE_LENGTH * 2, TILE_SIDE_LENGTH * 2)
      }
    }
  }
}

export function render (canvas, ctx) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.fillStyle = "lightgrey"
  ctx.strokeStyle = "black"

  renderTiles(ctx)
  renderUnits(ctx)
  renderCursor(ctx)
  tileInfo.render(ctx)

  ctx.drawImage(jslix.getImg(4), SCREEN_WIDTH - 150, 0)
}
