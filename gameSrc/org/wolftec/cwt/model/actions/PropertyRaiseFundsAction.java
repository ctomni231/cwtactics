package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;

public class PropertyRaiseFundsAction extends AbstractAction {

  @Override
  public String key() {
    return "raiseFunds";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_PROPERTY_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Tile tile = model.battlefield.map.getTile(controller.ui.source.x, controller.ui.source.y);
    Property prop = tile.property;

    return prop.type.funds > 0;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.x;
    controller.data.p2 = controller.ui.source.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    Tile tile = model.battlefield.map.getTile(x, y);
    Property prop = tile.property;

    prop.owners.getOwner().earnMoney(prop.type.funds);
  }
}
