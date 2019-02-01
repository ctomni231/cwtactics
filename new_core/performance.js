import * as state from "./state.js"

const measures = state.performance

export function startMeasure (measureId) {
  if (!measures[measureId]) {
    measures[measureId] = {
      numberOfIterations: 0,
      lastDuration: 0,
      averageDuration: 0,
      lastTimestamp: -1,
      count: 0,
      frame: 0,

      tfps: 0,
      jfps: 0
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
  const sumOfAllPreviousDurations = measureData.averageDuration * measureData.numberOfIterations
  const sumOfAllDurations = sumOfAllPreviousDurations + duration
  const newAvarageDuration = parseInt(sumOfAllDurations / (measureData.numberOfIterations + 1), 10)
  const tfps = parseInt(1000 / (duration || 1), 10)

  measureData.frame += duration
  measureData.count++
  while(measureData.frame > 1000){
    measureData.frame -= 1000
    measureData.jfps = measureData.count;
    measureData.count = 0;
  }

  measureData.tfps = tfps
  measureData.numberOfIterations++
  measureData.averageDuration = newAvarageDuration
  measureData.lastDuration = duration
  measureData.lastTimestamp = timestamp
}

export function getMeasureData (measureId) {
  const measureData = measures[measureId]

  if (!measureData) {
    throw new Error("illegal measure id")
  }

  return measureData
}
