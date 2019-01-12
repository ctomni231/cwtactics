var loopId = -1
var loopTime = 16

export function setIntervalTime (value) {
  if (value <= 0) {
    throw Error("must be greater equals 1")
  }  
  
  loopTime = value
}
  
export function stopLoop () {
  if (loopId === -1) {
    console.error("could not stop game loop, because no loop is running")
    return
  }
  clearTimeout(loopId)
  loopId = -1
}
  
export function startLoop (loop) {
  var time = new Date().getTime()
   
  console.log("starting game loop with interval " + loopTime + "ms") 
   
  const evaluateLoopAndTriggerNext = function () {
    const now = new Date().getTime()
    const delta = now - time
    
    loop(delta)
    
    loopId = setTimeout(evaluateLoopAndTriggerNext, Math.max(0, loopTime - delta))
    time = now
  }
  
  evaluateLoopAndTriggerNext()
}