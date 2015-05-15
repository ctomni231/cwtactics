package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class CoType extends ObjectType {

  public int coStars;
  public int scoStars;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(coStars) && Is.is.within(coStars, 0, 11), errors, "coStars");
    checkExpression(Is.is.integer(scoStars) && Is.is.within(scoStars, 0, 11), errors, "scoStars");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    coStars = grabMapValue(data, "coStars", 1);
    scoStars = grabMapValue(data, "scoStars", 1);
  }
}
