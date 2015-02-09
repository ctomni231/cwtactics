package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.Game;
import org.wolfTec.cwt.game.model.GameMapBean;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.PropertyType;
import org.wolfTec.cwt.game.model.Unit;

public interface SpecialWeaponsLogic extends BaseLogic, LifecycleLogic {

  /**
   * Returns **true** when the given **unit** is the mechanical laser trigger,
   * else **false**.
   *
   * @return
   */
  default boolean isLaser(Unit unit) {
    return (unit.getType().ID == Game.LASER_UNIT_INV);
  }

  /**
   * Returns **true** if a given **unit** is a cannon trigger unit, else
   * **false**.
   *
   * @return
   */
  default boolean isCannonUnit(Unit unit) {
    return (unit.getType().ID == Game.CANNON_UNIT_INV);
  }

  /**
   * Returns true if a property id is a rocket silo. A rocket silo has the
   * ability to fire a rocket to a position with an impact.
   *
   * @return
   */
  default boolean isRocketSilo(Property prop) {
    return (prop.type.rocketsilo != JSGlobal.undefined); // TODO: null replace
                                                         // possible
  }

  default void fireLaser(int x, int y) {
    GameRoundBean gameround = getGameRound();
    GameMapBean map = gameround.getMap();
    Property prop = map.getTile(x, y).property;

    int xe, ye;
    int ox = x;
    int oy = y;
    int savedTeam = prop.owner.team;
    int damage = Unit.pointsToHealth(prop.type.laser.damage);

    // every tile on the cross ( same y or x coordinate ) will be damaged
    for (x = 0, xe = gameround.getMapWidth(); x < xe; x++) {
      boolean doIt = false;

      if (x == ox) {
        for (y = 0, ye = gameround.getMapHeight(); y < ye; y++) {
          if (oy != y) {
            Unit unit = map.getTile(x, y).unit;
            if (unit != null && unit.getOwner().team != savedTeam) {
              damageUnit(unit, damage, 9);
            }
          }
        }
      } else {
        Unit unit = map.getTile(x, y).unit;
        if (unit != null && unit.getOwner().team != savedTeam) {
          damageUnit(unit, damage, 9);
        }
      }
    }
  }

  default boolean canBeFiredBy(Property property, Unit unit) {
    return property.type.rocketsilo.fireable.indexOf(unit.getType().ID) > -1;
  }

  default boolean canBeFiredTo(Property property, int x, int y) {
    return getGameRound().isValidPosition(x, y);
  }
  
  /*
   * // inline function
var doDamage = function (x, y, tile, damage) {
    var unit = tile.unit;
    if (unit) {
        unit.takeDamage(damage, 9);
    }
};
   */

  /**
   * Fires a rocket from a given rocket silo at position (**x**,**y**) to a
   * given target position (**tx**,**ty**) and inflicts damage to all units in
   * the range of the explosion. The health of the units will be never lower as
   * 9 health after the explosion.
   * 
   * @param x
   * @param y
   * @param tx
   * @param ty
   */
  default void fireSilo(int x, int y, int tx, int ty) {
    // TODO move get logic into gameround -> map will be composite element of game round
    Property silo = getGameRound().getMap().getTile(x, y).property;

    PropertyType type = silo.type;
    silo.type = getObjectTypes().getPropertyType(type.changesTo);

    int damage = Unit.pointsToHealth(type.rocketsilo.damage);
    int range = type.rocketsilo.range;

    model.doInRange(tx, ty, range, doDamage, damage);
  };
}