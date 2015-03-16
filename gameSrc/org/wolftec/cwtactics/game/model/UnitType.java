package org.wolftec.cwtactics.game.model;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.validation.validators.IntValue;
import org.wolftec.validation.validators.StringValue;

public class UnitType extends ObjectType {

  @IntValue(min = -1, max = 99999, not = 0)
  public int cost = -1;

  @IntValue(min = 0, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int range = 1;

  @IntValue(min = 1, max = EngineGlobals.MAX_SELECTION_RANGE)
  public int vision = 1;

  @IntValue(min = 0, max = 99)
  public int fuel = 0;

  @IntValue(min = 0, max = 99)
  public int ammo = 0;

  @StringValue(minLength = 4, maxLength = 4)
  public String movetype;

  @IntValue(min = 0, max = 99)
  public int dailyFuelDrain = 0;

  @IntValue(min = 0, max = 99, not = 1)
  public int dailyFuelDrainHidden = 0;

  @IntValue(min = -1, max = 5, not = 0)
  public int maxloads = EngineGlobals.INACTIVE_ID;

  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> canload;

  @StringValue(minLength = 4, maxLength = 4)
  public Array<String> supply;

  @IntValue(min = -1, max = 999, not = 0)
  public int captures = EngineGlobals.INACTIVE_ID;

  public boolean stealth;

  public AttackType attack;
  public SuicideType suicide;

  /**
   *
   * @return move type object for the given move type id of the unit type
   */
  @SuppressWarnings("unchecked")
  public MoveType getMoveType() {
    // TODO
    // return ((Database<MoveType>)
    // CustomWarsTactics.getBean("moveTypeDb")).getSheet(movetype);
    return null;
  }
}
