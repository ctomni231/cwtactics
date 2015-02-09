package net.wolfTec.cwt.model;

import net.wolfTec.cwt.Constants;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolfTec.utility.MaxValue;
import org.wolfTec.utility.MinValue;

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
