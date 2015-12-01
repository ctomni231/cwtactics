package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;

public class GameroundRemovePlayerPropertiesAction extends AbstractAction {

  private final GameroundRemovePropertyOwnerAction removePropOwner;

  public GameroundRemovePlayerPropertiesAction(GameroundRemovePropertyOwnerAction removePropOwner) {
    this.removePropOwner = removePropOwner;
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Player player = model.battlefield.players.getPlayer(controller.data.p1);
    model.battlefield.properties.forEachProperty((propId, prop) -> {
      if (prop.owners.getOwner() == player) {

        controller.data.p1 = propId;
        removePropOwner.evaluateByData(model, controller);
      }
    });
  }

}
