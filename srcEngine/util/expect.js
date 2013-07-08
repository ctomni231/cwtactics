// # Expection Module
//
// **The following expection functions follows this shema:** If the attribute is
// defined and an array then `util.expectMode.DEFINED` will be returned.
// If the object is not defined and `mustDefined` is true then a 
// `util.expectMode.BREAKS_EXPECTION` will be returned. If `mustDefined` 
// is not true then `util.expectMode.NOT_DEFINED` will be returned. The 
// returns are boolean comparabled. Only `util.expectMode.BREAKS_EXPECTION`
// solves to a false in a conditional statement. The other situations solves
// to a true statement.

// Expection results
util.expectMode = {
  BREAKS_EXPECTION: 0,
  NOT_DEFINED:      1,
  DEFINED:          2
};

// Expects an array object in an inspected object. 
//
// @param {Any} obj object that will be inspected
// @param {String|Number} attr attribute name or index number that will be accessed
// @param {Boolean} mustDefined if true then the attribute must be defined to match the expection
util.expectArray = function( obj, attr, mustDefined ){
  var v = obj[attr];
  
  if( v === undefined && mustDefined === true ) return util.expectMode.BREAKS_EXPECTION;
  if( v === undefined ) return util.expectMode.NOT_DEFINED;
  
  if( typeof v !== "object" && typeof v.length === undefined ) return util.expectMode.BREAKS_EXPECTION;
  
  return util.expectMode.DEFINED;
};

// Expects a string object in an inspected object.
//
// @param {Any} obj object that will be inspected
// @param {String|Number} attr attribute name or index number that will be accessed
// @param {Boolean} mustDefined if true then the attribute must be defined to match the expection
util.expectString = function( obj, attr, mustDefined ){
  var v = obj[attr];
  
  if( v === undefined && mustDefined === true ) util.expectMode.BREAKS_EXPECTION;
  if( v === undefined ) return util.expectMode.NOT_DEFINED;
  
  if( typeof v !== "string" ) return util.expectMode.BREAKS_EXPECTION;
  
  return util.expectMode.DEFINED;
};

// Expects a function object in an inspected object.
//
// @param {Any} obj object that will be inspected
// @param {String|Number} attr attribute name or index number that will be accessed
// @param {Boolean} mustDefined if true then the attribute must be defined to match the expection
util.expectFunction = function( obj, attr, mustDefined ){
  var v = obj[attr];
  
  if( v === undefined && mustDefined === true ) util.expectMode.BREAKS_EXPECTION;
  if( v === undefined ) return util.expectMode.NOT_DEFINED;
  
  if( typeof v !== "function" ) return util.expectMode.BREAKS_EXPECTION;
  
  return util.expectMode.DEFINED;
};

// Expects a object in an inspected object.
//
// @param {Any} obj object that will be inspected
// @param {String|Number} attr attribute name or index number that will be accessed
// @param {Boolean} mustDefined if true then the attribute must be defined to match the expection
util.expectObject = function( obj, attr, mustDefined ){
  var v = obj[attr];
  
  if( v === undefined && mustDefined === true ) return util.expectMode.BREAKS_EXPECTION;
  if( v === undefined ) return util.expectMode.NOT_DEFINED;
  
  if( typeof v !== "object" ) return util.expectMode.BREAKS_EXPECTION;
  
  return util.expectMode.DEFINED;
};

// Expects a boolean object in an inspected object.
//
// @param {Any} obj object that will be inspected
// @param {String|Number} attr attribute name or index number that will be accessed
// @param {Boolean} mustDefined if true then the attribute must be defined to match the expection
util.expectBoolean = function( obj, attr, mustDefined ){
  var v = obj[attr];
  
  if( v === undefined && mustDefined === true ) return util.expectMode.BREAKS_EXPECTION;
  if( v === undefined ) return util.expectMode.NOT_DEFINED;
  
  if( typeof v !== "boolean" ) return util.expectMode.BREAKS_EXPECTION;
  
  return util.expectMode.DEFINED;
};

// Expects that an object does not have a given property.
//
// @param {String|Number} attr attribute name
// @param {Any} obj object that will be inspected
util.notIn = function( attr, obj ){
  if( obj.hasOwnProperty(attr) ) return util.expectMode.BREAKS_EXPECTION;
};

// Expects that two object aren't the same.
//
// @param {String|Number} attr attribute name
// @param {Any} obj object that will be inspected
util.not = function( attr, obj, res ){
  if( obj[attr] === res ) return util.expectMode.BREAKS_EXPECTION;
};

// Expects that an object has a given property.
//
// @param {String|Number} attr attribute name
// @param {Any} obj object that will be inspected
util.isIn = function( attr, obj ){
  if( !obj.hasOwnProperty(attr) ) return util.expectMode.BREAKS_EXPECTION;
};

// Expects a number object in an inspected object.
//
// @param {Any} obj object that will be inspected
// @param {String|Number} attr attribute name or index number that will be accessed
// @param {Boolean} mustDefined if true then the attribute must be defined to match the expection
// @param {Boolean} integer if true then the attribute must be an integer
// @param {Number} min if defined then the attribute must be greater equals min
// @param {Number} max if defined then the attribute must be lower equals max
util.expectNumber = function( obj, attr, mustDefined, integer, min, max ){
  var v = obj[attr];
  
  if( v === undefined && mustDefined === true ) return util.expectMode.BREAKS_EXPECTION;
  if( v === undefined ) return util.expectMode.NOT_DEFINED;
  
  if( typeof v !== "number"                    ) return util.expectMode.BREAKS_EXPECTION;
  if( integer === true && parseInt(v,10) !== v ) return util.expectMode.BREAKS_EXPECTION;
  
  if( min !== undefined && v < min    ) return util.expectMode.BREAKS_EXPECTION;
  if( min !== undefined && isNaN(min) ) return util.expectMode.BREAKS_EXPECTION;
  
  if( max !== undefined && v > max    ) return util.expectMode.BREAKS_EXPECTION;
  if( max !== undefined && isNaN(max) ) return util.expectMode.BREAKS_EXPECTION;
  
  return util.expectMode.DEFINED;
};