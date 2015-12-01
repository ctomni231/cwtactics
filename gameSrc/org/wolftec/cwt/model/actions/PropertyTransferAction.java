package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.ActionData;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;

public class PropertyTransferAction extends AbstractAction {

  private final GameroundChangeVisionAction visionChange;

  public PropertyTransferAction(GameroundChangeVisionAction visionChange) {
    this.visionChange = visionChange;
  }

  @Override
  public String key() {
    return "transferProperty";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Property property = controller.ui.source.property;
    return property.type.notTransferable != true && property.owners.getOwner().gold >= property.type.funds;
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(ModelData model, ControllerData controller) {
    int origI = controller.ui.actor.id;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      if (i == origI) {
        continue;
      }

      if (!controller.ui.actor.isInactive()) {
        controller.ui.addInfo(i + "", true);
      }
    }
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.x;
    controller.data.p2 = controller.ui.source.y;
    controller.data.p3 = controller.ui.actionDataCode;
  }

  @Override
  public void checkData(ModelData model, ActionData data) {
    AssertUtil.assertThat(model.battlefield.players.isValidPlayerId(data.p2));
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    Property property = model.battlefield.map.getTile(x, y).property;
    Player player = model.battlefield.players.getPlayer(controller.data.p3);

    AssertUtil.assertThat(property.owners.getOwner() != player);

    Player origPlayer = property.owners.getOwner();
    property.owners.setOwner(player);

    // remove received from the property to prevent money cheating by sharing
    // the properties among a team

    origPlayer.gold -= property.type.funds;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {

      // FIXME
      visionChange.evaluateByData(model, controller);
      // fog.removePropertyVision(x, cy, origPlayer);

      visionChange.evaluateByData(model, controller);
      // fog.addPropertyVision(cx, cy, cproperty.owner);
    }
  }

}
