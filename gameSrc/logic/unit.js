my.extendClass(cwt.Unit, {
  STATIC: {

    /**
     * Damages a unit.
     */
    takeDamage: function (damage, minRest) {
      this.hp -= damage;

      if (minRest && this.hp <= minRest) {
        this.hp = minRest;
      } else {
        if (this.hp <= 0) model.events.destroyUnit(uid);
      }
    },

    /**
     * Heals an unit. If the unit health will be greater than the maximum
     * health value then the difference will be added as gold to the
     * owners gold depot.
     */
    heal: function (health, diffAsGold) {
      this.hp += health;
      if (this.hp > 99) {

        // pay difference of the result health and 100 as
        // gold ( in realtion to the unit cost ) to the
        // unit owners gold depot
        if (diffAsGold === true) {
          var diff = this.hp - 99;
          this.owner.gold += parseInt((this.type.cost * diff) / 100, 10);
        }

        this.hp = 99;
      }
    },
  
    /**
     * Deregisters an unit object from the stock of a player. The tile, where 
     * the unit is placed on, will be freed from any position information.
     */
    destroy: function (uid) {
      var unit = model.unit_data[uid];

      model.events.clearUnitPosition(uid);

      // mark slot as unused
      unit.owner = INACTIVE_ID;

      // end game when the player does not have any unit left
      if (controller.configValue("noUnitsLeftLoose") === 1 &&
        model.unit_countUnits(unit.owner) === 0) {

        controller.update_endGameRound();
      }
    }


  }
});