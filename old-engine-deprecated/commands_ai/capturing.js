(function() {

  function setTarget(x, y, data) {
    data.target.set(x, y);
  }

  //
  //
  controller.ai_defineRoutine({
    key: "captureProperties",
    unitAction: true,

    scoring: function(data, cScore) {
      if (cScore >= 20) return -1;

      if (!data.source.unit.type.captures) return -1;

      var tid = model.player_data[data.source.unit.owner].team;
      var prop = null;
      var move = false;
      var cprop = model.property_posMap[data.source.x][data.source.y];
      if ( cprop && ( cprop.owner === INACTIVE_ID || 
        model.player_data[cprop.owner].team !== tid ) &&
        model.property_isCapturableBy(model.property_extractId(cprop), data.source.unitId)) {

        prop = cprop;
        data.target.set(data.source.x,data.source.y);

      } else {
        var x, y, ye, xe;
        var tx, ty;
        var found = false;
        var dataL = data.selection.data;
        move = true;
        for (x = 0, xe = dataL.length; x < xe; x++) {
          for (y = 0, ye = dataL[x].length; y < ye; y++) {
            if (dataL[x][y] >= 0) {

              if( model.unit_posData[x][y] ) continue;

              cprop = model.property_posMap[x][y];
              if (cprop && ( cprop.owner === INACTIVE_ID || 
                model.player_data[cprop.owner].team !== tid ) &&
                model.property_isCapturableBy(
                  model.property_extractId(cprop), data.source.unitId)) {

                prop = cprop;
                data.target.set(x,y);
                found = true;
                break;
              }
            }
          }
          if (found) break;
        }

        if (!found) return -1;
      }

      if (!prop) return -1;

      if( move ){
        model.move_generatePath(
          data.source.x, data.source.y,
          data.target.x, data.target.y,
          data.selection,
          data.move
        );
      } else data.move.resetValues(INACTIVE_ID);

      return 20;
    },

    prepare: function(data) {

      var trapped = false;
      if (data.move[0] !== -1) {
        trapped = model.move_trapCheck(data.move, data.source, data.target);
        model.events.move_flushMoveData(data.move, data.source);
      }

      if (!trapped) {
        controller.commandStack_sharedInvokement(
          "capture_invoked",
          data.target.propertyId,
          data.source.unitId
        );
        controller.commandStack_sharedInvokement(
          "wait_invoked",
          data.source.unitId
        );
      } else {
        controller.commandStack_sharedInvokement(
          "trapwait_invoked",
          data.source.unitId
        );
      }
    }
  });
})();