(function(){

	var array = meow.Class( meow.Iterable, /** @lends meow.Array# */ {

		/** @private holds all data from the array */
		_data : null,

		constructor : function( initSize )
		{
			this._data = ( initSize && initSize > 0)? new Array(initSize) : [];
		},

		add : function( obj )
		{
			this._data.push( obj );
		},

		push : function( obj )
		{
			this._data.push( obj );
		},

		set : function( index, obj )
		{
			this._data[ index ] = obj;
		},

		pop: function( obj )
		{
			return this._data.pop();
		},

		get : function( index )
		{
			return this._data[ index ];
		},

		/**
		 * Removes a range from the array.
		 * fromt , to inclusive
		 * by John Resig (MIT Licensed)
		 */
		removeRange : function(from, to)
		{
			var rest = this._data.slice((to || from) + 1 || this._data.length);
			this._data.length = from < 0 ? this.length + from : from;
			return this._data.push.apply(this, rest);
		},

		/**
		 * Removes an index from the array.
		 */
		removeIndex : function( index )
		{
			if( index >= 0 && index < this._data.length )
				this._data.splice(index, 1);
		},

		/**
		 * Removes an object from the array.
		 */
		remove : function( obj )
		{
			var i = this._data.indexOf( obj );

			if(i != -1) this._data.splice(i, 1);
		},

		/**
		 * Returns true if the array contains the object, else false.
		 */
		has : function( obj )
		{
			return this._data.indexOf( obj ) != -1;
		},

		/**
		 * Removes all elements from the array.
		 */
		clear : function()
		{
			this._data.removeRange(0,this._data.length-1);
		},

		size : function()
		{
			return this._data.length;
		}
	});

	meow.extendClass( array, meow.Iterable );

	/**
	 * MeowEngine implementation of the javascript Array class. This one
	 * contains some enhanced functions and is programmed against the shape
	 * of java's java.util.Array class.
	 *
	 * @example
	 * This implementation allows no shortcut syntax.
	 * var a = new meow.Array()
	 * a[0] = 10 // not works
	 * a.add( 10 ) // works
	 * a.set( 0 , 10 ) // works
	 * a.get( 0 ) // works
	 *
	 * @class
	 */
	meow.Array = array;
})();