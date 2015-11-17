package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.TileMap;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.tags.TagValue;

public class GameroundRecalcVisionAction extends AbstractAction {

  private final GameroundChangeVisionAction changeVision;

  private final TagValue cfgEnabled;

  public GameroundRecalcVisionAction(GameroundChangeVisionAction addVision) {
    this.changeVision = addVision;
    cfgEnabled = new TagValue("game.fog.enabled", 0, 1, 1);
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    TileMap tilemap = model.battlefield.map;
    int x;
    int y;
    int xe = tilemap.mapWidth;
    int ye = tilemap.mapHeight;
    boolean fogEnabled = (cfgEnabled.value == 1);

    // 1. reset fog maps
    for (x = 0; x < xe; x++) {
      for (y = 0; y < ye; y++) {
        Tile tile = tilemap.getTile(x, y);

        if (!fogEnabled) {
          tile.visionTurnOwner = 1;
          tile.visionClient = 1;
        } else {
          tile.visionTurnOwner = 0;
          tile.visionClient = 0;
        }
      }
    }

    // 2. add vision-object
    if (fogEnabled) {
      int vision;
      Unit unit;
      Tile tile;
      Property property;

      for (x = 0; x < xe; x++) {
        for (y = 0; y < ye; y++) {
          tile = tilemap.getTile(x, y);

          unit = tile.unit;
          if (unit != null) {
            vision = unit.type.vision;
            if (vision < 0) vision = 0;

            addVision(model, controller, x, y, vision);
          }

          property = tile.property;
          if (property != null && !property.owners.isNeutral()) {
            vision = property.type.vision;
            if (vision < 0) vision = 0;

            addVision(model, controller, x, y, vision);
          }
        }
      }
    }
  }

  private void addVision(ModelData model, ControllerData controller, int x, int y, int vision) {
    controller.data.p1 = x;
    controller.data.p2 = y;
    controller.data.p3 = vision;
    controller.data.p4 = 1;
    controller.data.p5 = controller.ui.actor.id;
    changeVision.evaluateByData(model, controller);
  }

}
