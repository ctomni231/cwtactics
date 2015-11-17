package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.actions.core.ActionData;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitTransferAction extends AbstractAction {

  private final GameroundChangeVisionAction changeVision;

  public UnitTransferAction(GameroundChangeVisionAction changeVision) {
    this.changeVision = changeVision;
  }

  @Override
  public String key() {
    return "transferUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    return !controller.ui.source.unit.transport.hasLoads() && controller.ui.movePath.isEmpty();
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

      Player player = model.battlefield.players.getPlayer(i);
      if (!controller.ui.actor.isInactive() && controller.ui.actor.numberOfUnits < Constants.MAX_UNITS) {
        controller.ui.addInfo(i + "", true);
      }
    }
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
    controller.data.p2 = controller.ui.actionDataCode;
  }

  @Override
  public void checkData(ModelData model, ActionData data) {
    AssertUtil.assertThat(model.battlefield.units.isValidUnitId(data.p1), "");
    AssertUtil.assertThat(model.battlefield.players.isValidPlayerId(data.p2), "");
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Unit unit = model.battlefield.units.getUnit(controller.data.p1);
    Player player = model.battlefield.players.getPlayer(controller.data.p2);
    Player origPlayer = unit.owners.getOwner();

    AssertUtil.assertThat(origPlayer.numberOfUnits > 0);
    AssertUtil.assertThat(player.numberOfUnits < Constants.MAX_UNITS);

    origPlayer.numberOfUnits--;
    unit.owners.setOwner(player);
    player.numberOfUnits++;

    // remove vision when unit transfers to an enemy team
    if (origPlayer.team != player.team) {
      model.battlefield.units.searchUnit(unit, (cx, cy, cunit) -> {

        controller.data.p1 = cx;
        controller.data.p2 = cy;
        controller.data.p3 = unit.type.vision;

        // TODO this makes no sense because I only loose vision or not ?!? from
        // client side wise yes -> model wise no

        controller.data.p4 = -1;
        controller.data.p5 = origPlayer.id;
        changeVision.evaluateByData(model, controller);

        controller.data.p4 = +1;
        controller.data.p5 = cunit.owners.getOwner().id;
        changeVision.evaluateByData(model, controller);
      });
    }
  }

}
