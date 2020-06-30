// Need to make a simple debug just to test the trait system and
// see if it works as intended. If it does, then we can expand it
// into a more complicated debug performance system

// These are leftovers from state.js

export const state = {
  current: null,
  next: null
}

export const input = {}

export const loop = {
  delta: 0
}

export const view = {
  sizex: 0,
  sizey: 0,
  lscape: 0
}

export const engversion = "0.1 Alpha"

// This is the update function for gamecontroller.js
export function update (delta) {
  // Forgot to put in this
  loop.delta = delta
  updateState()
}

// This is the update function for statemachine.js
export function updateState(){
  const nextState = state.next

  if (nextState !== null){
    state.current = nextState
    state.next = null
  }
}

// Contains performance.js

// This was the only thing from ./config/constants.js
const UNSTABLE_PERFORMANCE_RELATED_TO_AVERAGE_DURATION_FACTOR = 2

// Instead of an import, let this be a standalone
export const measures = {}

export function startMeasure (measureId) {
  if (!measures[measureId]) {
    measures[measureId] = {
      accumulatedIterations: 0,
      accumulatedDurations: 0,
      accumulatedFrames: 0,
      lastDuration: 0,
      lastTimestamp: -1,
      averageDuration: 0,
      preciseAverageDuration: 0,
      unstable: false,
      fps: 0,
      tps: 0
    }
  }

  const measureData = measures[measureId]
  const timestamp = new Date().getTime()

  measureData.lastTimestamp = timestamp
}

export function stopMeasure (measureId) {
  const measureData = measures[measureId]

  if (!measureData) {
    throw new Error("illegal measure id")
  }

  if (measureData.lastTimestamp === -1) {
    throw new Error("measure for given measureId was not started before")
  }

  const timestamp = new Date().getTime()
  const duration = timestamp - measureData.lastTimestamp
  const sumOfAllPreviousDurations = measureData.preciseAverageDuration * measureData.accumulatedIterations
  const sumOfAllDurations = sumOfAllPreviousDurations + duration
  const newPreciseAvarageDuration = sumOfAllDurations / (measureData.accumulatedIterations + 1)

  let accumulatedDuration = measureData.accumulatedDurations + duration
  let framesInAccumulatedDuration = measureData.accumulatedFrames + 1
  let fps = measureData.fps
  let unstable = measureData.unstable

  if (accumulatedDuration >= 1000) {
    fps = parseInt(framesInAccumulatedDuration / (accumulatedDuration / 1000), 10)
    accumulatedDuration = 0
    framesInAccumulatedDuration = 0
    unstable = duration > measureData.averageDuration * UNSTABLE_PERFORMANCE_RELATED_TO_AVERAGE_DURATION_FACTOR
  }

  measureData.unstable = unstable
  measureData.accumulatedDurations = accumulatedDuration
  measureData.accumulatedFrames = framesInAccumulatedDuration
  measureData.fps = fps
  measureData.tps = parseInt(1000 / (duration || 1), 10);
  measureData.accumulatedIterations++
  measureData.preciseAverageDuration = newPreciseAvarageDuration
  measureData.averageDuration = parseInt(newPreciseAvarageDuration, 10)
  measureData.lastDuration = duration
  measureData.lastTimestamp = timestamp
  measureData.slowdowns = measureData.slowdowns + (duration > 16 ? 1 : 0)
}

export function getMeasureData (measureId) {
  const measureData = measures[measureId]

  if (!measureData) {
    throw new Error("illegal measure id")
  }

  return measureData
}
