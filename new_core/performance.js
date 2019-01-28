const measures = {}

// Merging fps.js with performance.js
const time = {

  jfps: 0,
  tfps: 0,
  count: 0,
  frame: 0,

  nowTime: 0,
  lastTime: 0,
  diffTime: 0
}

export function startMeasure (measureId) {
  if (!measures[measureId]) {
    measures[measureId] = {
      numberOfIterations: 0,
      lastDuration: 0,
      averageDuration: 0,
      lastTimestamp: -1
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

// default lx=4, ly=10
export function display(ctx, lx, ly, bg) {
  time.nowTime = new Date().getTime();
  time.diffTime = time.nowTime - time.lastTime;
  time.tfps = parseInt(1000 / (time.diffTime || 1), 10);
  time.frame += time.diffTime;
  time.count++;
  if(time.frame > 1000){
     time.frame -= 1000;
     if(time.frame > 1000){
       time.frame = 0
     }
     time.jfps = time.count;
     time.count = 0;
  }

  if(bg == true){
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 100, 10);
  }
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 10px sans-serif';
  ctx.fillText('FPS: ' + time.jfps + ' [' + time.tfps + ']', lx, ly);

  time.lastTime = time.nowTime;
}
