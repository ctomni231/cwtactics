package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean
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
    if (source.getType() != target.getType()) {
      return false;
    }

    // don't increase HP to more then 10
    if (target.getHp() >= 90) {
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
      throw new Error("IllegalArgumentType(s)");
    }

    Unit target = gameround.getMap().getTile(x, y).unit;
    if (source.getType() != target.getType()) {
      throw new Error("IncompatibleJoinTypes");
    }

    // health points
    lifecycle.healUnit(target, Unit.pointsToHealth(Unit.healthToPoints(source.getHp())), true);

    // ammo
    target.setAmmo(source.getAmmo());
    if (target.getAmmo() > target.getType().ammo) {
      target.setAmmo(target.getType().ammo);
    }

    // fuel
    target.setFuel(source.getFuel());
    if (target.getFuel() > target.getType().fuel) {
      target.setFuel(target.getType().fuel);
    }

    // TODO experience points

    // TODO use correct action here
    lifecycle.destroyUnit(x, y, true);
  }
}
