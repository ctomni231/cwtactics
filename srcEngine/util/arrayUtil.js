/**
 * Fills an array with a value. Works also for matrix objects.
 *
 * @param arr an array or matrix created by {@link util.list} or {@link util.matrix}
 * @param defaultValue he default value that will be inserted into the array/matrix
 */
util.fill = function( arr, defaultValue ){
  var isFN = typeof defaultValue === 'function';

  if( arr.__matrixArray__ === true ){

    // COMPLEX ARRAY (MATRIX) OBJECT
    for(var i = 0, e = arr.length; i < e; i++){
      for(var j = 0, ej = arr.length; j < ej; j++){
        if( isFN ) arr[i][j] = defaultValue( i,j );
        else       arr[i][j] = defaultValue;
      }
    }
  }
  else{

    // SIMPLE ARRAY OBJECT
    for(var i = 0, e = arr.length; i < e; i++){
      if( isFN ) arr[i] = defaultValue( i );
      else       arr[i] = defaultValue;
    }
  }
};

/**
 * Creates a list and fills it with default values.
 *
 * @param {Number} len the length of the created list
 * @param defaultValue the default value that will be inserted into the list slots 
 */
util.list = function( len, defaultValue ){
  if( defaultValue === undefined ){ defaultValue = null; }

  var isFN = typeof defaultValue === 'function';
  var warr = [];
  for (var i = 0; i < len; i++) {
    if( isFN ) warr[i] = defaultValue( i );
    else       warr[i] = defaultValue;
  }

  return warr;
};

/**
 * Creates a matrix (table) and fills it with default values.
 *
 * @param {Number} w width of the matrix
 * @param {Number} h height of the matrix
 * @param defaultValue the default value that will be inserted into the cells 
 */
util.matrix = function( w, h, defaultValue ){

  if( defaultValue === undefined ){ defaultValue = null; }

  var isFN = typeof defaultValue === 'function';
  var warr = [];
  for (var i = 0; i < w; i++) {

    warr[i] = [];
    for (var j = 0; j < h; j++) {

      if( isFN ) warr[i][j] = defaultValue( i,j );
      else       warr[i][j] = defaultValue;
    }
  }

  // meta data
  warr.__matrixArray__ = true;

  return warr;
};