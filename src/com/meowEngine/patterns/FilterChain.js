(function(){

	var filterChain = meow.Class( /** @lends meow.FilterChain# */ {

		constructor : function(){

			/** @private */
			this._data = [];
		},

		/**
		 * Adds a filter to the filter chain. The function get one argument by
		 * the filter chain, if a filter process happens. The function can
		 * return true, if the complete filter process should be breaked.
		 *
		 * @example
		 * var fC = ...;
		 *
		 * var f1 = function( obj ){ ... };
		 * var f2 = function( obj ){ return true; };
		 * var f3 = function( obj ){ ... };
		 *
		 * fC.add( f1 )
		 * fC.add( f2 )
		 * fC.add( f3 )
		 *
		 * // f1 and f2 will be invoked
		 * fC.filter( {} );
		 *
		 * // f1,f2 and f3 will be invoked
		 * fC.filter( {} , true );
		 *
		 * @param {Function} filter filter function
		 * @param {Boolean} atFirst if true, the filter will appended at the
		 *							head of the filter chain
		 */
		add : function( filter , atFirst ){
			( atFirst === true )? this._data.unshift( func ) :
								  this._data.push( func );
		},

		/**
		 * Removes a filter from the filter chain.
		 *
		 * @param {Function} filter filter function
		 */
		remove : function( filter ){
			this._data.splice( this._data.indexOf( filter ) , 1 );
		},

		/**
		 * Filters an argument with the filter chain.
		 *
		 * @param {Object} argObj the argument, that will be taken as argument
		 *						  for every filter function
		 * @param {Boolean} ignoreBreak if true, a return true of a filter, that
		 *							    indicates a break of the filter chain,
		 *							    will be ignored
		 */
		filter : function( argObj, ignoreBreak ){
			
			var list = this._data;
			var e = list.length;
			var res;

			// invoke argument on all filter objects
			for( var i = 0 ; i < e ; i++ )
			{
				res = list[i]( argObj );

				// if no ignore on break and filter returns true,
				// then the chain will be broken
				if( ignoreBreak === false && res === true )
					break;
			}

			list = null
		}
	});

	/**
	 *
	 * @class
	 */
	meow.FilterChain = filterChain;
})();