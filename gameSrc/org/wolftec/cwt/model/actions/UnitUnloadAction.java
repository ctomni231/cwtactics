package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.collection.RingList;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.TargetSelectionMode;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.gameround.objecttypes.MoveType;

public class UnitUnloadAction extends AbstractAction {

  private final RingList<Integer> unloadMovepath;
  private final MoveEnd move;

  public UnitUnloadAction(MoveEnd pMove) {
    unloadMovepath = new RingList<>(1);
    move = pMove;
  }

  @Override
  public String key() {
    return "unloadUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public boolean multiStepAction() {
    return true;
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public TargetSelectionMode targetSelectionType() {
    return TargetSelectionMode.B;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Unit transporter = controller.ui.source.unit;
    int transporterId = controller.ui.source.unitId;

    if (transporter.type.maxloads == 0) {
      return false;
    }

    int loads = model.battlefield.units.unitsWithStatus(u -> u.transport.loadedIn == transporterId);

    if (loads == 0) {
      return false;
    }

    int x = controller.ui.target.x;
    int y = controller.ui.target.y;
    int pid = transporter.owners.getOwner().id;
    model.battlefield.units.forEachUnit((unitId, unit) -> {
      if (unit.transport.loadedIn == transporterId) {
        MoveType moveType = model.typeDB.movetypes.get(unit.type.movetype);

        if (model.battlefield.map.isValidPosition(x - 1, y) && move.canTypeMoveTo(moveType, x - 1, y)) return true;
        if (model.battlefield.map.isValidPosition(x + 1, y) && move.canTypeMoveTo(moveType, x + 1, y)) return true;
        if (model.battlefield.map.isValidPosition(x, y - 1) && move.canTypeMoveTo(moveType, x, y - 1)) return true;
        if (model.battlefield.map.isValidPosition(x, y + 1) && move.canTypeMoveTo(moveType, x, y + 1)) return true;
      }
    });

    return false;

    return true;
  }

  @Override
  public void prepareActionMenu(ModelData model, ControllerData controller) {
    for (int i = 0, e = Constants.MAX_PLAYER * Constants.MAX_UNITS; i < e; i++) {
      if (model.battlefield.units.getUnit(i).transport.loadedIn == controller.ui.source.unitId) {
        controller.ui.addInfo(i + "", true);
      }
    }
  }

  @Override
  public void prepareTargets(ModelData model, ControllerData controller) {
    MoveType loadMovetype = model.typeDB.movetypes.get(model.battlefield.units.getUnit(controller.ui.actionDataCode).type.movetype);
    Unit transporter = controller.ui.source.unit;
    int x = controller.ui.target.x;
    int y = controller.ui.target.y;

    // check west
    if (move.canTypeMoveTo(loadMovetype, x - 1, y)) {
      controller.ui.targets.setValue(x - 1, y, 1);
    }

    // check east
    if (move.canTypeMoveTo(loadMovetype, x + 1, y)) {
      controller.ui.targets.setValue(x + 1, y, 1);
    }

    // check south
    if (move.canTypeMoveTo(loadMovetype, x, y + 1)) {
      controller.ui.targets.setValue(x, y + 1, 1);
    }

    // check north
    if (move.canTypeMoveTo(loadMovetype, x, y - 1)) {
      controller.ui.targets.setValue(x, y - 1, 1);
    }
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.unitId;
    controller.data.p2 = controller.ui.actionDataCode;
    controller.data.p3 = controller.ui.target.x;
    controller.data.p4 = controller.ui.target.y;
    controller.data.p5 = move.codeFromAtoB(controller.data.p3, controller.data.p4, controller.ui.actionTarget.x, controller.ui.actionTarget.y);
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Unit transporter = model.battlefield.units.getUnit(controller.data.p1);
    Unit load = model.battlefield.units.getUnit(controller.data.p2);

    AssertUtil.assertThat(load.transport.loadedIn == model.battlefield.units.getUnitId(transporter));
    load.transport.loadedIn = Constants.INACTIVE;

    unloadMovepath.clear();
    unloadMovepath.push(controller.data.p5);
    move.move(load, controller.data.p3, controller.data.p4, unloadMovepath, true, true, false);
  }

}
