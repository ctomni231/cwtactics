package net.temp.cwt.game.gamemodel.model;

import net.temp.EngineGlobals;

import org.stjs.javascript.Map;
import org.wolftec.validation.annotation.IntValue;
import org.wolftec.validation.annotation.StringKey;

public class AttackType {

  @IntValue(min = 1, max = EngineGlobals.MAX_SELECTION_RANGE)
  public Integer minrange;
  @IntValue(min = 2, max = EngineGlobals.MAX_SELECTION_RANGE)
  public Integer maxrange;

  @StringKey(minLength = 4, maxLength = 4)
  @IntValue(min = 0, max = 999)
  public Map<String, Integer> mainWeapon;

  @StringKey(minLength = 4, maxLength = 4)
  @IntValue(min = 0, max = 999)
  public Map<String, Integer> secondaryWeapon;
}
