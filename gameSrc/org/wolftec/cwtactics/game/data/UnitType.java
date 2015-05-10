package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class UnitType extends ObjectType {

  public int cost = -1;
  public int range = 1;
  public int vision = 1;

  public int fuel = 0;
  public int ammo = 0;

  public String movetype;

  public int dailyFuelDrain = 0;
  public int dailyFuelDrainHidden = 0;
  public int maxloads = -1;

  public Array<String> canload;
  public Array<String> supply;

  public int captures = -1;

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

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.bool(stealth), errors, "stealth");
    checkExpression(Is.is.integer(cost) && Is.is.within(cost, -1, 999999) && Is.is.not.equal(cost, 0), errors, "cost");
    checkExpression(Is.is.integer(range) && Is.is.within(range, 0, Constants.MAX_SELECTION_RANGE), errors, "range");
    checkExpression(Is.is.integer(vision) && Is.is.within(vision, 1, Constants.MAX_SELECTION_RANGE), errors, "vision");
    checkExpression(Is.is.integer(fuel) && Is.is.within(fuel, 0, 99), errors, "fuel");
    checkExpression(Is.is.integer(ammo) && Is.is.within(ammo, 0, 99), errors, "ammo");
    checkExpression(Is.is.integer(dailyFuelDrain) && Is.is.within(dailyFuelDrain, 0, 99), errors, "dailyFuelDrain");
    checkExpression(Is.is.integer(dailyFuelDrainHidden) && Is.is.within(dailyFuelDrainHidden, dailyFuelDrain + 1, 99), errors, "dailyFuelDrainHidden");
    checkExpression(Is.is.integer(maxloads) && Is.is.within(maxloads, -1, 5) && Is.is.not.equal(maxloads, 0), errors, "maxloads");
    checkExpression(Is.is.integer(captures) && Is.is.within(captures, -1, 999) && Is.is.not.equal(captures, 0), errors, "captures");
    checkType(attack, errors);
    checkType(suicide, errors);
    // TODO check movetype
    // TODO check canload
    // TODO check supply
  }
}
