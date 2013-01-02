/**
 * @private
 */
controller._actionDataPool = util.createRingBuffer(50);

/**
 * @return {controller.ActionData}
 */
controller.aquireActionDataObject = function(){
  var pool = controller._actionDataPool;
  if( pool.isEmpty() ){
    return new controller.ActionData();
  }
  else {
    return pool.pop();
  }
};

/**
 *
 * @param actionData
 */
controller.releaseActionDataObject = function( actionData ){
  if( DEBUG && !actionData instanceof controller.ActionData ){
    util.illegalArgumentError();
  }

  actionData.cleanIt();
  controller._actionDataPool.push( actionData );
};

/**
 * ActionData object that hold numerous information about an object action.
 */
controller.ActionData = function(){
  this.data = [];
  this.cleanIt();
};

/**
 *
 */
controller.ActionData.prototype.cleanIt = function(){

  // SOURCE POS
  this.data[0] = -1;
  this.data[1] = -1;

  // TARGET POS
  this.data[2] = -1;
  this.data[3] = -1;

  // ACTION TARGET POS
  this.data[4] = -1;
  this.data[5] = -1;

  this.data[6] = -1; // SOURCE UNIT ID
  this.data[7] = -1; // SOURCE PROP ID
  this.data[8] = -1; // TARGET UNIT ID
  this.data[9] = -1; // TARGET PROP ID

  // MOVE PATH
  this.data[10] = null;

  // ACTIONS
  this.data[11] = null;
  this.data[12] = null;
};

/**
 *
 */
controller.ActionData.prototype.setSource = function( x,y ){
  this.data[0] = x;
  this.data[1] = y;
};

/**
 *
 */
controller.ActionData.prototype.getSourceX = function(){
  return this.data[0];
};

/**
 *
 */
controller.ActionData.prototype.getSourceY = function(){
  return this.data[1];
};

/**
 *
 */
controller.ActionData.prototype.setTarget = function( x,y ){
  this.data[2] = x;
  this.data[3] = y;
};

/**
 *
 */
controller.ActionData.prototype.getTargetX = function(){
  return this.data[2];
};

/**
 *
 */
controller.ActionData.prototype.getTargetY = function(){
  return this.data[3];
};

/**
 *
 */
controller.ActionData.prototype.setActionTarget = function( x,y ){
  this.data[4] = x;
  this.data[5] = y;
};

/**
 *
 */
controller.ActionData.prototype.getActionTargetX = function(){
  return this.data[4];
};

/**
 *
 */
controller.ActionData.prototype.getActionTargetY = function(){
  return this.data[5];
};

/**
 *
 */
controller.ActionData.prototype.setSourceUnit = function( unit ){
  if( unit === null ) this.data[6] = -1;
  else this.data[6] = model.extractUnitId( unit );
};

/**
 *
 */
controller.ActionData.prototype.getSourceUnit = function(){
  var id = this.data[6];
  if( id === -1 ) return null;
  return model.units[id];
};

/**
 *
 */
controller.ActionData.prototype.getSourceUnitId = function(){
  return this.data[6];
};

/**
 *
 */
controller.ActionData.prototype.setSourceProperty = function( prop ){
  if( prop === null ) this.data[7] = -1;
  else this.data[7] = model.extractPropertyId( prop );
};

/**
 *
 */
controller.ActionData.prototype.getSourceProperty = function(){
  var id = this.data[7];
  if( id === -1 ) return null;
  return model.properties[id];
};

/**
 *
 */
controller.ActionData.prototype.getSourcePropertyId = function(){
  return this.data[7];
};

/**
 *
 */
controller.ActionData.prototype.setTargetUnit = function( unit ){
  if( unit === null ) this.data[8] = -1;
  else this.data[8] = model.extractUnitId( unit );
};

/**
 *
 */
controller.ActionData.prototype.getTargetUnit = function(){
  var id = this.data[8];
  if( id === -1 ) return null;
  return model.units[id];
};

/**
 *
 */
controller.ActionData.prototype.getTargetUnitId = function(){
  return this.data[8];
};

/**
 *
 */
controller.ActionData.prototype.setTargetProperty = function( prop ){
  if( prop === null ) this.data[9] = -1;
  else this.data[9] = model.extractPropertyId( prop );
};

/**
 *
 */
controller.ActionData.prototype.getTargetProperty = function(){
  var id = this.data[9];
  if( id === -1 ) return null;
  return model.properties[id];
};

/**
 *
 */
controller.ActionData.prototype.getTargetPropertyId = function(){
  return this.data[9];
};

/**
 *
 */
controller.ActionData.prototype.setMovePath = function( path ){
  this.data[10] = path;
};

/**
 *
 */
controller.ActionData.prototype.getMovePath = function(){
  return this.data[10];
};

/**
 *
 */
controller.ActionData.prototype.setAction = function( action ){
  this.data[11] = action;
};

/**
 *
 */
controller.ActionData.prototype.getAction = function(){
  return this.data[11];
};

/**
 *
 */
controller.ActionData.prototype.setSubAction = function( action ){
  this.data[12] = action;
};

/**
 *
 */
controller.ActionData.prototype.getSubAction = function(){
  return this.data[12];
};

/**
 *
 */
controller.ActionData.prototype.getCopy = function(){

  var actionData = controller.aquireActionDataObject();

  // COPY DATA
  actionData.data[0] = this.data[0];
  actionData.data[1] = this.data[1];
  actionData.data[2] = this.data[2];
  actionData.data[3] = this.data[3];
  actionData.data[4] = this.data[4];
  actionData.data[5] = this.data[5];
  actionData.data[6] = this.data[6];
  actionData.data[7] = this.data[7];
  actionData.data[8] = this.data[8];
  actionData.data[9] = this.data[9];
  actionData.data[10] = this.data[10];
  actionData.data[11] = this.data[11];
  actionData.data[12] = this.data[12];

  return actionData;
};