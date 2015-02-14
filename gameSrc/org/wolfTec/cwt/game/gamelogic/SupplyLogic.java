package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean
public class SupplyLogic {

  @Injected
  private LifecycleLogic lifecycle;

  @Injected
  private GameRoundBean gameround;

  /**
   * @return **true** if a given **unit** is a supplier, else **false**.
   *
   * @param {Unit} unit
   */
  public boolean isSupplier(Unit unit) {
    return unit.getType().supply != JSGlobal.undefined;
  }

  /**
   * Drains fuel of a **unit** if it has the ability of daily fuel usage.
   *
   * @param {Unit} unit
   */
  public void drainFuel(Unit unit) {
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
  public boolean hasLowAmmo(Unit unit) {
    int cAmmo = unit.getAmmo();
    return (cAmmo != 0 && cAmmo <= (unit.getType().ammo * 0.25));
  }

  /**
   * Returns true when the unit fuel is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowFuel(Unit unit) {
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
  public boolean hasRefillTargetsNearby(Unit supplier, int x, int y) {
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
  public boolean canRefillObjectAt(Unit supplier, int x, int y) {
    Unit target = gameround.getMap().getTile(x, y).unit;
    return (gameround.isValidPosition(x, y) && target != null && target.getOwner() == supplier
        .getOwner());
  }

  /**
   * Resupplies a unit at a given position.
   *
   * @param {number} x
   * @param {number} y
   */
  public void refillSuppliesByPosition(int x, int y) {
    refillSupplies(gameround.getMap().getTile(x, y).unit);
  }

  /**
   * Refills the supplies of an unit.
   *
   * @param {Unit} unit
   */
  public void refillSupplies(Unit unit) {
    unit.setAmmo(unit.getType().ammo);
    unit.setFuel(unit.getType().fuel);
  }

  /**
   * Raises funds from a **property**.
   *
   * @param {Property} property
   */
  public void raiseFunds(Property property) {
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
  public void propertyRepairsAt(int x, int y) {
    Tile tile = gameround.getMap().getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;

    Map<String, Integer> repairs = prop.type.repairs;
    int amount = repairs.$get(unit.getType().getMoveType().ID);
    if (amount == 0) {
      amount = repairs.$get(unit.getType().ID);
    }

    lifecycle.healUnit(unit, amount, true);
  }

}
