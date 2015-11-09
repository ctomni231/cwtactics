package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.util.AssertUtil;

public class JoinLogic implements ManagedClass {

  private ModelManager model;
  private TransportLogic transport;
  private LifecycleLogic lifecycle;

  //
  // Returns **true** if two units can join each other, else **false**. In
  // general both **source** and **target** has
  // to be units of the same type and the target must have 9 or less health
  // points. Transporters cannot join each
  // other when they contain loaded units.
  //
  public boolean canJoin(Unit source, Unit target) {

    if (source.type != target.type) {
      return false;
    }

    // don't increase HP to more then 10
    if (target.hp >= 90) {
      return false;
    }

    // do they have loads?
    if (transport.hasLoads(source) || transport.hasLoads(target)) return false;

    return true;
  }

  /**
   * Joins two units together. If the combined health is greater than the
   * maximum health then the difference will be payed to the owners resource
   * depot.
   *
   * @param source
   * @param x
   * @param y
   */
  public void join(Unit source, int x, int y) {
    Unit target = model.getTile(x, y).unit;
    AssertUtil.assertThat(target.type == source.type);

    target.heal(Unit.pointsToHealth(Unit.healthToPoints(source.hp)), true);
    if (target.type.ammo != Constants.INACTIVE) {
      target.ammo = Math.max(target.ammo + source.ammo, target.type.ammo);
    }
    target.fuel = Math.max(target.fuel + source.fuel, target.type.fuel);
    target.exp += source.exp;

    model.searchUnit(source, (ux, uy, unit) -> lifecycle.destroyUnit(ux, uy));
  }
}
