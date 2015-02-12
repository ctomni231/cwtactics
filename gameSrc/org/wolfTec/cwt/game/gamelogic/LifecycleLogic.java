package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.game.model.Player;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.cwt.game.model.types.UnitType;
import org.wolfTec.cwt.game.utility.AssertUtilyBean;

public interface LifecycleLogic extends BaseLogic, FogLogic {

  /**
   * 
   * @param player
   * @return
   */
  default boolean isInactivePlayer(Player player) {
    return player.team != Constants.INACTIVE_ID;
  }

  /**
   * A player has loosed the game round due a specific reason. This function
   * removes all of his units and properties. Furthermore the left teams will be
   * checked. If only one team is left then the end game event will be invoked.
   * 
   * @param player
   */
  default void deactivatePlayer(Player player) {
    player.team = Constants.INACTIVE_ID;
    
    // drop units
    if (constants.DEBUG) assert(player instanceof model.Player);

    for (var i = 0, e = model.units.length; i < e; i++) {
        var unit = model.units[i];
        if (unit.owner === player) {
            // TODO
        }
    }

    // drop properties
    for (var i = 0, e = model.properties.length; i < e; i++) {
        var prop = model.properties[i];
        if (prop.owner === player) {
            prop.makeNeutral();

            // TODO: change type when the property is a changing type property
            var changeType = prop.type.changeAfterCaptured;
        }
    }

    player.deactivate();

    // when no opposite teams are found then the game has ended
    if (!model.areEnemyTeamsLeft()) {
        // TODO
    }
  }

  /**
   * 
   * @param player
   * @param teamNumber
   */
  default void activatePlayer(Player player, int teamNumber) {
    player.team = teamNumber;
  }

  /**
   * @return {boolean}
   */
  default boolean isInactiveUnit(Unit unit) {
    return unit.getOwner() == null;
  }

  /**
   * Damages a unit.
   *
   * @param damage
   * @param minRest
   */
  default void damageUnit(Unit unit, int damage, int minRest) {
    if (damage == 0) return;

    unit.setHp(unit.getHp() - damage);
    if (unit.getHp() < minRest) unit.setHp(minRest);
  }

  /**
   * Heals an unit. If the unit health will be greater than the maximum health
   * value then the difference will be added as gold to the owners gold depot.
   *
   * @param health
   * @param diffAsGold
   */
  default void healUnit(Unit unit, int health, boolean diffAsGold) {
    if (health == 0) return;

    unit.setHp(unit.getHp() + health);
    if (unit.getHp() > 99) {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold == true) {
        int diff = unit.getHp() - 99;
        unit.getOwner().gold += JSGlobal.parseInt((unit.getType().cost * diff) / 100, 10);
      }

      unit.setHp(99);
    }
  }

  default void createUnit(int x, int y, Player player, UnitType type) {
    Tile tile = getGameRound().getMap().getTile(x, y);
    Unit unit = getInactiveUnit();

    // set references
    unit.setOwner(player);
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(sheet.units.sheets[type]);

    addUnitVision(x, y, player);
  }

  default void destroyUnit(int x, int y, boolean silent) {
    Tile tile = getGameRound().getMap().getTile(x, y);
    removeUnitVision(x, y, tile.unit.getOwner());

    // TODO check loads

    // remove references
    Player owner = tile.unit.getOwner();
    owner.numberOfUnits--;

    tile.unit.setOwner(null);
    tile.unit = null;

    // end game when the player does not have any unit left
    if (getGameConfig().getConfigValue("cfgNoUnitsLeftLoose") == 1 && owner.numberOfUnits == 0) {
      this.deactivatePlayer(owner);
    }
  }

  default boolean hasFreeUnitSlot(Player player) {
    return player.numberOfUnits < Constants.MAX_UNITS;
  }
}
