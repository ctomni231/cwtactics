define("cwt/fog", function() {

	var _calculation_straight_line = function(player) {

	};

	// simple AWDS fog calculation
	var _calculation_simple = function(player) {
		// TODO get variables
		var _units;
		var _properties;
		var _tmp;
		var _i, _e;

		// check units
		for (_i = 0, _e = _units.length; _i < _e; _i++) {
			_tmp = _units[_i];

			// TODO add visible tiles here
		}

		// check properties
		for (_i = 0, _e = _properties.length; _i < _e; _i++) {
			_tmp = _properties[_i];

			// TODO add visible tiles here
		}
	};

	var _playerFogs = {};
	var _fogMode = _calculation_simple;

	var API = {
			
		modes: { 
			SIMPLE: 0,
			EXTENDED: 1 
		},

		/**
		 * Sets the fog mode of the fog controller module.
		 * 
		 * @param mode
		 */
		setFogMode: function( mode )
		{
			if( mode === this.modes.SIMPLE ) 
				_fogMode = _calculation_simple;
			else if( mode === this.modes.EXTENDED ) 
				_fogMode = _calculation_straight_line;
			else
			{
				//TODO error
			}
		},
		
		generateFogMaps : function(){
			
		}
	};

	return API;
});