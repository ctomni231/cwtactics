import {
  TILE_SIDE_LENGTH
} from "../config/constants.js"

import {
  input,
  state,
  map,
  units,
  cursor,
  loop,
  screen
} from "../state.js"

import {
  iterateMatrix,
  numberOrBoundary
} from "../utils.js"

import * as jslix from "../jslix.js"
import * as cwtimg from "../cwtimg.js"

import {
  createTween,
  prepareTween,
  updateTween
} from "../tween.js"

import * as tileInfo from "../traits/tileInfo.js"

import {
  isInLowerBoundary,
  isInUpperBoundary,
  moveScreen,
  BOUNDARY_X,
  BOUNDARY_Y
} from "../scrollable.js"

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

  screen.maximumX = map.width - 1
  screen.maximumY = map.height - 1
}

export function setup () {
  cwtimg.addImage("../image/cwt_tileset/terrain(C)/CWT_PLIN.png")

  cwtimg.addColorMap("../image/UnitBaseColors.png")
  cwtimg.addCWTImage("../image/cwt_tileset/units/CWT_INFT.png", 0, 3, 1)
  cwtimg.addCWTImage("../image/cwt_tileset/units/CWT_MECH.png", 0, 8, 0)

  jslix.addColorChange(0, 0, 0, 255, 255, 0, 0, 255, 0)
  jslix.addRotatePixels()
  jslix.addFlipY()
  jslix.addFontImage("Advance Wars")

  jslix.addPixelDrop(0, 0, -20, 100, 0)
  jslix.addPixelDrop(0, 0, 50, 50, 0)
  jslix.addCutPixelDrop(0, 0, 70, 13, 0, 50, 50, 100, 0)
  jslix.addColorBox(255,255,255,255,100,150)

  jslix.addTextInfo(6, 5, 0, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  jslix.addTextMap("../image/menu/BasicAlpha.png")

  jslix.addTextImage(0, "ADVANCE WARS")
  //jslix.addTextImage(0, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")

  prepareTween(animationData, { step: 0 })

  setupTestMap()
}

export function update () {
  if (input.CANCEL) {
    state.next = "INITIAL"
  }

  const shiftX = (input.LEFT ? -1 : (input.RIGHT ? +1 : 0))
  const shiftY = (input.UP ? -1 : (input.DOWN ? +1 : 0))

  cursor.x = numberOrBoundary(0, map.width - 1, cursor.x + shiftX)
  cursor.y = numberOrBoundary(0, map.height - 1, cursor.y + shiftY)

  const shouldShiftScreenOnXAxis =
    (shiftX < 0 && isInLowerBoundary(3, BOUNDARY_X, cursor.x)) ||
    (shiftX > 0 && isInUpperBoundary(3, BOUNDARY_X, cursor.x))

  const shouldShiftScreenOnYAxis =
    (shiftY < 0 && isInLowerBoundary(3, BOUNDARY_Y, cursor.y)) ||
    (shiftY > 0 && isInUpperBoundary(3, BOUNDARY_Y, cursor.y))

  if (shouldShiftScreenOnXAxis) {
    moveScreen(BOUNDARY_X, shiftX)
  }

  if (shouldShiftScreenOnYAxis) {
    moveScreen(BOUNDARY_Y, shiftY)
  }

  updateTween(animationData, true, loop.delta)
  tileInfo.update()
}

function renderCursor(ctx) {
  ctx.strokeStyle = "black"
  ctx.strokeRect(
    TILE_SIDE_LENGTH * (cursor.x - screen.x),
    TILE_SIDE_LENGTH * (cursor.y - screen.y),
    TILE_SIDE_LENGTH, TILE_SIDE_LENGTH)
}

function renderTiles (ctx) {
 for (let columnId = screen.x;
          columnId < (screen.x + screen.width);
          columnId++) {

    const column = map.tiles[columnId]

    for (let rowId = screen.y;
             rowId < (screen.y + screen.height);
             rowId++) {

      const tile = column[rowId]
      const screenX = (columnId - screen.x) * TILE_SIDE_LENGTH
      const screenY = -TILE_SIDE_LENGTH + ((rowId - screen.y) * TILE_SIDE_LENGTH)
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

 for (let columnId = screen.x;
          columnId < (screen.x + screen.width);
          columnId++) {

    const column = map.tiles[columnId]

    for (let rowId = screen.y;
             rowId < (screen.y + screen.height);
             rowId++) {

      const tile = column[rowId]
      const screenX = (columnId - screen.x) * TILE_SIDE_LENGTH
      const screenY = -TILE_SIDE_LENGTH + ((rowId - screen.y) * TILE_SIDE_LENGTH)

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

  ctx.drawImage(jslix.getImg(4), 0, 0)

  ctx.drawImage(jslix.getImg(5), 225, 0)

  ctx.drawImage(jslix.getImg(6), 100, 100)
}
