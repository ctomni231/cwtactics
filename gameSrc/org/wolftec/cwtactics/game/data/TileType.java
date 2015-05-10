package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class TileType extends ObjectType {

  public int defense;
  public boolean blocksVision = false;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.bool(blocksVision), errors, "blocksVision");
    checkExpression(Is.is.integer(defense) && Is.is.above(defense, -1), errors, "defense");
  }
}
