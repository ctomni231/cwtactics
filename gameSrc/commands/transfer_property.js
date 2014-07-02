(function () {

  var changeVision = function (x, y, object, oldOwner) {
    if (object instanceof cwt.Unit) {
      cwt.Fog.removeUnitVision(x, y, oldOwner);
      cwt.Fog.addUnitVision(x, y, object.owner);
    } else {
      cwt.Fog.removePropertyVision(x, y, oldOwner);
      cwt.Fog.addPropertyVision(x, y, object.owner);
    }
  };

  cwt.Action.propertyAction({

    key:"transferProperty",

    relationToProp:[
      "S","T",
      cwt.Relationship.RELATION_SAME_THING
    ],

    condition: function( data  ){
      return (property.type.notTransferable !== true);
    },

    hasSubMenu: true,
    prepareMenu: function( data ){
      var player = data.source.property.owner;
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
      dataBlock.p1 = data.source.propertyId;
      dataBlock.p2 = data.selectedSubEntry;
    },

    invokeFromData: function (dataBlock) {
      this.invoke(cwt.Property.getInstance(dataBlock.p1),cwt.Player.getInstance(dataBlock.p2));
    },

    invoke: function (property, player) {
      var origPlayer = property.owner;
      property.owner = player;

      // remove vision when unit transfers to an enemy team
      //
      if (origPlayer.team !== player.team) {
        cwt.Map.searchProperty(property, this.changeVision_, null, origPlayer);
      }
    }
  });

})();