controller.engineAction({

  name:"supplyTurnStart",

  key:"TSSP",

  /**
   * Supplies units at turn start.
   *
   * @param {Number} sid supplier unit id
   * @param {Number} x x coordinate of the supplier
   * @param {Number} y y coordinate of the supplier
   * 
   * @methodOf controller.actions
   * @name supplyTurnStart
   */
  action: function( sid, x,y ){

    controller.actions.supply( sid, x,y );
    controller.actions.makeActable( sid );
  }
});