/**
 *
 * @namespace
 */
cwt.Attack = {

  /**
   * Calculates the targets of a battle unit. If `data` is given, then
   * the attack targets will be marked in this object.
   */
  calculateTargets: function (uid, x, y, data, markAttackableTiles) {
    var markInData = (typeof data !== "undefined");
    if (!markAttackableTiles) markAttackableTiles = false;

    assert(model.unit_isValidUnitId(uid));
    if (markInData) data.setCenter(x, y, INACTIVE_ID);

    var unit = model.unit_data[uid];
    var teamId = model.player_data[unit.owner].team;
    var attackSheet = unit.type.attack;

    if (arguments.length === 1) {
      x = unit.x;
      y = unit.y;
    }

    if (DEBUG) util.log("calculate targets for unit id", uid, "at", x, ",", y);

    assert(model.map_isValidPosition(x, y));
    if (arguments.length === 3) assert(util.isBoolean(markAttackableTiles));

    // NO BATTLE UNIT ?
    if (typeof attackSheet === "undefined") return false;

    // ONLY MAIN WEAPON WITHOUT AMMO ?
    if (model.battle_hasMainWeapon(unit.type) && !model.battle_hasSecondaryWeapon(unit.type) &&
      unit.type.ammo > 0 && unit.ammo === 0) return false;

    var minR = 1;
    var maxR = 1;

    if (unit.type.attack.minrange) {

      controller.prepareTags(x, y, uid);
      minR = controller.scriptedValue(unit.owner, "minrange", unit.type.attack.minrange);
      maxR = controller.scriptedValue(unit.owner, "maxrange", unit.type.attack.maxrange);
    }

    var lX;
    var hX;
    var lY = y - maxR;
    var hY = y + maxR;
    if (lY < 0) lY = 0;
    if (hY >= model.map_height) hY = model.map_height - 1;
    for (; lY <= hY; lY++) {

      var disY = Math.abs(lY - y);
      lX = x - maxR + disY;
      hX = x + maxR - disY;
      if (lX < 0) lX = 0;
      if (hX >= model.map_width) hX = model.map_width - 1;
      for (; lX <= hX; lX++) {

        if (markAttackableTiles) {
          if (model.map_getDistance(x, y, lX, lY) >= minR) {

            // SYMBOLIC YES YOU CAN ATTACK THIS TILE
            data.setValueAt(lX, lY, 1);
          }
        } else {

          // IN FOG ?
          if (model.fog_turnOwnerData[lX][lY] === 0) continue;

          if (model.map_getDistance(x, y, lX, lY) >= minR) {

            var dmg = -1;

            // ONLY UNIT FROM OTHER TEAMS ARE ATTACK ABLE
            var tUnit = model.unit_posData[lX][lY];
            if (tUnit !== null && model.player_data[tUnit.owner].team !== teamId) {
              dmg = model.battle_getBaseDamageAgainst(unit, tUnit);
              if (dmg > 0) {

                // IF DATA MODE IS ON, THEN MARK THE POSITION
                // ELSE RETURN TRUE
                if (markInData) data.setValueAt(lX, lY, dmg);
                else return true;
              }
            }

          }
        }
      }
    }

    return false;
  }
};