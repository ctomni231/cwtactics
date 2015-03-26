package org.wolftec.cwtactics.game.logic;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Property;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.domain.model.Unit;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;

@ManagedComponent
public class SupplyLogic {

  @Injected
  private LifecycleLogic lifecycle;

  @Injected
  private GameManager gameround;

  /**
   * @return **true** if a given **unit** is a supplier, else **false**.
   *
   * @param {Unit} unit
   */
  public boolean isSupplier(Unit unit) {
    return unit.type.supply != JSGlobal.undefined;
  }

  /**
   * Drains fuel of a **unit** if it has the ability of daily fuel usage.
   *
   * @param {Unit} unit
   */
  public void drainFuel(Unit unit) {
    int v = unit.type.dailyFuelDrain;
    if (v != EngineGlobals.INACTIVE_ID) {

      // hidden units may drain more fuel
      if (unit.hidden && unit.type.dailyFuelDrainHidden != EngineGlobals.INACTIVE_ID) {
        v = unit.type.dailyFuelDrainHidden;
      }

      unit.fuel = unit.fuel - v;
    }
  }

  /**
   * Returns true when the unit ammo is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowAmmo(Unit unit) {
    int cAmmo = unit.ammo;
    return (cAmmo != 0 && cAmmo <= (unit.type.ammo * 0.25));
  }

  /**
   * Returns true when the unit fuel is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowFuel(Unit unit) {
    return (unit.fuel <= (unit.type.fuel * 0.25));
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
    Unit target = gameround.getTile(x, y).unit;
    return (gameround.isValidPosition(x, y) && target != null && target.owner == supplier.owner);
  }

  /**
   * Resupplies a unit at a given position.
   *
   * @param {number} x
   * @param {number} y
   */
  public void refillSuppliesByPosition(int x, int y) {
    refillSupplies(gameround.getTile(x, y).unit);
  }

  /**
   * Refills the supplies of an unit.
   *
   * @param {Unit} unit
   */
  public void refillSupplies(Unit unit) {
    unit.ammo = unit.type.ammo;
    unit.fuel = unit.type.fuel;
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
    Tile tile = gameround.getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;

    Map<String, Integer> repairs = prop.type.repairs;
    int amount = repairs.$get(unit.type.getMoveType().ID);
    if (amount == 0) {
      amount = repairs.$get(unit.type.ID);
    }

    lifecycle.healUnit(unit, amount, true);
  }

}
