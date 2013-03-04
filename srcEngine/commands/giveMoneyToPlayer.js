controller.userAction({

  name:"giveMoneyToPlayer",

  key:"GMTP",

  hasSubMenu: true,

  condition: function( mem ){
    if( model.players[ model.turnOwner ].gold < 500 ) return false;

    var property = mem.targetProperty;
    if( property === null ) return false;
    if( property.owner === model.turnOwner ) return false;

    return true;
  },

  prepareMenu: function( mem ){
    var availGold = model.players[ model.turnOwner ].gold;
    if( availGold >= 500 ) mem.addEntry(500);
    if( availGold >= 1000 ) mem.addEntry(1000);
    if( availGold >= 2500 ) mem.addEntry(2500);
    if( availGold >= 5000 ) mem.addEntry(5000);
    if( availGold >= 10000 ) mem.addEntry(10000);
    if( availGold >= 25000 ) mem.addEntry(25000);
    if( availGold >= 50000 ) mem.addEntry(50000);
  },

  createDataSet: function( mem ){
    var obj = mem.targetUnit;
    if( obj === null ){
      obj = mem.targetProperty;
    }

    return [ obj.owner, mem.subAction ];
  },

  /**
   * Transfers money from the gold depot of a player to the gold depot to an other player.
   *
   * @param {Number} pid player id of the target player
   * @param {Number} money money that will be transfered
   *
   * @methodOf controller.actions
   * @name giveMoneyToPlayer
   */
  action: function( pid, money ){
    var sPlayer = model.players[ model.turnOwner ];
    var tPlayer = model.players[ pid ];

    if( money > sPlayer.gold ){
        money = sPlayer.gold;
    }

    // TRANSFER GOLD
    sPlayer.gold -= money;
    tPlayer.gold += money;
  }

});