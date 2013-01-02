controller.registerCommand({

  key:"healUnit",

  // ------------------------------------------------------------------------
  condition: function( data ){
    return false;
  },

  // ------------------------------------------------------------------------
  action: function( data ){
    var healingUnit = data.getTargetUnit();

    var hp = 20;

    healingUnit.hp += hp;
    if( healingUnit.hp > 99 ) healingUnit.hp = 99;
  }
});