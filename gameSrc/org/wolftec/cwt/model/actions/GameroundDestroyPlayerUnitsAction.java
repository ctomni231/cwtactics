package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.TileMap;

public class GameroundDestroyPlayerUnitsAction extends AbstractAction {

  private final GameroundDestroyUnitAction destroyUnit;

  public GameroundDestroyPlayerUnitsAction(GameroundDestroyUnitAction destroyUnit) {
    this.destroyUnit = destroyUnit;
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    TileMap map = model.battlefield.map;
    Player player = model.battlefield.players.getPlayer(controller.data.p1);

    for (int x = 0, xe = map.mapWidth; x < xe; x++) {
      for (int y = 0, ye = map.mapHeight; y < ye; y++) {
        Tile tile = map.getTile(x, y);

        if (tile.unit == null) {
          continue;
        }

        if (tile.unit.owners.getOwner() == player) {

          controller.data.p1 = controller.ui.source.x;
          controller.data.p2 = controller.ui.source.y;
          destroyUnit.evaluateByData(model, controller);
        }
      }
    }
  }

}
