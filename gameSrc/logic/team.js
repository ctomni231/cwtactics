my.extendClass(cwt.Player, {
  STATIC: {

    /**
     * Different available money transfer steps.
     */
    MONEY_TRANSFER_STEPS: [
      1000,
      2500,
      5000,
      10000,
      25000,
      50000
    ]
  },

  /**
   * Returns `true` when a player can transfer money to a tile owner.
   */
  canTransferMoney: function(x, y) {
    var ref;

    if (model.player_data[pid].gold < model.team_MONEY_TRANSFER_STEPS[0]) {
      return false;
    }

    if (model.fog_turnOwnerData[x][y] === 0) return false;

    // check unit first
    ref = model.unit_posData[x][y];
    if (ref === null || ref.owner === pid) {

      // check property
      ref = model.property_posMap[x][y];
      if (ref !== null && ref.owner !== pid && ref.owner !== -1) {
        return;
      }

      return false;
    }
  },

  /**
   * Returns `true` when a player can transfer money 
   * to a tile owner.
   */
  getTransferMoneyTargets: function(menu) {
    assert(model.player_isValidPid(pid));

    var availGold = model.player_data[pid].gold;
    for (var i = 0, e = cwt.Player.MONEY_TRANSFER_STEPS.length; i < e; i++) {
      if (availGold >= cwt.Player.MONEY_TRANSFER_STEPS[i]) {
        menu.addEntry(cwt.Player.MONEY_TRANSFER_STEPS[i]);
      }
    }
  },

  /**
   * Transfers money from one player to another player.
   */
  transferMoney: function( player, money) {
    this.gold -= money;
    player.gold += money;
    
    assert(this.gold >= 0);
  }

});

my.extendClass(cwt.Property, {

  /**
   * 
   */
  canBeTransfered: function () {
    if (model.property_data[prid].type.notTransferable) return false;
  },

  /**
   * 
   */
  getTransferTargets: function (menu) {
    for (var i = 0, e = MAX_PLAYER; i < e; i++) {
      if (i !== pid && model.player_data[i].team !== INACTIVE_ID) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   * 
   */
  transferToPlayer: function (player) {
    var prop = model.property_data[sprid];
    prop.owner = tplid;

    var x;
    var y;
    var xe = model.map_width;
    var ye = model.map_height;

    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {
        if (model.property_posMap[x][y] === prop) {
          // TODO fog?
        }
      }
    }
  }
});

my.extendClass(cwt.Unit, {

  /**
   *
   */
  canBeTransfered: function () {
    if (this.hasLoads()) return false;
    return true;
  },

  /**
   *
   */
  getTransferTargets: function (pid, menu) {
    for (var i = 0, e = MAX_PLAYER; i < e; i++) {
      if (i !== pid && model.player_data[i].team !== INACTIVE_ID) {
        menu.addEntry(i, true);
      }
    }
  },

  /**
   *
   */
  transferToPlayer: function (player) {
    var selectedUnit = model.unit_data[suid];
    var tx = selectedUnit.x;
    var ty = selectedUnit.y;
    var opid = selectedUnit.owner;

    selectedUnit.owner = INACTIVE_ID;

    // Remove vision
    if (model.player_data[tplid].team !== model.player_data[opid].team) {
      model.events.modifyVisionAt(tx, ty, selectedUnit.type.vision, -1);
    }

    var tSlot = model.unit_getFreeSlot(tplid);
    model.events.clearUnitPosition(suid);
    model.events.createUnit(tSlot, tplid, tx, ty, selectedUnit.type.ID);

    var targetUnit = model.unit_data[tSlot];
    targetUnit.hp = selectedUnit.hp;
    targetUnit.ammo = selectedUnit.ammo;
    targetUnit.fuel = selectedUnit.fuel;
    targetUnit.exp = selectedUnit.exp;
    targetUnit.type = selectedUnit.type;
    targetUnit.x = tx;
    targetUnit.y = ty;
    targetUnit.loadedIn = selectedUnit.loadedIn;
  }

});