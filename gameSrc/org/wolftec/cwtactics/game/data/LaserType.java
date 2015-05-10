package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class LaserType extends ObjectType {

  public int damage;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(damage) && Is.is.within(damage, 1, 9), errors, "damage");
  }
}
