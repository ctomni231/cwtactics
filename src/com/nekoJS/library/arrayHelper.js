neko.define("arrayHelper",function(){

    /**
     * Returns a sub array from an arguments array.
     *
     * @function
     * @param {Array} array array instance
     * @param {Number} from first position for the sub array
     * @param {Number} to last position for the sub array ( exclusive )
     * @return new array instance, that contains all entries from the from
     *		   positon, to the to positon ( exclusive )
     */
    function subArray( array, from, to ){

        if( typeof array.length !== 'length' ||
            from < 0 ||
            from >= array.length ||
            to <= from ){

            var hA = [];
            var l = 0;
            for( var i = from; i < to; i++,l++ ){
                hA[l] = array[i];
            }
        }
        else{
            throw "subArray, illegal argument(s)";
        }
    }

    // module API
    return {

        sliceArrayFromArgs : sliceArrayFromArgs
    }
})