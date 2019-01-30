import { MAX_MAP_HEIGHT, MAX_MAP_WIDTH } from "./config/constants.js"
import { createList } from "./utils.js"

export const performance = {}

export const state = {
  current: null,
  next: null,

  // Expanding state to include the fps counter
  fps: true
}

export const map = {
  width: 0,
  height: 0,
  tiles: createList(MAX_MAP_WIDTH, (columnId) =>
    createList(MAX_MAP_HEIGHT, (rowId) => ({
      type: null
    })))
}

export const input = {}

export const loop = {
  delta: 0
}

export const version = "0.1 Alpha"