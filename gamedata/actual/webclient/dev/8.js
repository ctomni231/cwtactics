(function(){
  
  var fill = function(){
    var defValue = this.__defValue__;
    var w = this.__width__;
    var h = this.__height__;
    var isFN = typeof defValue === 'function';
    
    // COMPLEX ARRAY (MATRIX) OBJECT
    for(var i = 0, e = w; i < e; i++){
      for(var j = 0, ej = h; j < ej; j++){
        if( isFN ) this[i][j] = defValue( i,j,this[i][j] );
        else       this[i][j] = defValue;
      }
    }
  };
  
  var clone = function( matrix ){
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
  
  // Creates a matrix (table) and fills it with default values.
  // 
  // @param {Number} w width of the matrix
  // @param {Number} h height of the matrix
  // @param defaultValue the default value that will be inserted into the cells 
  util.matrix = function( w, h, defaultValue ){
    
    if( defaultValue === undefined ){ defaultValue = null; }
    
    var warr = [];
    warr.__defValue__ = defaultValue;
    warr.__width__ = w;
    warr.__height__ = h;
    warr.resetValues = fill;
    warr.cloneValues = clone;
    
    // CREATE SUB ARRAYS
    for (var i = 0; i < w; i++){ warr[i] = []; }
    
    warr.resetValues();
    
    return warr;
  };
  
})();