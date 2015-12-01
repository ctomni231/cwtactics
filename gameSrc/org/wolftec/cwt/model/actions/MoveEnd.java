package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.MoveMeta;
import org.wolftec.cwt.model.actions.MoveStart.MoveActionData;
import org.wolftec.cwt.model.gameround.Unit;

public class MoveEnd extends AbstractAction {

  private MoveLogic move;
  private GameroundEnder model;
  private MoveActionData moveDto;

  @Override
  public String key() {
    return "moveEnd";
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = (controller.ui.getAction().positionUpdateMode() == MoveMeta.PREVENT_CLEAR_OLD_POS ? 1 : 0);
    controller.data.p2 = (controller.ui.getAction().positionUpdateMode() == MoveMeta.PREVENT_SET_NEW_POS ? 1 : 0);
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    boolean preventRemoveOldPos = controller.data.p1 == 1;
    boolean preventSetNewPos = controller.data.p2 == 1;
    Unit unit = model.battlefield.units.getUnit(moveDto.unitId);

    if (preventRemoveOldPos != true) {
      fog.removeUnitVision(x, y, unit.owners.getOwner());
    }

    move.move(unit, moveDto.x, moveDto.y, moveDto.movePath, false, preventRemoveOldPos, preventSetNewPos);

    if (!preventSetNewPos) {
      fog.addUnitVision(lastX, lastY, unit.owners.getOwner());
    }

    // reset variables
    moveDto.unitId = Constants.INACTIVE;
    moveDto.x = Constants.INACTIVE;
    moveDto.y = Constants.INACTIVE;
  }

}
