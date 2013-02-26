controller.engineAction({

  name:"moveVision",
  
  key:"MVIS",
  
  /**
   * Transfers a property of a player to an other player.
   *
   * @param {Number} sx x coordinate of the source
   * @param {Number} sy y coordinate of the source
   * @param {Number} tx x coordinate of the target
   * @param {Number} ty y coordinate of the target
   * @param {Number} range vision range of the visioner
   *
   * @methodOf controller.actions
   * @name moveVision
   */
  action: function( sx,sy, tx,ty, range ){
    controller.actions.removeVision(sx,sy,range);
    controller.actions.addVision(tx,ty,range);
  }
});