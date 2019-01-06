var loopId = -1
var loopTime = 16

exports.setIntervalTime = function (value) {
  if (value <= 0) {
    throw Error("must be greater equals 1")
  }  
  
  loopTime = value
}
  
exports.stopLoop = function () {
  if (loopId === -1) {
    logError("could not stop game loop, because no loop is running")
    return
  }
  clearTimeout(this.intervalId)
  loopId = -1
}
  
exports.startLoop = function (loop) {
  var time = new Date().getTime()
   
  const evaluateLoopAndTriggerNext = function () {
    const now = new Date().getTime()
    const delta = now - time
    
    loop(delta)
    
    setTimeout(evaluateLoopAndTriggerNext, Math.max(0, delta + loopTime))
    time = now
  }
  
  evaluateLoopAndTriggerNext()
}