/**
 * @class
 */
cwt.Property = my.Class({

  initialize: function( type ){
    this.x = 0;
    this.y = 0;
    this.points = 20;
    this.owner = null;    
    this.type = cwt.Database.Tiles.sheets[type];
  },
  
  /**
   * Returns true, when the given property is neutral, else false.
   */
  isNeutral: function(){
    return this.owner === null;
  }
});