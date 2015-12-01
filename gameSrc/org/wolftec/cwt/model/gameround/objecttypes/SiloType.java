package org.wolftec.cwt.model.gameround.objecttypes;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class SiloType extends SheetType {
  public Array<String> fireable;
  public String changeTo;
  public int damage;
  public int range;

  public SiloType() {
    fireable = JSCollections.$array();
  }

  public boolean fireableContains(String id) {
    return fireable.indexOf(id) > -1;
  }

  public String getChangeTo() {
    return changeTo;
  }

  public int getDamage() {
    return damage;
  }

  public boolean inflictsDamage() {
    return damage > 0;
  }

  public int getRange() {
    return range;
  }
}
