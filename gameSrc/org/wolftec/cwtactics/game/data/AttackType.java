package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class AttackType extends ObjectType {

  public Integer minrange = 1;
  public Integer maxrange = 1;
  public Map<String, Integer> mainWeapon;
  public Map<String, Integer> secondaryWeapon;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(minrange) && Is.is.within(minrange, 1, Constants.MAX_SELECTION_RANGE), errors, "minrange");
    checkExpression(Is.is.integer(maxrange) && Is.is.within(maxrange, minrange + 1, Constants.MAX_SELECTION_RANGE), errors, "maxrange");
    checkDamageMap(mainWeapon, "mainWeapon", errors);
    checkDamageMap(secondaryWeapon, "secondaryWeapon", errors);
  }

  private void checkDamageMap(Object damageMap, String errorItemName, Array<String> errors) {
    JsUtil.forEachObjectValue(damageMap, (typeId, damage) -> {
      checkExpression(Is.is.string(typeId), errors, errorItemName + " key");
      // TODO check item key
        checkExpression(Is.is.integer((Number) damage) && Is.is.within((Number) damage, 0, 999), errors, errorItemName + " entry");
      });
  }
}
