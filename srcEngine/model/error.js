util.scoped(function(){

// Based on:
// http://www.eriwen.com/javascript/js-stack-trace/
function getStackTrace(){
  var callstack = [];
  var isCallstackPopulated = false;
  try {
    i.dont.exist+=0; //doesn't exist- that's the point
  } catch(e) {
    if (e.stack) { //Firefox
      var lines = e.stack.split('\n');
      for (var i=0, len=lines.length; i&lt;len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          callstack.push(lines[i]);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
    else if (window.opera && e.message) { //Opera
      var lines = e.message.split('\n');
      for (var i=0, len=lines.length; i&lt;len; i++) {
        if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
          var entry = lines[i];
          //Append next line also since it has the file info
          if (lines[i+1]) {
            entry += ' at ' + lines[i+1];
            i++;
          }
          callstack.push(entry);
        }
      }
      //Remove call to printStackTrace()
      callstack.shift();
      isCallstackPopulated = true;
    }
  }
  if (!isCallstackPopulated) { //IE and Safari
    var currentFunction = arguments.callee.caller;
    while (currentFunction) {
      var fn = currentFunction.toString();
      /*
      var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf('')) || 'anonymous';
      callstack.push(fname);
      currentFunction = currentFunction.caller;
      */
      //If we can't get the function name set to "anonymous"
			var fname = fn.substring(fn.indexOf("function") + 8, fn.indexOf("(")) || "anonymous";
			var args = currentFunction.arguments.length + ' args (';
			for (var i=0; i<currentFunction.arguments.length; i++)	args += i + '=' + currentFunction.arguments[i] + ' ' + args += ')';
			callstack.push(fname + ' ' + args);

			currentFunction = currentFunction.caller;
    }
  }
  
  return callstack;
}

// Define event
controller.defineEvent("criticalError");

// Called when a known/catched error will be recognized 
// by the engine. This function throws the `criticalError`
// event which allows the client to render error messages
// (*e.g. for debug mode*).
//
// @param {Number} errorId error id
// @param {Number} errorData error data id
model.criticalError = function( errorId, errorData ){
  
  util.log( getStackTrace().join("  -> \n") );
  
  // TODO: grab action stack data
  var stackData = null;
  
  // Invoke event     
  var evCb = controller.events.criticalError;  
  if( evCb ) evCb( errorId, errorData, stackData );
  
  // Log error
  util.error( errorId, errorData, stackData );       
};

});