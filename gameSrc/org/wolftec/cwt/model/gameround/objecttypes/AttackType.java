package org.wolftec.cwt.model.gameround.objecttypes;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;

public class AttackType {

  public static final int FIRETYPE_NONE = 0;
  public static final int FIRETYPE_INDIRECT = 1;
  public static final int FIRETYPE_DIRECT = 2;
  public static final int FIRETYPE_BALLISTIC = 3;

  public int minrange;
  public int maxrange;
  public Map<String, Integer> main_wp;
  public Map<String, Integer> sec_wp;

  public AttackType() {
    main_wp = JSCollections.$map();
    sec_wp = JSCollections.$map();
  }

  /**
   * 
   * @param attacker
   * @return the fire type of an unit
   */
  public int getFireType() {
    if (minrange == Constants.INACTIVE && maxrange == Constants.INACTIVE) {
      return FIRETYPE_NONE;

    } else if (minrange == 1 && maxrange == 1) {
      return FIRETYPE_DIRECT;

    } else if (minrange == 1 && maxrange > 1) {
      return FIRETYPE_BALLISTIC;

    } else if (minrange > 1 && maxrange > 1) {
      return FIRETYPE_INDIRECT;
    }

    return AssertUtil.neverReached("unknown firetype");
  }

  /**
   * A direct unit can fire and move in the same turn but has a minimum and
   * maximum range of 1 (means must stand next by an opponent to attack).
   * 
   * @param unit
   * @return
   */
  public boolean isDirect() {
    return getFireType() == FIRETYPE_DIRECT;
  }

  /**
   * An indirect unit cannot fire and move in the same turn but has a minimum
   * range of 2 or greater.
   * 
   * @param unit
   * @return
   */
  public boolean isIndirect() {
    return getFireType() == FIRETYPE_INDIRECT;
  }

  /**
   * A ballistic unit cannot fire and move in the same turn but has a minimum
   * range of 1.
   * 
   * @param unit
   * @return
   */
  public boolean isBallistic() {
    return getFireType() == FIRETYPE_BALLISTIC;
  }

  /**
   * @param unit
   * @return
   */
  public boolean cannotAttack() {
    return getFireType() == FIRETYPE_NONE;
  }

}
