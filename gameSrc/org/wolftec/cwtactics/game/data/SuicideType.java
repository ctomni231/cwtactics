package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class SuicideType extends ObjectType {

  public int damage;
  public int range;
  public Array<String> noDamage;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(damage) && Is.is.within(damage, -1, 10), errors, "damage");
    checkExpression(Is.is.integer(range) && Is.is.within(range, 0, Constants.MAX_SELECTION_RANGE + 1), errors, "range");
    checkExpression(Is.is.array(noDamage), errors, "noDamage");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    damage = grabMapValue(data, "damage", 0);
    range = grabMapValue(data, "range", 1);
    noDamage = grabMapValue(data, "noDamage", JSCollections.$array());
  }
}
