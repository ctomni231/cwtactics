controller.action_unitAction({

  key: "explode",
  noAutoWait: true,

  relation: ["S", "T", model.player_RELATION_MODES.NONE, model.player_RELATION_MODES.SAME_OBJECT],

  condition: function(data) {
    if (!model.bombs_isSuicideUnit(data.source.unitId)) {
      return false;
    }
    return true;
  },

  invoke: function(data) {
    controller.commandStack_sharedInvokement("unit_destroySilently", data.source.unitId);

    model.map_doInRange(data.target.x, data.target.y, data.source.unit.type.suicide.range, function(x, y, damage) {
      var unit = model.unit_posData[x][y];
      if (unit) {
        model.events.damageUnit(model.unit_extractId(unit), damage, 9);
      }
    }, model.unit_convertPointsToHealth(data.source.unit.type.suicide.damage));
  }

});
