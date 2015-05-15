package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class LaserType extends ObjectType {

  public int damage;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(damage) && Is.is.within(damage, -1, 10), errors, "damage");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    damage = grabMapValue(data, "damage", 0);
  }
}
