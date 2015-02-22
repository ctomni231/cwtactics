package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.GameMapBean;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Property;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.cwt.game.model.types.ObjectTypesBean;
import org.wolfTec.cwt.game.model.types.PropertyType;
import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.beans.Injected;

@Bean
public class SpecialWeaponsLogic {

  @Injected
  private GameRoundBean gameround;
  
  @Injected
  private ObjectTypesBean types;
  
  @Injected
  private LifecycleLogic lifecycle;

  /**
   * Returns **true** when the given **unit** is the mechanical laser trigger,
   * else **false**.
   *
   * @return
   */
  public boolean isLaser(Unit unit) {
    return (unit.type.ID == EngineGlobals.LASER_UNIT_INV);
  }

  /**
   * Returns **true** if a given **unit** is a cannon trigger unit, else
   * **false**.
   *
   * @return
   */
  public boolean isCannonUnit(Unit unit) {
    return (unit.type.ID == EngineGlobals.CANNON_UNIT_INV);
  }

  /**
   * Returns true if a property id is a rocket silo. A rocket silo has the
   * ability to fire a rocket to a position with an impact.
   *
   * @return
   */
  public boolean isRocketSilo(Property prop) {
    return (prop.type.rocketsilo != JSGlobal.undefined); // TODO: null replace
                                                         // possible
  }

  public void fireLaser(int x, int y) {
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
            if (unit != null && unit.owner.team != savedTeam) {
              lifecycle.damageUnit(unit, damage, 9);
            }
          }
        }
      } else {
        Unit unit = map.getTile(x, y).unit;
        if (unit != null && unit.owner.team != savedTeam) {
          lifecycle.damageUnit(unit, damage, 9);
        }
      }
    }
  }

  public boolean canBeFiredBy(Property property, Unit unit) {
    return property.type.rocketsilo.fireable.indexOf(unit.type.ID) > -1;
  }

  public boolean canBeFiredTo(Property property, int x, int y) {
    return gameround.isValidPosition(x, y);
  }

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
  public void fireSilo(int x, int y, int tx, int ty) {
    // TODO move get logic into gameround -> map will be composite element of
    // game round
    Property silo = gameround.getMap().getTile(x, y).property;

    PropertyType type = silo.type;
    silo.type = types.getPropertyType(type.changesTo);

    int damage = Unit.pointsToHealth(type.rocketsilo.damage);
    int range = type.rocketsilo.range;

    gameround.doInRange(tx, ty, range, this::doDamage, damage);
  }

  /**
   * Returns **true** if the **unit** is capable to self destruct.
   *
   * @param unit
   * @returns {boolean}
   */
  public boolean canSelfDestruct(Unit unit) {
    return unit.type.suicide != null;
  }

  /**
   * Returns the **health** that will be damaged by an explosion of the exploder
   * **unit**.
   *
   * @param unit
   * @returns {number}
   */
  public int getExplosionDamage(Unit unit) {
    return Unit.pointsToHealth(unit.type.suicide.damage);
  }

  private boolean doDamage(int x, int y, int range, Tile tile, Object damage) {
    if (tile.unit != null) {

      // TODO use command from attack here
      lifecycle.damageUnit(tile.unit, (int) damage, 9);
    }
    return true;
  }

  // TODO: silo should use this for the impact

  /**
   * Invokes an explosion with a given **range** at position (**x**,**y**). All
   * units in the **range** will be damaged by the value **damage**. The health
   * of an unit in range will never be lower than 9 health after the explosion
   * (means it will have 1HP left).
   *
   * @param {number} x
   * @param {number} y
   * @param {number} range
   * @param {number} damage
   */
  public void explode(int x, int y, int range, int damage) {
    if (!gameround.isValidPosition(x, y)) {
      throw new Error("IllegalArgumentType(s)");
    }

    Tile tile = gameround.getMap().getTile(x, y);
    if (!canSelfDestruct(tile.unit) || range < 1 || damage < 1) {
      throw new Error("IllegalArgumentType(s)");
    }

    // TODO use command from attack here
    lifecycle.destroyUnit(x, y, false);

    gameround.doInRange(x, y, range, this::doDamage, damage);
  }
}