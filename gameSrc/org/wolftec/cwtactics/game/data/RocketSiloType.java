package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class RocketSiloType extends ObjectType {

  public Array<String> fireable;

  public int damage;

  public int range;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.array(fireable), errors, "fireable");
    checkExpression(Is.is.integer(range) && Is.is.within(range, 1, 5), errors, "range");
    checkExpression(Is.is.integer(damage) && Is.is.within(damage, 1, 9), errors, "damage");
  }
}
