package org.wolftec.cwtactics.game.components.old;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;

public class TileType extends ObjectType {

  public int defense;
  public boolean blocksVision;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.bool(blocksVision), errors, "blocksVision");
    checkExpression(Is.is.integer(defense) && Is.is.above(defense, -1), errors, "defense");
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    defense = grabMapValue(data, "defense", 0);
    blocksVision = grabMapValue(data, "blocksVision", false);
  }
}
