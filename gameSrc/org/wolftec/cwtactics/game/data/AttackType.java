package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.ischeck.Is;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class AttackType extends ObjectType {

  public Integer minrange;
  public Integer maxrange;
  public Map<String, Integer> mainWeapon;
  public Map<String, Integer> secondaryWeapon;

  @Override
  protected void validateData(Array<String> errors) {
    checkExpression(Is.is.integer(minrange) && Is.is.within(minrange, 0, Constants.MAX_SELECTION_RANGE + 1), errors, "minrange");
    checkExpression(Is.is.integer(maxrange) && Is.is.within(maxrange, minrange - 1, Constants.MAX_SELECTION_RANGE + 1), errors, "maxrange");
    checkDamageMap(mainWeapon, "mainWeapon", errors);
    checkDamageMap(secondaryWeapon, "secondaryWeapon", errors);
  }

  private void checkDamageMap(Object damageMap, String errorItemName, Array<String> errors) {
    JsUtil.forEachObjectValue(damageMap, (typeId, damage) -> {
      checkExpression(Is.is.string(typeId), errors, errorItemName + " key");
      // TODO check item key
        checkExpression(Is.is.integer((Number) damage) && Is.is.within((Number) damage, 0, 1000), errors, errorItemName + " entry");
      });
  }

  @Override
  public void grabDataFromMap(Map<String, Object> data) {
    minrange = grabMapValue(data, "minrange", 1);
    maxrange = grabMapValue(data, "maxrange", 1);
    mainWeapon = grabMapValue(data, "mainWeapon", JSCollections.$map());
    secondaryWeapon = grabMapValue(data, "secondaryWeapon", JSCollections.$map());
  }
}
