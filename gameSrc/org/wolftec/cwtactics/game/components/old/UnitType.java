package org.wolftec.cwtactics.game.components.old;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class UnitType extends ObjectType {

  public int cost;
  public int range;
  public int vision;

  public int fuel;
  public int ammo;

  public String movetype;

  public int dailyFuelDrain;
  public int dailyFuelDrainHidden;
  public int maxloads;

  public Array<String> canload;
  public Array<String> supply;

  public int captures;

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
    checkExpression(Is.is.integer(cost) && Is.is.within(cost, -1, 1000000) && Is.is.not.equal(cost, 0), errors, "cost");
    checkExpression(Is.is.integer(range) && Is.is.within(range, 0, Constants.MAX_SELECTION_RANGE + 1), errors, "range");
    checkExpression(Is.is.integer(vision) && Is.is.within(vision, 0, Constants.MAX_SELECTION_RANGE + 1), errors, "vision");
    checkExpression(Is.is.integer(fuel) && Is.is.within(fuel, -1, 100), errors, "fuel");
    checkExpression(Is.is.integer(ammo) && Is.is.within(ammo, -1, 100), errors, "ammo");
    checkExpression(Is.is.integer(dailyFuelDrain) && Is.is.within(dailyFuelDrain, -1, 100), errors, "dailyFuelDrain");
    checkExpression(Is.is.integer(dailyFuelDrainHidden) && Is.is.within(dailyFuelDrainHidden, dailyFuelDrain, 100), errors, "dailyFuelDrainHidden");
    checkExpression(Is.is.integer(maxloads) && Is.is.within(maxloads, -1, 5), errors, "maxloads");
    checkExpression(Is.is.integer(captures) && Is.is.within(captures, -1, 1000), errors, "captures");
    checkType(attack, errors);
    checkType(suicide, errors);
    // TODO check movetype
    // TODO check canload
    // TODO check supply
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    attack = new AttackType();
    suicide = new SuicideType();

    cost = grabMapValue(data, "cost", 1);
    range = grabMapValue(data, "range", 1);
    vision = grabMapValue(data, "vision", 1);
    fuel = grabMapValue(data, "fuel", 0);
    ammo = grabMapValue(data, "ammo", 0);
    movetype = grabMapValue(data, "movetype", null);
    dailyFuelDrain = grabMapValue(data, "dailyFuelDrain", 0);
    dailyFuelDrainHidden = grabMapValue(data, "dailyFuelDrainHidden", dailyFuelDrain + 1);
    maxloads = grabMapValue(data, "maxloads", 0);
    canload = grabMapValue(data, "canload", JSCollections.$array());
    supply = grabMapValue(data, "supply", JSCollections.$array());
    captures = grabMapValue(data, "captures", 0);
    stealth = grabMapValue(data, "stealth", false);
    attack.grabDataFromMap(grabMapValue(data, "attack", JSCollections.$map()));
    suicide.grabDataFromMap(grabMapValue(data, "suicide", JSCollections.$map()));
  }
}
