package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class RocketSiloType extends ObjectType {

  public int damage;
  public int range;
  public Array<String> fireableBy;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.array(fireableBy), errors, "fireable");
    checkExpression(Is.is.integer(range) && Is.is.within(range, 0, 6), errors, "range");
    checkExpression(Is.is.integer(damage) && Is.is.within(damage, -1, 10), errors, "damage");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    damage = grabMapValue(data, "damage", 0);
    range = grabMapValue(data, "range", 1);
    fireableBy = grabMapValue(data, "fireable", JSCollections.$array());
  }
}
