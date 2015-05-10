package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class SuicideType extends ObjectType {

  public int damage;
  public int range;
  public Array<String> noDamage;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(damage) && Is.is.within(damage, 0, 10), errors, "damage");
    checkExpression(Is.is.integer(range) && Is.is.within(range, 0, Constants.MAX_SELECTION_RANGE), errors, "range");
    checkExpression(Is.is.array(noDamage), errors, "noDamage");
  }
}
