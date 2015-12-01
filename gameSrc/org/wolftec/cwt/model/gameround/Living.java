package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.core.NumberUtil;

public class Living {

  public static final int MAX_HP = 99;

  public int hp;

  public int healthPoints() {
    return healthToPoints(hp);
  }

  /**
   * Damages a unit.
   *
   * @param damage
   * @param minRest
   */
  public void damage(int damage, int minRest) {
    hp -= damage;

    if (minRest > 0 && hp < minRest) {
      hp = minRest;
    }
  }

  public void damagePoints(int damage, int minRest) {
    damage(pointsToHealth(damage), minRest);
  }

  /**
   * Heals an unit. If the unit health will be greater than the maximum health
   * value then the difference will be added as gold to the owners gold depot.
   *
   * @param health
   * @return difference between old health plus health minus MAX_HP
   */
  public int heal(int health) {
    int diff = 0;

    hp += health;
    if (hp > MAX_HP) {
      diff = hp - MAX_HP;
      hp = MAX_HP;
    }

    return diff;
  }

  public int healPoints(int points) {
    return heal(pointsToHealth(points));
  }

  public boolean isAlive() {
    return hp > 0;
  }

  /**
   * Converts HP points to a health value.
   * 
   * @param pt
   * @return
   */
  @Deprecated // TODO
  public static int pointsToHealth(int pt) {
    return pt * 10;
  }

  /**
   * Converts and returns the HP points from the health value of an unit.
   * 
   * @param health
   * @return
   */
  @Deprecated // TODO
  public static int healthToPoints(int health) {
    return NumberUtil.asInt(health / 10) + 1;
  }

  /**
   * 
   * @param health
   * @return rest of unit health.
   */
  @Deprecated // TODO
  public static int healthToPointsRest(int health) {
    return health - (NumberUtil.asInt(health / 10));
  }
}
