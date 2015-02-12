package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;

public interface SupplyLogic extends BaseLogic, LifecycleLogic {

  /**
   * @return **true** if a given **unit** is a supplier, else **false**.
   *
   * @param {Unit} unit
   */
  default boolean isSupplier(Unit unit) {
    return unit.getType().supply != JSGlobal.undefined;
  }

  /**
   * Drains fuel of a **unit** if it has the ability of daily fuel usage.
   *
   * @param {Unit} unit
   */
  default void drainFuel(Unit unit) {
    int v = unit.getType().dailyFuelDrain;
    if (v != EngineGlobals.INACTIVE_ID) {

      // hidden units may drain more fuel
      if (unit.isHidden() && unit.getType().dailyFuelDrainHidden != EngineGlobals.INACTIVE_ID) {
        v = unit.getType().dailyFuelDrainHidden;
      }

      unit.setFuel(unit.getFuel() - v);
    }
  }

  /**
   * Returns true when the unit ammo is lower equals 25%.
   *
   * @return {boolean}
   */
  default boolean hasLowAmmo(Unit unit) {
    int cAmmo = unit.getAmmo();
    return (cAmmo != 0 && cAmmo <= (unit.getType().ammo * 0.25));
  }

  /**
   * Returns true when the unit fuel is lower equals 25%.
   *
   * @return {boolean}
   */
  default boolean hasLowFuel(Unit unit) {
    return (unit.getFuel() <= (unit.getType().fuel * 0.25));
  }

  /**
   * Returns **true** if a supplier at a given position (**x**,**y**) has
   * objects nearby which can be supplied.
   *
   * @param {Unit} supplier
   * @param {number} x
   * @param {number} y
   * @return **true** if a **supplier** unit can support units in the near of a
   *         given tile at the position, else **false**.
   */
  default boolean hasRefillTargetsNearby(Unit supplier, int x, int y) {
    if (canRefillObjectAt(supplier, x + 1, y))
      return true;
    else if (canRefillObjectAt(supplier, x - 1, y))
      return true;
    else if (canRefillObjectAt(supplier, x, y + 1))
      return true;
    else if (canRefillObjectAt(supplier, x, y - 1))
      return true;
    else
      return false;
  }

  /**
   *
   * @param {Unit} supplier
   * @param {number} x
   * @param {number} y
   * @return **true** if a **supplier** unit can support a given tile at the
   *         position (**x**,**y**), else **false**.
   */
  default boolean canRefillObjectAt(Unit supplier, int x, int y) {
    Unit target = getGameRound().getMap().getTile(x, y).unit;
    return (getGameRound().isValidPosition(x, y) && target != null && target.getOwner() == supplier
        .getOwner());
  }

  /**
   * Resupplies a unit at a given position.
   *
   * @param {number} x
   * @param {number} y
   */
  default void refillSuppliesByPosition(int x, int y) {
    refillSupplies(getGameRound().getMap().getTile(x, y).unit);
  }

  /**
   * Refills the supplies of an unit.
   *
   * @param {Unit} unit
   */
  default void refillSupplies(Unit unit) {
    unit.setAmmo(unit.getType().ammo);
    unit.setFuel(unit.getType().fuel);
  }

  /**
   * Raises funds from a **property**.
   *
   * @param {Property} property
   */
  default void raiseFunds(Property property) {
    if (property.type.funds != 0) {
      property.owner.gold += property.type.funds;
    }
  }

  /**
   * The property will heal the unit that occupies the tile where the property
   * is in. The following requirements must be fulfilled.
   * 
   * a) the property has a healing ability
   * 
   * b) the property is occupied by an unit of the same team
   * 
   * c) the occupying unit can be healed by the property
   * 
   * @param x
   * @param y
   */
  default void propertyRepairsAt(int x, int y) {
    Tile tile = getGameRound().getMap().getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;

    Map<String, Integer> repairs = prop.type.repairs;
    int amount = repairs.$get(unit.getType().getMoveType().ID);
    if (amount == 0) {
      amount = repairs.$get(unit.getType().ID);
    }

    healUnit(unit, amount, true);
  }

}
