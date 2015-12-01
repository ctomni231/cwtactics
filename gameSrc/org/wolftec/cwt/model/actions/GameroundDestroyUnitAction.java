package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.tags.Tags;
import org.wolftec.cwt.model.tags.TagValue;

public class GameroundDestroyUnitAction extends AbstractAction {

  private final GameroundChangeVisionAction changeVision;
  private final GameroundDestroyPlayerAction destroyPlayer;

  private final TagValue cfgNoUnitsLeftLoose;

  public GameroundDestroyUnitAction(Tags cfg, GameroundChangeVisionAction changeVision, GameroundDestroyPlayerAction destroyPlayer) {
    this.changeVision = changeVision;
    this.destroyPlayer = destroyPlayer;
    this.cfgNoUnitsLeftLoose = cfg.registerConfig("game.loose.whenNoUnitsLeft", 0, 1, 1, 1);
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.x;
    controller.data.p2 = controller.ui.source.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.ui.source.x;
    int y = controller.ui.source.y;

    Tile tile = model.battlefield.map.getTile(x, y);

    controller.data.p1 = controller.data.p3;
    controller.data.p2 = controller.data.p4;
    controller.data.p3 = tile.unit.type.vision;
    controller.data.p4 = -1;
    changeVision.evaluateByData(model, controller);

    Player owner = tile.unit.owners.getOwner();
    owner.numberOfUnits--;

    /* get rid of all loaded units too */
    int unitId = model.battlefield.units.getUnitId(tile.unit);
    model.battlefield.units.forEachUnit((id, unit) -> {
      if (unit.transport.loadedIn == unitId) {
        model.battlefield.units.releaseUnit(unit);
      }
    });

    model.battlefield.units.releaseUnit(tile.unit);
    tile.unit = null;

    if (cfgNoUnitsLeftLoose.value == 1 && owner.numberOfUnits == 0) {

      controller.data.p1 = owner.id;
      destroyPlayer.evaluateByData(model, controller);
    }
  }

}
