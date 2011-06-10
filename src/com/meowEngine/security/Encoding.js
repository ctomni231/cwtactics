(function(){

	var encoders = {};
	var defaultEncoder = null;

	meow.registerEncoder = function( name, registerFunc ){

		// test function
		if( typeof registerFunc("Test") !== 'string' )
			throw "register function seems to have an illegal API";

		encoders[name] = registerFunc;
	};

	meow.setEncoder = function( name ){
	
		if( typeof encoder[name] !== 'undefined' )
			defaultEncoder = name;
	};

	meow.encode = function( str , algorithm ){

		if( typeof algorithm === 'undefined' && defaultEncoder != null )
			algorithm = defaultEncoder;

		return encoders[algorithm](str);
	};
})();