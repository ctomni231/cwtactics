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
  clearTimeout(loopId)
  loopId = -1
}
  
exports.startLoop = function (loop) {
  var time = new Date().getTime()
   
  logInfo("starting game loop with interval " + loopTime + "ms") 
   
  const evaluateLoopAndTriggerNext = function () {
    const now = new Date().getTime()
    const delta = now - time
    
    loop(delta)
    
    loopId = setTimeout(evaluateLoopAndTriggerNext, Math.max(0, loopTime - delta))
    time = now
  }
  
  evaluateLoopAndTriggerNext()
}