package org.wolftec.cwt.logic;

import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.Property;
import org.wolftec.cwt.model.Tile;
import org.wolftec.cwt.model.Unit;
import org.wolftec.cwt.system.Nullable;

public class SupplyLogic implements Injectable {

  private ModelManager model;

  /**
   * @param unit
   * @return **true** if a given **unit** is a supplier, else **false**.
   */
  public boolean isSupplier(Unit unit) {
    return Nullable.isPresent(unit.type.supply);
  }

  /**
   * Returns **true** if a supplier at a given position (**x**,**y**) has
   * objects nearby which can be supplied.
   * 
   * @param supplier
   * @param x
   * @param y
   * @return **true** if a **supplier** unit can support units in the near of a
   *         given tile at the position, else **false**.
   */
  public boolean hasRefillTargetsNearby(Unit supplier, int x, int y) {
    if (canRefillObjectAt(supplier, x + 1, y)) {
      return true;
    } else if (canRefillObjectAt(supplier, x - 1, y)) {
      return true;
    } else if (canRefillObjectAt(supplier, x, y + 1)) {
      return true;
    } else if (canRefillObjectAt(supplier, x, y - 1)) {
      return true;

    } else {
      return false;
    }
  };

  /**
   * 
   * @param {Unit} supplier
   * @param {number} x
   * @param {number} y
   * @return **true** if a **supplier** unit can support a given tile at the
   *         position (**x**,**y**), else **false**.
   */
  public boolean canRefillObjectAt(Unit supplier, int x, int y) {
    Unit target = model.getTile(x, y).unit;
    return (model.isValidPosition(x, y) && Nullable.isPresent(target) && target.owner == supplier.owner);
  }

  /**
   * Resupplies a unit at a given position.
   * 
   * @param {number} x
   * @param {number} y
   */
  public void refillSuppliesByPosition(int x, int y) {
    Unit unit = model.getTile(x, y).unit;
    refillSupplies(unit);
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
    if (property.type.funds > 0) {
      property.owner.gold += property.type.funds;
    }
  }

  /**
   * Drains fuel of a **unit** if it has the ability of daily fuel usage.
   *
   * @param {Unit} unit
   */
  public void drainFuel(Unit unit) {
    int value = unit.type.dailyFuelDrain;
    if (value > 0) {
      // hidden units may drain more fuel
      if (unit.hidden && unit.type.dailyFuelDrainHidden > 0) {
        value = unit.type.dailyFuelDrainHidden;
      }

      unit.fuel -= value;
    }
  }

  //
  // Returns **true** if the property at the position (**x**,**y**) fulfills the
  // following requirements
  // a) the property has a healing ability
  // b) the property is occupied by an unit of the same team
  // c) the occupying unit can be healed by the property
  //
  // The value **false** will be returned if one of the requirements fails.
  //
  public boolean canPropertyRepairAt(int x, int y) {
    Tile tile = model.getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;
    if (prop != null && unit != null) {
      if (prop.type.repairs.indexOf(unit.type.movetype) != -1) {
        return true;
      }
    }
    return false;
  }

  //
  // The property will heal the unit that occupies the tile where the property
  // is in. The following requirements must
  // be fulfilled.
  // a) the property has a healing ability
  // b) the property is occupied by an unit of the same team
  // c) the occupying unit can be healed by the property
  //
  public void propertyRepairsAt(int x, int y) {
    Tile tile = model.getTile(x, y);
    Property prop = tile.property;
    Unit unit = tile.unit;

    unit.heal(prop.type.repairAmount, true);
  }
}
