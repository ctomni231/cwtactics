package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class MoveType extends ObjectType {

  public Map<String, Integer> costs;

  @Override
  protected void validateData(Array<String> errors) {
    JsUtil.forEachObjectValue(
        costs,
        (tileTypeId, movecosts) -> {
          checkExpression(Is.is.string(tileTypeId), errors, "costs -> " + tileTypeId + " key");
          // TODO id exists check + is tile check
          checkExpression(Is.is.integer((Number) movecosts) && Is.is.within((Number) movecosts, -2, 100) && Is.is.not.equal((Number) movecosts, 0), errors,
              "costs -> " + tileTypeId + " value");
        });
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    costs = grabMapValue(data, "costs", JSCollections.$map());
  }
}
