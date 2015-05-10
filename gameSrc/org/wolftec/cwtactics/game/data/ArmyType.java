package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class ArmyType extends ObjectType {

  public String name;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.string(name) && Is.is.within(name.length(), 3, 20), errors, "name");
  }
}
