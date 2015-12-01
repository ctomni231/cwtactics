package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.TileMap;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitFireLaserAction extends AbstractAction {

  @Override
  public String key() {
    return "fireLaser";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    return controller.ui.source.unit.type.laser.damage > 0;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.target.x;
    controller.data.p2 = controller.ui.target.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int ox = controller.data.p1;
    int oy = controller.data.p2;
    TileMap map = model.battlefield.map;
    Unit laser = map.getTile(ox, oy).unit;
    int savedTeam = laser.owners.getOwner().team;
    int damage = laser.type.laser.damage;

    // every tile on the cross ( same y or x coordinate ) will be damaged
    for (int x = 0, xe = map.mapWidth; x < xe; x++) {

      if (x == ox) {
        for (int y = 0, ye = map.mapHeight; y < ye; y++) {
          if (oy != y) {
            Unit unit = map.getTile(x, y).unit;
            if (unit != null && unit.owners.getOwner().team != savedTeam) {
              unit.live.damagePoints(damage, 9);
            }
          }
        }
      } else {
        Unit unit = map.getTile(x, oy).unit;
        if (unit != null && unit.owners.getOwner().team != savedTeam) {
          unit.live.damage(damage, 9);
        }
      }
    }
  }

}
