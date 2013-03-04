controller.engineAction({

  name:"refillRessources",

  key:"RFRS",

  /**
   * Refills ressources of an unit.
   *
   * @param {Number} x x coordinate of the supplier
   * @param {Number} y y coordinate of the supplier
   * 
   * @methodOf controller.actions
   * @name supplyTurnStart
   */
  action: function( uid ){
    var unit = model.units[uid];
    var uSheet = model.sheets.unitSheets[ unit.type ];
    unit.ammo = uSheet.maxAmmo;
    unit.fuel = uSheet.maxFuel;
  }
});