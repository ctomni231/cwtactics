(function(){

	var iterable = meow.Class({

		each : function( func ){
			if( typeof func === 'function')
			{
				for( var i in this._data )
					func( i );
			}
			else throw "Argument not a function"
		},

		all : function( func )
		{
			if( typeof func === 'function')
			{
				for( var i in this._data )
					{
					if( func( i ) == false )
						return false;
				}

				return true;
			}
			else throw "Argument not a function"
		},

		any : function( func )
		{
			if( typeof func === 'function')
			{
				for( var i in this._data )
				{
					if( func( i ) == true )
						return true;
				}

				return false;
			}
			else throw "Argument not a function"
		}
	});

	meow.Iterable = iterable;
})();