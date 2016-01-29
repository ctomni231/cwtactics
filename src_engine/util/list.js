(function(){

  var fill = function(){
    var defValue = this.__defValue__;
    var len = this.__length__;
    var isFN = typeof defValue === 'function';

    // SIMPLE ARRAY OBJECT
    for(var i = 0, e = len; i < e; i++){
      if( isFN ) this[i] = defValue( i, this[i] );
      else       this[i] = defValue;
    }
  };

  var clone = function( list ){
    var lenA = this.__length__;
    var lenB = list.__length__;
    if( typeof lenB ) lenB = list.length;

    if( lenB !== lenA ) throw Error("source and target list have different lengths");

    for(var i = 0, e = lenA; i < e; i++){
      list[i] = this[i];
    }
  };

  var grab = function( list ){
    var lenA = this.__length__;
    var lenB = list.__length__;
    if( typeof lenB ) lenB = list.length;

    if( lenB !== lenA ) throw Error("source and target list have different lengths");

    for(var i = 0, e = lenA; i < e; i++){
      this[i] = list[i];
    }
  };

  // Creates a list with a given length and fills it with a
  // default value.
  //
  util.list = function( len, defaultValue ){
    if( defaultValue === undefined ){ defaultValue = null; }

    var warr = [];
    warr.__defValue__ = defaultValue;
    warr.__length__ = len;
    warr.resetValues = fill;
    warr.cloneValues = clone;
    warr.grabValues = grab;

    warr.resetValues();

    return warr;
  };


})();
