package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.SheetIdNumberUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.gameround.objecttypes.UnitType;

public class GameroundCreateLoadedUnitAction extends AbstractAction {

  @Override
  public ActionType type() {
    return ActionType.ENGINE_MAP_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.actor.id;
    controller.data.p2 = controller.ui.actionDataCode;
    controller.data.p3 = controller.ui.source.unitId;
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
    unit.transport.loadedIn = controller.data.p3;
    unit.usable.makeInactable();

    owner.numberOfUnits++;
  }

}
