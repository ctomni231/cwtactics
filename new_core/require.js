
var dropinRequire = function( moduleId, root ) {
	if ( !root ) {
		root = ''
	}
	// add the .js to module names
	if ( !moduleId.match(/.js$/) ) {
		moduleId += '.js';
	}

	if( moduleId in dropinRequire.cache ) {
		return dropinRequire.cache[moduleId];
	}
	var req	= new XMLHttpRequest();
	var modulePath = moduleId;
	if ( modulePath.match(/^\.+\//) ) {
		modulePath = root + modulePath;
	}
	req.open('GET', modulePath, false);
	req.send(null);
	if( req.status != 200 ) {
		throw new Error(req);
	}

	var txt	= [
		dropinRequire.prefix,
		req.responseText,
		dropinRequire.suffix(moduleId, root),
	].join('\n');

	return dropinRequire.cache[moduleId] = eval(txt);
}
dropinRequire.cache	= {};
dropinRequire.prefix = [
		'(function(root, id){',
			'var _module = { exports: {} };',
			'var _require = function(moduleId){',
				'return dropinRequire(moduleId, root)',
			'};',
			'(function(module, exports, require){',
			'  var logInfo = dropinRequire.createInfoLogger(id);',
            '  var logError = dropinRequire.createErrorLogger(id);'
	].join('\n'),

// Here goes the javascript with commonjs modules
dropinRequire.suffix = function(moduleId, root){
	var parts;

	if ( moduleId && (parts = moduleId.match( /\/([^\/]+)$/ )) ) {
		root += moduleId.slice(0, moduleId.lastIndexOf( parts[0] ) + 1);
	}

	return [
			'})(_module, _module.exports, _require);',
			'return _module.exports;',
		'})("' + root + '", "' + moduleId + '");',
	].join('\n');
}

// to handle the replacement of "require" function
// - TODO do i need a global
dropinRequire.prevRequire = require;
/**
 * dropinRequire.noConflict
 * - attemps to make a jQuery-like noConflict
 * - check and make it work
*/
dropinRequire.noConflict	= function(){	// no removeAll ?
	require	= dropinRequire.prevRequire;
	return dropinRequire;
}

dropinRequire.SOURCE_LOCATION_MODIFIER = 4
dropinRequire.SOURCE_LINE_MODIFIER = 8

dropinRequire.getSourceLocation = function () {
  var shift = dropinRequire.SOURCE_LOCATION_MODIFIER
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
  var line = (lineParts[lineParts.length - 2] - dropinRequire.SOURCE_LINE_MODIFIER) + ""
  return line
}

dropinRequire.logMessageIntoDOM = function (id, color, msg) {
  var consoleOutElement = document.querySelector("#consoleOut")

  var line = document.createElement('p')
  var callLocationLine = dropinRequire.getSourceLocation()
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

dropinRequire.createInfoLogger = function (id) {
  return function(msg) {
    dropinRequire.logMessageIntoDOM(id, "black", "[INFO] " + msg)
  }
} 

dropinRequire.createErrorLogger = function (id) {
  return function(msg) {
    dropinRequire.logMessageIntoDOM(id, "red", "[ERROR] " + msg)
  }
}     

var require = dropinRequire;