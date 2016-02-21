controller.action_unitAction({

  key: "capture",

  relation: [
    "S", "T",
    model.player_RELATION_MODES.SAME_OBJECT,
    model.player_RELATION_MODES.NONE
  ],

  relationToProp: [
    "S", "T",
    model.player_RELATION_MODES.ENEMY,
    model.player_RELATION_MODES.NONE
  ],

  condition: function(data) {
    var property_id, unit_id;

    property_id = data.target.propertyId;
    unit_id = data.source.unitId;

    if (!model.property_isCapturableBy(property_id, unit_id)) {
      return false;
    }
    return true;
  },

  invoke: function(data) {
    controller.commandStack_sharedInvokement(
      "capture_invoked",
      data.target.propertyId,
      data.source.unitId
    );
  }

});
