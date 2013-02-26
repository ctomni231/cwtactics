controller.engineAction({

  name:"healUnit",
  
  key:"HEUN",
  
  /**
   * Heals an unit.
   *
   * @param {Number} uid unit id
   * @param {Number} hp health points
   *
   * @methodOf controller.actions
   * @name healUnit
   */
  action: function( uid, hp ){
    var unit = model.units[uid];
    
    unit.hp += hp;
    if( unit.hp > 99 ) unit.hp = 99;
    
    var num = -1;
    if( unit.hp <= 90 ){
      num = parseInt( unit.hp/10 , 10 )+1;
    }
    unit.ST_HP_NUM = num;
  }
});