cwt.Action.unitAction({
  key:"transferUnit",

  relation: [
    "S","T",
    cwt.Relationship.RELATION_SAME_THING
  ],

  condition: function( data ){
    var unit = data.source.unit;

    if (this.DEBUG) cwt.assert(unit instanceof cwt.Unit);

    if (cwt.Transport.hasLoads(unit)) return false;
    return true;
  },

  hasSubMenu: true,
  prepareMenu: function( data ){
    var player = data.source.unit.owner;
    var menu = data.menu;
    var origI = player.id;

    for (var i = 0, e = cwt.Player.MULTITON_INSTANCES; i < e; i++) {
      if (i === origI) continue;

      var player = cwt.Player.getInstance(i, true);
      if (player && player.team !== cwt.INACTIVE) {
        menu.addEntry(i, true);
      }
    }
  },

  toDataBlock: function (data, dataBlock) {
    dataBlock.p1 = data.source.unitId,
    dataBlock.p2 = data.selectedSubEntry;
  },

  invokeFromData: function (dataBlock) {
    this.invoke(cwt.Unit.getInstance(dataBlock.p1), cwt.Player.getInstance(dataBlock.p2));
  },

  invoke: function (unit, player) {
    var origPlayer = unit.owner;

    if (this.DEBUG) cwt.assert(player.numberOfUnits < cwt.Player.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owner = player;
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    //
    if (origPlayer.team !== player.team) {
      cwt.Map.searchUnit(unit, this.changeVision_, null, origPlayer);
    }
  }

});
