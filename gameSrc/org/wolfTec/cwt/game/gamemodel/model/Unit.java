package org.wolfTec.cwt.game.gamemodel.model;

import org.wolfTec.validation.IntValue;
import org.wolfTec.wolfTecEngine.util.ConvertUtility;

public class Unit {

  @IntValue(min = 0, max = 99)
  public int hp;

  @IntValue(min = 0)
  public int ammo;

  @IntValue(min = 0)
  public int fuel;

  public boolean hidden;
  public boolean canAct;

  public Unit loadedIn;
  public UnitType type;
  public Player owner;

  /**
   * @param type
   */
  public void initByType(UnitType type) {
    this.type = type;
    this.hp = 99;
    this.ammo = type.ammo;
    this.fuel = type.fuel;
    this.hidden = false;
    this.loadedIn = null;
    this.canAct = false;
  }

  /**
   * Converts HP points to a health value.
   *
   * @param pt
   * @example 6 HP -> 60 health 3 HP -> 30 health
   * @returns {number}
   */
  public static int pointsToHealth(int pt) {
    return (pt * 10);
  }

  /**
   * Converts and returns the HP points from the health value of an unit.
   *
   * @param health
   * @example health -> HP 69 -> 7 05 -> 1 50 -> 6 99 -> 10
   * @returns {number}
   */
  public static int healthToPoints(int health) {
    return ConvertUtility.floatToInt(health / 10) + 1;
  }

  /**
   * Gets the rest of unit health.
   *
   * @param health
   * @returns {number}
   */
  public static int healthToPointsRest(int health) {
    return health - healthToPoints(health);
  }
}
