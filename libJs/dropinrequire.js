"use strict";

var dropinRequire	= function(moduleId){
    if( moduleId in dropinRequire.cache )	return dropinRequire.cache[moduleId]
    var req	= new XMLHttpRequest();
    req.open('GET', moduleId, false);
    req.send(null);
    if(req.status != 200)	throw new Error(req)
    var txt	= dropinRequire.prefix + req.responseText + dropinRequire.suffix;
    return dropinRequire.cache[moduleId] = eval(txt);
}
dropinRequire.cache	= {};
dropinRequire.prefix	= "(function(){"+
"	var _module	= { exports: {} };"+
"	var _require	= function(moduleId){"+
"		return dropinRequire(moduleId)"+
"	};"+
"	(function(module, exports, require){";
// Here goes the javascript with commonjs modules
dropinRequire.suffix	= "	})(_module, _module.exports, _require);"+
"	return _module.exports;"+
"})();";

// to handle the replacement of "require" function
// - TODO do i need a global
dropinRequire.prevRequire	= require;
/**
 * dropinRequire.noConflict
 * - attemps to make a jQuery-like noConflict
 * - check and make it work
 */
dropinRequire.noConflict	= function(){	// no removeAll ?
    require	= dropinRequire.prevRequire;
    return dropinRequire;
}
var require	= dropinRequire;