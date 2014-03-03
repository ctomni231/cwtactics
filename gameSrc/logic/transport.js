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
    if (this.DEBUG) assert(unit instanceof cwt.Unit);

    return (typeof unit.type.maxloads === "number");
  },

  /**
   * Has a transporter unit with id tid loaded units? Returns true
   * if yes, else false.
   *
   * @param {cwt.Unit} unit
   */
  hasLoads: function (unit) {
    if (this.DEBUG) assert(unit instanceof cwt.Unit);

    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i < e; i++) {
      var cUnit = cwt.Unit.getInstance(i,true);
      if (cUnit && unit.loadedIn === cUnit) return true;
    }

    return false;
  },

  /**
   * Returns true if a transporter with id tid can load the unit with the id lid.
   * This function also calculates the resulting weight if the transporter would
   * load the unit. If the calculated weight is greater than the maximum loadable
   * weight false will be returned.
   *
   * @param {cwt.Unit} transporter
   * @param {cwt.Unit} load
   */
  canLoadUnit: function (transporter, load) {
    if (this.DEBUG) assert(transporter instanceof cwt.Unit);
    if (this.DEBUG) assert(load instanceof cwt.Unit);
    if (this.DEBUG) assert(load !== transporter);
    if (this.DEBUG) assert(this.isTransportUnit(transporter));
    if (this.DEBUG) assert(load.loadedIn !== transporter);

    return (transporter.type.canload.indexOf(load.type.movetype) !== -1);
  },

  /**
   * Loads the unit with id lid into a transporter with the id tid.
   *
   * @param {cwt.Unit} transporter
   * @param {cwt.Unit} load
   */
  load: function (transporter, load) {
    if (this.DEBUG) assert(transporter instanceof cwt.Unit);
    if (this.DEBUG) assert(load instanceof cwt.Unit);
    if (this.DEBUG) assert(this.isTransportUnit(transporter));

    load.loadedIn = transporter;
  },

  /**
   * Unloads the unit with id lid from a transporter with the id tid.
   *
   * @param {cwt.Unit} transport
   * @param {number} trsx
   * @param {number} trsy
   * @param {cwt.Unit} load
   * @param {number} tx
   * @param {number} ty
   */
  unload: function (transport, trsx, trsy, load, tx, ty) {
    if (this.DEBUG) assert(load.loadedIn === transport);

    // TODO: remove this later
    // trapped ?
    if (tx === -1 || ty === -1 || cwt.Map.data[tx][ty].unit) {
      controller.stateMachine.data.breakMultiStep = true;
      return;
    }

    // remove transport link
    load.loadedIn = null;

    // extract mode code id
    var moveCode;
    if (tx < trsx) moveCode = cwt.Move.MOVE_CODES_LEFT;
    else if (tx > trsx) moveCode = cwt.Move.MOVE_CODES_RIGHT;
    else if (ty < trsy) moveCode = cwt.Move.MOVE_CODES_UP;
    else if (ty > trsy) moveCode = cwt.Move.MOVE_CODES_DOWN;

    // move load out of the transporter
    cwt.Move.movePathCache.clear();
    cwt.Move.movePathCache.push(moveCode);
    cwt.Move.move(unit, trsx, trsy, cwt.Move.movePathCache, true, true, false);

    transport.canAct = false;
    load.canAct = false;
  },


  /**
   * Returns true if a transporter unit can unload one of it's loads at a given position.
   * This functions understands the given pos as possible position for the transporter.
   *
   * @param {cwt.Unit} transporter
   * @param x
   * @param y
   * @return {*}
   */
  canUnloadSomethingAt: function (transporter, x, y) {
    var pid = transporter.owner;
    var unit;

    if (this.DEBUG) assert(this.isTransportUnit(transporter));

    for (var i = 0, e = cwt.Unit.MULTITON_INSTANCES; i <= e; i++) {

      unit = cwt.Unit.getInstance(i,true);
      if (unit && unit.owner !== cwt.INACTIVE && unit.loadedIn === transporter) {
        var moveType = unit.type.movetype;

        if (cwt.Move.canTypeMoveTo(moveType, x - 1, y)) return true;
        if (cwt.Move.canTypeMoveTo(moveType, x + 1, y)) return true;
        if (cwt.Move.canTypeMoveTo(moveType, x, y - 1)) return true;
        if (cwt.Move.canTypeMoveTo(moveType, x, y + 1)) return true;
      }
    }

    return false;
  }

};