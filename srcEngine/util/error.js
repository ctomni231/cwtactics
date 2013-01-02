/**
 * Throws an error for an illegal unit id.
 */
util.illegalUnitIdError = function(){
  throw Error("illegal unit id");
};

/**
 * Throws an error for an illegal property id.
 */
util.illegalPropertyIdError = function(){
  throw Error("illegal unit id");
};

/**
 * Throws an error for an illegal argument.
 */
util.illegalArgumentError = function(){
  throw Error("illegal argument");
};

/**
 * Throws an error for a type error.
 */
util.typeError = function(){
  throw Error("type error");
};

/**
 * Throws an unexpected error.
 */
util.unexpectedSituationError = function(){
  throw Error("unexpected error");
};

/**
 * Throws an error for an illegal position.
 */
util.illegalPositionError = function(){
  throw Error("illegal map position");
};

/**
 * Throws an error for an illegal position.
 */
util.nullPointerError = function(){
  throw Error("null pointer");
};

/**
 *
 * @param obj
 */
util.isDefined = function( obj ){
  return obj !== undefined && obj !== null;
};

/**
 *
 * @param obj
 */
util.isFn = function( obj ){
  return typeof obj === "function";
};

/**
 *
 * @param obj
 */
util.isNumber = function( obj ){
  return typeof obj === "number";
};

/**
 *
 * @param obj
 */
util.isString = function( obj ){
  return typeof obj === "string";
};

/**
 *
 * @param obj
 */
util.isBool = function( obj ){
  return typeof obj === "boolean";
};