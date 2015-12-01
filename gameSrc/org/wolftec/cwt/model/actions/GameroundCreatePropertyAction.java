package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.SheetIdNumberUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;

public class GameroundCreatePropertyAction extends AbstractAction {

  private final GameroundChangeVisionAction changeVision;

  public GameroundCreatePropertyAction(GameroundChangeVisionAction changeVision) {
    this.changeVision = changeVision;
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    Player player = model.battlefield.players.getPlayer(controller.data.p3);
    String type = SheetIdNumberUtil.convertNumberToId(controller.data.p4);

    Tile tile = model.battlefield.map.getTile(x, y);
    Property prop = model.battlefield.properties.getInactiveProperty();
    prop.owners.setOwner(player);
    prop.type = model.typeDB.properties.get(type);
    tile.property = prop;
    player.numberOfProperties++;

    controller.data.p1 = x;
    controller.data.p2 = y;
    controller.data.p3 = prop.type.vision;
    controller.data.p4 = 1;
    changeVision.evaluateByData(model, controller);
  }

}
