package org.wolfTec.cwt.game.gamelogic;

import org.wolfTec.cwt.game.model.Unit;

public interface JoinLogic extends TransportLogic, LifecycleLogic {

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
  default boolean canJoin(Unit source, Unit target) {
    if (source.getType() != target.getType()) {
      return false;
    }

    // don't increase HP to more then 10
    if (target.getHp() >= 90) {
      return false;
    }

    // do they have loads?
    if (hasLoads(source) || hasLoads(target)) {
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
  default void join(Unit source, int x, int y) {
    if (!getGameRound().isValidPosition(x, y)) {
      throw new Error("IllegalArgumentType(s)");
    }

    Unit target = getGameRound().getMap().getTile(x, y).unit;
    if (source.getType() != target.getType()) {
      throw new Error("IncompatibleJoinTypes");
    }

    // health points
    healUnit(target, Unit.pointsToHealth(Unit.healthToPoints(source.getHp())), true);

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
    cwt.Lifecycle.destroyUnit(x, y, true);
  }
}
