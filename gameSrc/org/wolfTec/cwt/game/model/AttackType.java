package org.wolfTec.cwt.game.model;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolfTec.cwt.game.Constants;
import org.wolfTec.cwt.utility.MaxValue;
import org.wolfTec.cwt.utility.MinValue;

public class AttackType {

  @MinValue(1) @MaxValue(Constants.MAX_SELECTION_RANGE) public Integer minrange;
  @MinValue(2) @MaxValue(Constants.MAX_SELECTION_RANGE) public Integer maxrange;
  public Map<String, Integer> mainWeapon;
  public Map<String, Integer> secondaryWeapon;

  public AttackType() {
    mainWeapon = JSCollections.$map();
    secondaryWeapon = JSCollections.$map();
  }
}
