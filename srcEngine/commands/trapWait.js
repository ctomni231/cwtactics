controller.engineAction({

  name: "trapWait",

  key: "TRWT",

  createDataSet: function( data ){
    return [ data.selectionUnitId ];
  },
  
  /**
   * Trap wait action is invoked if a move path cannot be moved because
   * an enemy unit stays in the way.
   *
   * @param {Number} uid unit id
   * 
   * @methodOf controller.actions
   * @name trapWait
   */
  action: function( uid ){
    controller.actions.wait( uid );
  }

});