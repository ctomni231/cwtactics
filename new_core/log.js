const SOURCE_LOCATION_MODIFIER = 4
const SOURCE_LINE_MODIFIER = 8

function getSourceLocation () {
  var shift = SOURCE_LOCATION_MODIFIER
  var err = null
  try {
    throw new Error()
  } catch(e) {
    err = e
  }
  if (!err) return ['unknown', '']
  var stackLines = err.stack ? err.stack.split('\n') : ''
  var location = stackLines.length >= shift + 1 ? stackLines[shift] + "" : 'unknown location'
  var lineParts = location.split(':')
  var line = (lineParts[lineParts.length - 2] - SOURCE_LINE_MODIFIER) + ""
  return line
}

function logMessageIntoDOM (id, color, msg) {
  var consoleOutElement = document.querySelector("#consoleOut")

  var line = document.createElement('p')
  var callLocationLine = getSourceLocation()
  var args = ['[' + id + ':' + callLocationLine + ']'].concat(msg)
  
  if (consoleOutElement.childNodes.length > 65) {
    for(var i = 0; i < 50; i++) {
      consoleOutElement.removeChild(consoleOutElement.firstChild)
    }
  }
  
  line.innerHTML = args.join(' ')
  line.style.borderTop = '1px dotted gray' 
  line.style.color = color || 'black'  
  
  consoleOutElement.appendChild(line)
  consoleOutElement.scrollTop = consoleOutElement.scrollHeight
}

export function info (msg) {
  logMessageIntoDOM("?", "black", msg)
}

export function error (msg) {
  logMessageIntoDOM("?", "red", msg)
}