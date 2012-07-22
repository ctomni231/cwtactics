cwt.script = {
	
	compile: function( str ){
		var parts;
		var fn, fnT;
		var code;
		
		fnT.push("fn = function(){");
		
		fnT = [];
		parts = str.split("->");
		if( parts.length === 2 ){
			// SELECTOR
			fnT.push( code );
		}
		
		parts = str.split(":");
		if( parts.length === 2 ){
			// CONDITION
			fnT.push( code );
		}
		
		// ACTION
		fnT.push( code );
		fnT.push("}");
		
		eval( fnT.join("") );
		
		// return compiled fn
		return fn;
	}
};