package org.wolftec.cwt.model.gameround;

import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.util.NumberUtil;

public class Unit implements Ownable
{

  public int hp;
  public int ammo;
  public int fuel;
  public int exp;
  public boolean hidden;
  public int loadedIn;
  public UnitType type;
  public boolean canAct;
  public Player owner;

  /**
   * Damages a unit.
   *
   * @param damage
   * @param minRest
   */
  public void takeDamage(int damage, int minRest)
  {
    hp -= damage;

    if (minRest > 0 && hp < minRest)
    {
      hp = minRest;
    }
  }

  /**
   * Heals an unit. If the unit health will be greater than the maximum health
   * value then the difference will be added as gold to the owners gold depot.
   *
   * @param health
   * @param diffAsGold
   */
  public void heal(int health, boolean diffAsGold)
  {
    hp += health;
    if (hp > 99)
    {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold)
      {
        int diff = hp - 99;
        owner.gold += NumberUtil.asInt((type.costs * diff) / 100);
      }

      hp = 99;
    }
  }

  /**
   * @return {boolean} true when hp is greater than 0 else false
   */
  public boolean isAlive()
  {
    return hp > 0;
  }

  /**
   * Returns true when the unit ammo is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowAmmo()
  {
    int cAmmo = ammo;
    int mAmmo = type.ammo;
    return (mAmmo != 0 && cAmmo <= NumberUtil.asInt(mAmmo * 0.25));
  }

  /**
   * Returns true when the unit fuel is lower equals 25%.
   *
   * @return {boolean}
   */
  public boolean hasLowFuel()
  {
    int cFuel = fuel;
    int mFuel = type.fuel;
    return (cFuel <= NumberUtil.asInt(mFuel * 0.25));
  }

  /**
   * Converts HP points to a health value.
   * 
   * @param pt
   * @return
   */
  public static int pointsToHealth(int pt)
  {
    return pt * 10;
  }

  /**
   * Converts and returns the HP points from the health value of an unit.
   * 
   * @param health
   * @return
   */
  public static int healthToPoints(int health)
  {
    return NumberUtil.asInt(health / 10) + 1;
  }

  /**
   * 
   * @param health
   * @return rest of unit health.
   */
  public static int healthToPointsRest(int health)
  {
    return health - (NumberUtil.asInt(health / 10));
  }

  @Override
  public Player getOwner()
  {
    return owner;
  }
}
