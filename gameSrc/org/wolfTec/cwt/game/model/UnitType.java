package org.wolfTec.cwt.game.model;

import java.util.Iterator;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.utility.validation.MaxValue;
import org.wolfTec.cwt.utility.validation.MinValue;
import org.wolfTec.cwt.utility.validation.Not;
import org.wolfTec.cwt.utility.validation.NotNull;

/**
 * Unit type which holds all information about a unit type. In general this are
 * all non-changeable data of an unit.
 */
public class UnitType extends ObjectType {

  @MinValue(-1) @Not(0) public int cost;

  @MinValue(0) @MaxValue(Constants.MAX_SELECTION_RANGE) public int range;

  @MinValue(1) @MaxValue(Constants.MAX_SELECTION_RANGE) public int vision;

  @MinValue(0) @MaxValue(99) public int fuel;

  @MinValue(0) @MaxValue(99) public int ammo;

  @NotNull public String movetype;

  @MinValue(1) @MaxValue(99) public int dailyFuelDrain;

  @MinValue(2) @MaxValue(99) public int dailyFuelDrainHidden;

  @MinValue(-1) @Not(0) public int maxloads;

  public Array<String> canload;

  public Array<String> supply;

  @MinValue(-1) @Not(0) public int captures;
  
  public boolean stealth;

  public AttackType attack;
  public SuicideType suicide;

  public UnitType() {
    cost = Constants.INACTIVE_ID;
    range = Constants.INACTIVE_ID;
    vision = Constants.INACTIVE_ID;
    fuel = Constants.INACTIVE_ID;
    ammo = Constants.INACTIVE_ID;
    movetype = null;
    dailyFuelDrain = Constants.INACTIVE_ID;
    dailyFuelDrainHidden = Constants.INACTIVE_ID;
    maxloads = Constants.INACTIVE_ID;
    canload = null;
    supply = null;
    captures = Constants.INACTIVE_ID;
    stealth = false;
    attack = null;
    suicide = null;
  }

  @Override public void validate() {
  }

  private void checkAttackMap(Map<String, Integer> map) {
    Iterator<String> unitIds = map.iterator();
    while (unitIds.hasNext()) {
      String targetId = unitIds.next(); // TODO
      // AssertUtilyBean.notEmpty(targetId);
      // AssertUtilyBean.greaterEquals(map.$get(targetId), 1);
    }
  }

  /**
   *
   * @return move type object for the given move type id of the unit type
   */
  @SuppressWarnings("unchecked") public MoveType getMoveType() {
    // TODO
    // return ((Database<MoveType>)
    // CustomWarsTactics.getBean("moveTypeDb")).getSheet(movetype);
    return null;
  }
}
