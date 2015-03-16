package org.wolftec.cwtactics.game.logic;

import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.cwtactics.game.model.GameRoundBean;
import org.wolftec.cwtactics.game.model.Unit;

@ManagedComponent
public class JoinLogic {

  @Injected
  private TransportLogic transport;

  @Injected
  private LifecycleLogic lifecycle;

  @Injected
  private GameRoundBean gameround;

  /**
   * Returns **true** if two units can join each other, else **false**. In
   * general both **source** and **target** has to be units of the same type and
   * the target must have 9 or less health points. Transporters cannot join each
   * other when they contain loaded units.
   *
   * @param source
   * @param target
   * @returns {boolean}
   */
  public boolean canJoin(Unit source, Unit target) {
    if (source.type != target.type) {
      return false;
    }

    // don't increase HP to more then 10
    if (target.hp >= 90) {
      return false;
    }

    // do they have loads?
    if (transport.hasLoads(source) || transport.hasLoads(target)) {
      return false;
    }

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
    if (!gameround.isValidPosition(x, y)) {
      JsUtil.raiseError("IllegalArgumentType(s)");
    }

    Unit target = gameround.getTile(x, y).unit;
    
    if (source.type != target.type) {
      JsUtil.raiseError("IncompatibleJoinTypes");
    }

    // health points
    lifecycle.healUnit(target, Unit.pointsToHealth(Unit.healthToPoints(source.hp)), true);

    // ammo
    target.ammo = source.ammo;
    if (target.ammo > target.type.ammo) {
      target.ammo = target.type.ammo;
    }

    // fuel
    target.fuel = source.fuel;
    if (target.fuel > target.type.fuel) {
      target.fuel = target.type.fuel;
    }

    // TODO experience points

    // TODO use correct action here
    lifecycle.destroyUnit(x, y, true);
  }
}
