CWT_MOD_DEFAULT.events = {

  isHidden: function( unit, tileType, lX, lY, tX, tY, distance ){
    if( tileType === 'FOREST' && distance > 1 ){
      if( unit.type === 'RECOON' ) return true;
      return false;
    }
    return true;
  },

  moveRange: function( unit, x, y, range ){
    if( cwt.player(unit.owner).name === 'BlackCat' ){
      return range+1; // TEST IT :P
    }
  }
}