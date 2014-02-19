cwt.Lifecycle = {

  createUnit: function () {

  },

  destroyUnit: function (unit,silent) {
    model.events.clearUnitPosition(uid);

    this.owner = null;
    cwt.ClientEvents.unitDestroyed(this);

    // end game when the player does not have any unit left
    if (cwt.Config.getValue("noUnitsLeftLoose") === 1 &&
      model.unit_countUnits(this.owner) === 0) {
      controller.update_endGameRound();
    }
  },

  /**
   *
   * @return {boolean}
   */
  hasFreeUnitSlot: function () {
    return this.unitSlotFree !== INACTIVE_ID;
  },

  /**
   * Returns the index of the next free unit slot.
   *
   * @return {cwt.Unit}
   */
  getFreeUnitSlot: function () {
    return /** @type {cwt.Unit} */ cwt.Unit.getInstance(this.unitSlotFree);
  }

};