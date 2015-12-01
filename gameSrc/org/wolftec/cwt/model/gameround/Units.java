package org.wolftec.cwt.model.gameround;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.JsUtil;

public class Units {

  /**
   * All unit objects of a game round. This buffer holds the maximum amount of
   * possible unit objects. Inactive ones are marked by no reference in the map
   * and with an owner value **null**.
   */
  private Array<Unit> units;

  public Units() {
    units = ListUtil.instanceList(Unit.class, Constants.MAX_PLAYER * Constants.MAX_UNITS);
  }

  public Unit getUnit(int id) {
    AssertUtil.assertThatNot(id < 0 || id > units.$length());
    return units.$get(id);
  }

  /**
   * 
   * @param unit
   * @return id of the unit in this unit set or -1 if the unit does not belongs
   *         to this unit set
   */
  public int getUnitId(Unit unit) {
    return units.indexOf(unit);
  }

  public boolean isValidUnitId(int id) {
    return (id >= 0 && id < units.$length());
  }

  public void forEachUnit(Callback2<Integer, Unit> cb) {
    for (int i = 0; i < units.$length(); i++) {
      cb.$invoke(i, units.$get(i));
    }
  }

  public int unitsWithStatus(Function1<Unit, Boolean> cb) {
    int result = 0;
    for (int i = 0; i < units.$length(); i++) {
      if (cb.$invoke(units.$get(i))) {
        result++;
      }
    }
    return result;
  }

  public boolean hasFreeUnitSlotLeft(Player player) {
    // sematically wrong here
    return player.numberOfUnits < Constants.MAX_UNITS;
  }

  public void releaseUnit(Unit unit) {
    AssertUtil.assertThat(getUnitId(unit) != -1);
    unit.owners.setOwner(null);
  }

  public Unit acquireUnit() {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {
      if (getUnit(i).owners.isNeutral()) {
        return getUnit(i);
      }
    }
    return JsUtil.throwError("no free unit left");
  }
}
