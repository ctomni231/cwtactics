import { 
  MAX_MAP_HEIGHT, 
  MAX_MAP_WIDTH, 
  MAX_UNITS_PER_PLAYER,
  MAX_PLAYERS,
  SCREEN_WIDTH_IN_TILES, 
  SCREEN_HEIGHT_IN_TILES
} from "./config/constants.js"

import { createList } from "./utils.js"

export const performance = {}

export const state = {
  current: null,
  next: null
}

export const cursor = { 
  x: 0, 
  y: 0,
  selected: {
    unit: null,
    property: null
  }
}

export const screen = {
  x: 0,
  y: 0,  
  minimumX: 0,
  minimumY: 0,
  maximumX: 0,
  maximumY: 0,
  width: SCREEN_WIDTH_IN_TILES,
  height: SCREEN_HEIGHT_IN_TILES
}

export const map = {
  width: 0,
  height: 0,
  tiles: createList(MAX_MAP_WIDTH, (columnId) =>
    createList(MAX_MAP_HEIGHT, (rowId) => ({
      typeId: null,
      unitId: -1
    })))
}

export const players = createList(MAX_PLAYERS, (id) => ({ 
  id: id
}))

export const units = createList(MAX_UNITS_PER_PLAYER * MAX_PLAYERS, (id) => ({
  id: id,
  ownerId: -1,
  typeId: null
}))

export const input = {}

export const loop = {
  delta: 0
}

export const version = "0.1 Alpha"