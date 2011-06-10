(function(){

	var dict = meow.Class( meow.Iterable, /** @lends meow.Map# */{

		/** @private */
		_data : {},

		/**
		 * Removes a key from the dictionary.
		 */
		remove : function( key )
		{
			delete this._data[ key ];
		},

		/**
		 * Removes a value from the dictionary. Only the first key, that is
		 * associated with the value, will be deleted.
		 *
		 * @return {Boolean} true, if a key was deleted, else false
		 */
		removeValue : function( val )
		{
			for( i in this._data )
			{
				if( this._data[i] == val )
				{
					this.remove( i );
					return true;
				}
			}

			return false;
		},

		/**
		 * Sets the value, that will be associated with the key.
		 *
		 * @param {String} key
		 * @param val value
		 */
		put : function( key, val )
		{
			this._data[key] = val;
		},

		/**
		 * Returns the value, that is associated with the key.
		 *
		 * @param {String} key
		 */
		get : function( key )
		{
			return this._data[key];
		},

		/**
		 * Returns true, if the key exists, else false
		 *
		 * @param {String} key
		 */
		has : function( key )
		{
			return ( typeof this._data[key] !== 'undefined' )
		},

		/**
		 * Removes all keys from the dictionary.
		 */
		clear : function()
		{
			var i;
			var array = [];

			for( i in this._data )
				array.push( i );

			for( i = 0 ; i < array.length ; i++ )
				delete this._data[ array[i] ];

			array = null;
		},

		size : function()
		{
			var i,n;

			n = 0;
			for( i in this._data )
				n++;

			return n;
		}
	});

	meow.extendClass( dict, meow.Iterable );

	/**
	 * Dictionary class, that implements the java HashMap behaviour to the
	 * Meow Engine.
	 *
	 * @author tapsi
	 * @since 26.05.2011
	 *
	 * @class
	 */
	meow.Map = dict;
})();