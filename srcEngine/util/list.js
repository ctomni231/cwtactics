/** @private */
util.fillList_ = function(){
  var defValue = this.__defValue__;
  var len = this.__length__;
  var isFN = typeof defValue === 'function';
  
  // SIMPLE ARRAY OBJECT
  for(var i = 0, e = len; i < e; i++){
    if( isFN ) this[i] = defValue( i );
    else       this[i] = defValue;
  }
};

/** @private */
util.fillMatrix_ = function(){
  var defValue = this.__defValue__;
  var w = this.__width__;
  var h = this.__height__;
  var isFN = typeof defValue === 'function';
  
  // COMPLEX ARRAY (MATRIX) OBJECT
  for(var i = 0, e = w; i < e; i++){
    for(var j = 0, ej = h; j < ej; j++){
      if( isFN ) this[i][j] = defValue( i,j );
      else       this[i][j] = defValue;
    }
  }
};

/** @private */
util.cloneList_ = function( list ){
  var len = this.__length__;
  if( list.__length__ !== len ) throw Error();
  for(var i = 0, e = len; i < e; i++){
    list[i] = this[i];
  }
};

/** @private */
util.cloneMatrix_ = function( matrix ){
  var w = this.__width__;
  var h = this.__height__;
  if( matrix.length !== this.length ) throw Error();
  
  // COMPLEX ARRAY (MATRIX) OBJECT
  for(var i = 0, e = w; i < e; i++){
    for(var j = 0, ej = h; j < ej; j++){
      matrix[i][j] = this[i][j];
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
  
  var warr = [];
  warr.__defValue__ = defaultValue;
  warr.__length__ = len;
  warr.resetValues = util.fillList_;
  warr.cloneValues = util.cloneList_;
  
  warr.resetValues();
  
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
  
  var warr = [];
  warr.__defValue__ = defaultValue;
  warr.__width__ = w;
  warr.__height__ = h;
  warr.resetValues = util.fillMatrix_;
  warr.cloneValues = util.cloneMatrix_;
  
  // CREATE SUB ARRAYS
  for (var i = 0; i < w; i++){ warr[i] = []; }
  
  warr.resetValues();
  
  return warr;
};