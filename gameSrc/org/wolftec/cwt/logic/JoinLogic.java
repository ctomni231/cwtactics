package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;

public class JoinLogic implements Injectable {

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
    if (target.type != source.type) {
      JsUtil.throwError("TypeMismatch");
    }

    // hp
    target.heal(Unit.pointsToHealth(Unit.healthToPoints(source.hp)), true);

    // ammo
    if (target.type.ammo != Constants.INACTIVE) {
      target.ammo += source.ammo;
      if (target.ammo > target.type.ammo) {
        target.ammo = target.type.ammo;
      }
    }

    // fuel
    target.fuel += source.fuel;
    if (target.fuel > target.type.fuel) {
      target.fuel = target.type.fuel;
    }

    // TODO experience points
    model.searchUnit(source, (ux, uy, unit) -> lifecycle.destroyUnit(ux, uy, true));
  }
}
