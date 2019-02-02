export function createTween (targets) {
  const data = {}
  
  Object.keys(targets).forEach(key => {
    data[key] = {
      diff: targets[key],
      changePerMs: 0,
      value: targets[key],
      target: targets[key]
    }
  })

  return data
}

export function prepareTween (tween, startData) {
  Object.keys(startData).forEach(key => {
    const property = tween[key]
    
    if (!property) {
      throw new Error("unknown tween property " + key)
    }
    
    property.diff = Math.abs(startData[key] - property.target)
    property.changePerMs = property.diff / tween.duration.target
    property.value = startData[key]
    property.source = startData[key]
    
    if (property.value > property.target) {
      property.changePerMs = -property.changePerMs
    }
  })
  
  tween.duration.diff = tween.duration.target
  tween.duration.changePerMs = 1
  tween.duration.value = 0
}

export function updateTween (tween, looped, delta) {
  var keys = Object.keys(tween)
  
  for(var i = 0; i < keys.length; i++) {
    var property = tween[keys[i]]
    var shift = property.changePerMs * delta
    
    property.value += shift
    
    if ((property.changePerMs > 0 && property.value > property.target) || 
        (property.changePerMs < 0 && property.value < property.target)) {
      property.value = property.target
    }


    if (looped && property.value === property.target) {
      property.value = property.source
    }
  }
}