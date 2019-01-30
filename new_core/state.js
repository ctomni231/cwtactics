import {
  MAX_MAP_HEIGHT,
  MAX_MAP_WIDTH
} from "./config/constants.js"

function createArray(numberOfEntries, defaultValueSupplier) {
  const array = []

  for (let i = numberOfEntries - 1; i >= 0; i--) {
    array.push(defaultValueSupplier(i))
  }

  return array
}

export const state = {
  current: null,
  next: null,

  // Expanding state to include the fps counter
  fps: true
}

export const map = {
  width: 0,
  height: 0,
  tiles: createArray(MAX_MAP_WIDTH, (columnId) =>
    createArray(MAX_MAP_HEIGHT, (rowId) => ({
      type: null
    })))
}

export const input = {}

export const loop = {
  delta: 0
}

export const version = "0.1 Alpha"