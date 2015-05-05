package org.wolftec.cwtactics.gameold.domain.types;

import org.stjs.javascript.Map;
import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.wCore.validation.DataObject;
import org.wolftec.wCore.validation.validators.IntValue;
import org.wolftec.wCore.validation.validators.StringKey;

@DataObject
public class AttackType {

  @IntValue(min = 1, max = EngineGlobals.MAX_SELECTION_RANGE, defaultValue = 1)
  public Integer minrange;

  @IntValue(min = 2, max = EngineGlobals.MAX_SELECTION_RANGE, defaultValue = 1)
  public Integer maxrange;

  @StringKey(minLength = 4, maxLength = 4)
  @IntValue(min = 0, max = 999)
  public Map<String, Integer> mainWeapon;

  @StringKey(minLength = 4, maxLength = 4)
  @IntValue(min = 0, max = 999)
  public Map<String, Integer> secondaryWeapon;
}
