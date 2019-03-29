import {
  numberOrBoundary
} from "./utils.js"

import {
  screen
} from "./state.js"

export const BOUNDARY_X = 1
export const BOUNDARY_Y = 2

export function moveScreen(type, value) {
  if (type != BOUNDARY_X && type != BOUNDARY_Y) {
    throw Error("illegal movement type")
  }

  const screenPos = type == BOUNDARY_X ? screen.x : screen.y
  const screenLength = type == BOUNDARY_X ? screen.width : screen.height
  const lowerBoundary = type == BOUNDARY_X ? screen.minimumX : screen.minimumY
  const upperBoundary = type == BOUNDARY_X ? screen.maximumX : screen.maximumY

  const newValue = numberOrBoundary(
    lowerBoundary,
    Math.abs(upperBoundary - screenLength, 0),
    screenPos + value)

  if (type == BOUNDARY_X) screen.x = newValue
  if (type == BOUNDARY_Y) screen.y = newValue
}

export function isInLowerBoundary(range, type, value) {
  if (type != BOUNDARY_X && type != BOUNDARY_Y) {
    throw Error("illegal movement type")
  }

  const relativePos = type == BOUNDARY_X ?
    value - screen.x : value - screen.y

  const upperBoundary = type == BOUNDARY_X ?
    screen.x + screen.width : screen.y + screen.height

  return relativePos - range <= 0
}

export function isInUpperBoundary(range, type, value) {
  if (type != BOUNDARY_X && type != BOUNDARY_Y) {
    throw Error("illegal movement type")
  }

  const relativePos = type == BOUNDARY_X ?
    value - screen.x : value - screen.y

  const upperBoundary = type == BOUNDARY_X ?
    screen.x + screen.width : screen.y + screen.height

  return relativePos + range >= upperBoundary
}