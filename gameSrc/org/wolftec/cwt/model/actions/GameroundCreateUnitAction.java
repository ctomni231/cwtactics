package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.SheetIdNumberUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.gameround.objecttypes.UnitType;

public class GameroundCreateUnitAction extends AbstractAction {

  private final GameroundChangeVisionAction changeVision;

  public GameroundCreateUnitAction(GameroundChangeVisionAction changeVision) {
    this.changeVision = changeVision;
  }

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.actor.id;
    controller.data.p2 = controller.ui.actionDataCode;
    controller.data.p3 = controller.ui.source.x;
    controller.data.p4 = controller.ui.source.y;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Player owner = model.battlefield.players.getPlayer(controller.data.p1);
    String type = SheetIdNumberUtil.convertNumberToId(controller.data.p2);

    Unit unit = model.battlefield.units.acquireUnit();
    UnitType typeSheet = model.typeDB.units.get(type);
    unit.owners.setOwner(owner);
    unit.type = typeSheet;
    unit.live.hp = 99;
    unit.exp = 0;
    unit.supplies.ammo = typeSheet.ammo;
    unit.supplies.fuel = typeSheet.fuel;
    if (unit.hide.isHidden()) {
      unit.hide.unhide();
    }
    unit.transport.loadedIn = Constants.INACTIVE;
    unit.usable.makeInactable();

    owner.numberOfUnits++;

    int x = controller.data.p3;
    int y = controller.data.p4;
    model.battlefield.map.getTile(x, y).unit = unit;

    controller.data.p1 = controller.data.p3;
    controller.data.p2 = controller.data.p4;
    controller.data.p3 = unit.type.vision;
    controller.data.p4 = 1;
    changeVision.evaluateByData(model, controller);
  }

}
