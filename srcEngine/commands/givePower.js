controller.engineAction({

  name:"givePower",
  
  key:"GIPO",
  
  /**
   * @methodOf controller.actions
   * @name givePower
   */
  action: function( pid, power ){
    model.players[ pid ].power += power;
  }
});