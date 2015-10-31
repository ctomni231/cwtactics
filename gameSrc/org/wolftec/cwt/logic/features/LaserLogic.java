package org.wolftec.cwt.logic.features;

import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.system.ManagedClass;

public class LaserLogic implements ManagedClass {

  public static final String LASER_UNIT_ID = "LASU";

  private ModelManager model;

  // Returns **true** when the given **unit** is the mechanical laser trigger,
  // else **false**.
  //
  public boolean isLaser(Unit unit) {
    return unit.type.laser.damage > 0;
  }

  // Fires a laser at a given position (**x**,**y**).
  //
  public void fireLaser(int ox, int oy) {
    Unit laser = model.getTile(ox, oy).unit;
    int savedTeam = laser.owner.team;
    int damage = Unit.pointsToHealth(laser.type.laser.damage);

    // every tile on the cross ( same y or x coordinate ) will be damaged
    for (int x = 0, xe = model.mapWidth; x < xe; x++) {

      if (x == ox) {
        for (int y = 0, ye = model.mapHeight; y < ye; y++) {
          if (oy != y) {
            Unit unit = model.getTile(x, y).unit;
            if (unit != null && unit.owner.team != savedTeam) {
              unit.takeDamage(damage, 9);
            }
          }
        }
      } else {
        Unit unit = model.getTile(x, oy).unit;
        if (unit != null && unit.owner.team != savedTeam) {
          unit.takeDamage(damage, 9);
        }
      }
    }
  }
}
