(function(){
	
	// MEOW CONTAINER MODULE
	// =====================
	//
	// CONTAINS MANY CLASSES TO SAVE AND COLLECT DATA.
	// 
	// LICENSE: MEOW LICENSE (SEE LICENSE FILE)
	// SINCE: 08.07.2011
	//======================================================================


    // ARRAY LIST
    //======================================================================

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
	meowEngine.Array = meowEngine.Class( /** @lends meowEngine.Array# */{

        /**
         * @param {Number} initSize initial size of the internal array
         */
		constructor : function( initSize )
		{
            /** @private holds all data from the array */
			this._data = ( initSize && initSize > 0)? new Array(initSize) :[];
		},

        /**
         * Adds an element to the array.
         *
         * @param obj object, that will be added
         */
		add : function( obj )
		{
			this._data.push( obj );
		},

        /**
         * Inserts the element at a given position.
         *
         * @param obj object, that will be inserted
         * @param {Number} index index
         */
        insertAt : function( obj, index ){

            if( index >= 0 && index <= this.length ){
                this._data.splice( index , 0, obj );
                return true;
            }
            else{
                return false;
            }
        },

        /**
         * Sets the element of a given position.
         *
         * @param obj object, that will be set
         * @param {Number} index index
         */
		set : function( obj, index )
		{
            if( index >= 0 && index < this.length ){
                this._data[ index ] = obj;
                return true;
            }
            else{
                return false;
            }
		},

        /**
         * Returns the element of a given position.
         *
         * @param {Number} index index
         * @return object at the given index
         */
		get : function( index )
		{
			if( index >= 0 && index < this.length ){
                return this._data[ index ];
            }
            else{
                return 'undefined';
            }
		},

        /**
         * @return true, if the array is empty, else false
         */
		isEmpty : function(){
			return this._data.length == 0;
		},

		/**
		 * Removes a range from the array.
		 * by John Resig (MIT Licensed)
         *
         * @param {Number} from first element
         * @param {Number} to last element (inclusive)
		 */
		removeRange : function(from, to)
		{
			var rest = this._data.slice((to||from) + 1 || this._data.length);
			this._data.length = from < 0 ? this.length + from : from;
			return this._data.push.apply(this, rest);
		},

		/**
		 * Removes an index from the array.
         *
         * @param {Number} index index, that will be removed
		 */
		removeIndex : function( index )
		{
			if( index >= 0 && index < this._data.length ){
				var o = this._data[index];
                this._data.splice(index, 1);
                return o;
            }

            return 'undefined';
		},

		/**
		 * Removes an object from the array.
         *
         * @param obj object, that will be removed
         * @return object
		 */
		remove : function( obj )
		{
			var i = this._data.indexOf( obj );

			if(i != -1){
                this._data.splice(i, 1);
                return true;
            }
            else{
                return false;
            }
		},

		/**
         * @param obj object that will be checked
		 * @return true if the array contains the object, else false.
		 */
		contains : function( obj )
		{
			return this._data.indexOf( obj ) != -1;
		},

        /**
         * @param obj object that will be checked
         * @return the index of the object, if not exist, -1
         */
		indexOf : function( obj )
		{
			return this._data.indexOf( obj );
		},

        /**
         * @param obj object that will be checked
         * @return the last index of the object, if not exist, -1
         */
        lastIndexOf : function( obj )
		{
			return this._data.lastIndexOf( obj );
		},

		/**
		 * Removes all elements from the array.
		 */
		clear : function()
		{
			this._data.splice(0,this._data.length-1);
		},

        /**
         * @return {Number} size of the array
         */
		size : function()
		{
			return this._data.length;
		}
	});


    // SET
    //======================================================================

    /**
	 * Set class.
	 *
     * Extends: {@link meowEngine.Array}
	 * @class
	 */
	meowEngine.Set = 
        meowEngine.Class( meowEngine.Array, /** @lends meowEngine.Set# */ {

        /** @borrows meowEngine.Array.constructor as #constructor */
		constructor : function( initSize ){
            
			this.Super.call( this, initSize );
		},

        /** @borrows meowEngine.Array.add as #add */
		add : function( obj ){

			if( this.indexOf(obj) == -1 ){
                this.Super.add( obj );
                return true;
            }
            return false;
		},

        /** @borrows meowEngine.Array.insertAt as #insertAt */
        insertAt : function( obj, index ){

            if( this.indexOf(obj) == -1 ){
                return this.Super.insertAt( obj, index );
            }
            return false;
        },

        /** @borrows meowEngine.Array.set as #set */
        set : function( obj, index ){

            if( this.indexOf(obj) == -1 ){
                return this.Super.set( obj, index );
            }
            return false;
        }
	});


    // RANDOM SET
    //======================================================================

    /**
	 * RandomSet class.
	 *
	 * @class
	 */
	meowEngine.RandomSet =
        meowEngine.Class( /** @lends meowEngine.RandomSet# */ {

		constructor : function( initSize ){

			this.Super.call(this, initSize);
            
			this._weights = [];
			this._listWeight = 0;
		},

        /**
         * Adds an element to the array.
         *
         * @param obj object, that will be added
         * @param {Number} weight weight of the element
         */
		add : function( obj , weight ){
            
			var l = this._data;
			var e = l.length;
			var i = parseInt( Math.random()*l );

			if( i == e ){

				l.push( obj );
				this._weights.push( weight );
			}
			else{

				l.splice( i , 0 , obj );
				this._weights.splice( i , 0 , weight );
			}

			this._listWeight += weight;
		},

        /** @borrows meowEngine.Array.remove as #remove */
		remove : function( obj ){

			var l = this._data;
			var wl = this._weights;
			var i = l.indexOf( obj );
			var w = wl[i];

			l.splice( i , 1 );
			wl.splice( i , 1 );
			this._listWeight -= w;
		},

        /**
         * Picks a random element from the random set.
         *
         * @return random element
         */
		random : function(){

			var l = this._data;
			var wl = this._weights;
			var e = l.length;
			var n = parseInt( Math.random()*this._listWeight );

			var cW = 0;
			for( var i = 0 ; i < e ; i++ ){

				// add weight to slot runner
				cW += wl[i];

				// slot found
				if( n <= cW ) return l[i];
			}

			throw "This should not happen =("
		},

        /** @borrows meowEngine.Array.clear as #clear */
		clear : function(){
            
			this._data.clear();
			this._weights.clear();
			this._listWeight = 0;
		},

        /**
         * Modifies the weight of an element in the random set.
         *
         * @param obj object that will be modified
         * @param {Number} newWeight new weight of the modified weight
         */
		modifyWeight : function( obj , newWeight ){

			var l = this._data;
			var wl = this._weights;
			var i = l.indexOf( obj );
			var w = wl[i];

			this._listWeight -= w;
			this._listWeight += newWeight;

			wl[i] = newWeight;
		}
	});
	
})();