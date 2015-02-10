package org.wolfTec.cwt.game.model;

import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.utility.validation.IntValue;
import org.wolfTec.cwt.utility.validation.StringKey;

public class AttackType {

  @IntValue(min = 1, max = Constants.MAX_SELECTION_RANGE) public Integer minrange;
  @IntValue(min = 2, max = Constants.MAX_SELECTION_RANGE) public Integer maxrange;

  @StringKey(minLength = 4, maxLength = 4) 
  @IntValue(min = 0, max = 999) 
  public Map<String, Integer> mainWeapon;
  
  @StringKey(minLength = 4, maxLength = 4) 
  @IntValue(min = 0, max = 999) 
  public Map<String, Integer> secondaryWeapon;
}
