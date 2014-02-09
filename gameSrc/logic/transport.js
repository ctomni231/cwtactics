/**
 * Logic object for the transport mechanic.
 *
 * @namespace
 */
cwt.Transport = {

  /**
   * Returns true if the unit with id tid is a traensporter, else false.
   *
   * @param {cwt.Unit} unit
   */
  isTransportUnit: function (unit) {
    return typeof unit.type.maxloads === "number";
  },

  /**
   * Has a transporter unit with id tid loaded units? Returns true
   * if yes, else false.
   *
   * @param {cwt.Unit} unit
   */
  hasLoads: function (unit) {
    var pid = model.unit_data[tid].owner;
    for (var i = model.unit_firstUnitId(pid),
           e = model.unit_lastUnitId(pid); i < e; i++) {

      if (i !== tid) {
        var unit = model.unit_data[i];
        if (unit !== null && unit.loadedIn === tid) return true;
      }
    }

    assert(model.unit_isValidUnitId(lid));
    assert(model.unit_isValidUnitId(tid));
    assert(lid !== tid);

    return model.unit_data[lid].loadedIn === tid;
  },

  /**
   * Returns true if a tranporter with id tid can load the unit with the id lid.
   * This function also calculates the resulting weight if the transporter would
   * load the unit. If the calculated weight is greater than the maxiumum loadable
   * weight false will be returned.
   */
  canLoadUnit: function (transporter, load) {
    assert(model.unit_isValidUnitId(lid));
    assert(model.unit_isValidUnitId(tid));
    assert(tid !== lid);

    var transporter = model.unit_data[tid];
    var load = model.unit_data[lid];

    assert(model.transport_isTransportUnit(tid));
    assert(load.loadedIn !== tid);

    // `loadedIn` of transporter units marks the amount of loads
    // `LOADS = (LOADIN + 1) + MAX_LOADS`
    if (transporter.loadedIn + transporter.type.maxloads + 1 === 0) return false;

    return (transporter.type.canload.indexOf(load.type.movetype) !== -1);
  },

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param loid
   */
  load: function (loid) {
    assert(this.isTransportUnit());

    model.unit_data[ loid ].loadedIn = tuid;
    model.unit_data[ tuid ].loadedIn--;
  },

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param transportId
   * @param trsx
   * @param trsy
   * @param loadId
   * @param tx
   * @param ty
   */
  unload: function (transportId, trsx, trsy, loadId, tx, ty) {

    // loadId must be loaded into transportId
    assert(model.unit_data[ loadId ].loadedIn === transportId);

    // TODO: remove this later
    // trapped ?
    if (tx === -1 || ty === -1 || model.unit_posData[tx][ty]) {
      controller.stateMachine.data.breakMultiStep = true;
      return;
    }

    // remove transport link
    model.unit_data[ loadId      ].loadedIn = -1;
    model.unit_data[ transportId ].loadedIn++;

    // extract mode code id
    var moveCode;
    if (tx < trsx) moveCode = model.move_MOVE_CODES.LEFT;
    else if (tx > trsx) moveCode = model.move_MOVE_CODES.RIGHT;
    else if (ty < trsy) moveCode = model.move_MOVE_CODES.UP;
    else if (ty > trsy) moveCode = model.move_MOVE_CODES.DOWN;

    // move load out of the transporter
    controller.commandStack_localInvokement("move_clearWayCache");
    controller.commandStack_localInvokement("move_appendToWayCache", moveCode);
    controller.commandStack_localInvokement("move_moveByCache", loadId, trsx, trsy, 1);
    controller.commandStack_localInvokement("wait_invoked", loadId);
  },


  /**
   * Returns true if a transporter unit can unload one of it's loads at a given position.
   * This functions understands the given pos as possible position for the transporter.
   *
   * @param uid
   * @param x
   * @param y
   * @return {*}
   */
  canUnloadSomethingAt: function (uid, x, y) {
    var loader = model.unit_data[uid];
    var pid = loader.owner;
    var unit;

    // only transporters with loads can unload things
    // TODO: is transport could be an assertion
    if (!( model.transport_isTransportUnit(uid) &&
      model.transport_hasLoads(uid) )) {
      return false;
    }

    var i = model.unit_firstUnitId(pid);
    var e = model.unit_lastUnitId(pid);
    for (; i <= e; i++) {

      unit = model.unit_data[i];
      if (unit.owner !== INACTIVE_ID && unit.loadedIn === uid) {
        var movetp = model.data_movetypeSheets[ unit.type.movetype ];

        if (model.move_canTypeMoveTo(movetp, x - 1, y)) return;
        if (model.move_canTypeMoveTo(movetp, x + 1, y)) return;
        if (model.move_canTypeMoveTo(movetp, x, y - 1)) return;
        if (model.move_canTypeMoveTo(movetp, x, y + 1)) return;
      }
    }

    return false;
  }

};