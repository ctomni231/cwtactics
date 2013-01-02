util.StringIdMapper = function(){
  this.map = {};
  this._len = 0;
};

/**
 *
 * @param key
 */
util.StringIdMapper.prototype.getIdFromKey = function( key ){
  return this.map[key];
};

/**
 *
 * @param id
 */
util.StringIdMapper.prototype.getKeyFromId = function( id ){
  var map = this.map;
  var keys = Object.keys( map );

  for( var i=0,e=keys.length; i<e; i++ ){
    if( map[keys[i]] === id ) return keys[i];
  }

  return null;
};

/**
 *
 * @param keyString
 */
util.StringIdMapper.prototype.registerKey = function( keyString ){
  if( this.map.hasOwnProperty( keyString ) ) throw Error();

  this.map[ keyString ] = this._len;
  this._len++;
};