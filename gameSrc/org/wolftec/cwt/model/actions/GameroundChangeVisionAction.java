package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.TileMap;
import org.wolftec.cwt.model.tags.TagValue;

public class GameroundChangeVisionAction extends AbstractAction {

  // TODO
  private final TagValue cfgEnabled;

  public GameroundChangeVisionAction() {
    cfgEnabled = new TagValue("game.fog.enabled", 0, 1, 1);
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.target.x;
    controller.data.p2 = controller.ui.target.y;

    // TODO property
    controller.data.p3 = controller.ui.target.unit.type.vision;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    int range = controller.data.p3;
    int change = controller.data.p4;
    Player owner = model.battlefield.players.getPlayer(controller.data.p5);
    TileMap map = model.battlefield.map;

    // ignore neutral objects
    if (owner.isInactive()) {
      return;
    }

    if (cfgEnabled.value == 0) {
      return;
    }

    boolean clientVisible = owner.clientVisible;
    boolean turnOwnerVisible = owner.turnOwnerVisible;

    // no active player owns this vision
    if (!clientVisible && !turnOwnerVisible) {
      return;
    }

    if (range == 0) {
      Tile tile = map.getTile(x, y);
      if (clientVisible) tile.data.visionClient += change;
      if (turnOwnerVisible) tile.data.visionTurnOwner += change;

    } else {
      int mW = map.mapWidth;
      int mH = map.mapHeight;
      int lX;
      int hX;
      int lY = y - range;
      int hY = y + range;

      if (lY < 0) lY = 0;
      if (hY >= mH) hY = mH - 1;
      for (; lY <= hY; lY++) {

        int disY = Math.abs(lY - y);
        lX = x - range + disY;
        hX = x + range - disY;
        if (lX < 0) lX = 0;
        if (hX >= mW) hX = mW - 1;
        for (; lX <= hX; lX++) {

          // does the tile block vision ?
          Tile tile = map.getTile(lX, lY);

          if (tile.type.visionBlocker && TileMap.getDistance(x, y, lX, lY) > 1) {
            continue;
          }

          if (clientVisible) tile.data.visionClient += change;
          if (turnOwnerVisible) tile.data.visionTurnOwner += change;
        }
      }
    }
  }

}
