neko.define("collections/randomSet", ["collections/set"], function(set){

    /**
     * RandomSet class.
     *
     * @class
     */
    var RandomSet = neko.Class( set.Set, /** @lends RandomSet# */ {

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

    return{

        VERSION : 1.0,

        RandomSet : RandomSet
    }
})