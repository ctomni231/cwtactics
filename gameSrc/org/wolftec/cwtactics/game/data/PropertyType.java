package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class PropertyType extends ObjectType {

  public Map<String, Integer> repairs;
  public int defense = 0;
  public int vision = 0;
  public int capturePoints = 20;
  public boolean visionBlocker;
  public RocketSiloType rocketsilo;
  public Array<String> builds;
  public LaserType laser;
  public String changesTo;
  public int funds = 0;
  public boolean looseAfterCaptured = false;
  public boolean blocker = false;
  public boolean notTransferable = false;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(defense) && Is.is.within(defense, -1, 7), errors, "defense");
    checkExpression(Is.is.integer(vision) && Is.is.within(vision, -1, Constants.MAX_SELECTION_RANGE + 1), errors, "vision");
    checkExpression(Is.is.integer(capturePoints) && Is.is.within(capturePoints, -1, 21), errors, "capturePoints");

    checkType(rocketsilo, errors);

    checkExpression(Is.is.array(builds) && Is.is.not.empty(builds), errors, "builds");
    JsUtil.forEachArrayValue(builds, (index, value) -> {
      // TODO id check
      });

    JsUtil.forEachObjectValue(repairs, (unitOrMoveTypeId, amount) -> {
      checkExpression(Is.is.string(unitOrMoveTypeId), errors, "reapirs key " + unitOrMoveTypeId);
      checkExpression(Is.is.integer((Number) amount) && Is.is.within((Number) amount, 0, 11), errors, "repairs value of " + unitOrMoveTypeId);
      // TODO id check
      });

    checkType(laser, errors);

    checkExpression(Is.is.string(changesTo) && Is.is.not.empty(changesTo), errors, "changesTo");
    checkExpression(Is.is.integer(funds) && Is.is.within(funds, 0, 99999), errors, "funds");
    checkExpression(Is.is.bool(looseAfterCaptured), errors, "looseAfterCaptured");
    checkExpression(Is.is.bool(notTransferable), errors, "notTransferable");
    checkExpression(Is.is.bool(blocker), errors, "blocker");
  }
}