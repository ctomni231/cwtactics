(function(){

	var set = meow.Class( meow.Array, /** @lends meow.Set# */ {

		constructor : function( listSize )
		{
			set.Super.call( this, listSize );
		},

		add : function( obj )
		{
			if( !this.has(obj) )
				this._data.push( obj );
		},

		push : function( obj )
		{
			if( !this.has(obj) )
				this._data.push( obj );
		},

		set : function( index, obj )
		{
			throw "NotAllowedOperation - Set a value on index is not allowed"+
										"in a set";
		}

	});

	/**
	 * Set class, based on {@link meow.Array}.
	 *
	 * @class
	 */
	meow.Set = set;
})();