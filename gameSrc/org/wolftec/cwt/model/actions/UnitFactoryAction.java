package org.wolftec.cwt.model.actions;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.controller.actions.core.ActionType;
import org.wolftec.cwt.controller.actions.core.TileMeta;
import org.wolftec.cwt.core.SheetIdNumberUtil;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.model.tags.TagValue;

public class UnitFactoryAction extends AbstractAction {

  private final GameroundRecalcVisionAction recalcVision;
  private TagValue unitLimit;

  public UnitFactoryAction(GameroundRecalcVisionAction recalcVision) {
    this.recalcVision = recalcVision;
    unitLimit = new TagValue("game.limits.unitsPerPlayer", 0, Constants.MAX_UNITS, 0, 5);
  }

  @Override
  public String key() {
    return "buildUnit";
  }

  @Override
  public ActionType type() {
    return ActionType.PROPERTY_ACTION;
  }

  @Override
  public boolean checkSource(TileMeta unitFlag, TileMeta propertyFlag) {
    return unitFlag == TileMeta.EMPTY && propertyFlag == TileMeta.OWN;
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Property factory = controller.ui.source.property;

    if (!factory.type.hasBuilds()) {
      return false;
    }

    if (factory.owners.getOwner().manpower == 0) {
      return false;
    }

    int count = factory.owners.getOwner().numberOfUnits;
    int uLimit = JSGlobal.$or(unitLimit.value, 9999999);
    if (count >= uLimit || count >= Constants.MAX_UNITS) {
      return false;
    }

    return true;
  }

  @Override
  public boolean hasSubMenu() {
    return true;
  }

  @Override
  public void prepareActionMenu(ModelData model, ControllerData controller) {
    Property factory = controller.ui.source.property;

    int gold = factory.owners.getOwner().gold;
    Array<String> bList = factory.type.builds;
    model.typeDB.units.forEach((key, type) -> {
      if (bList.indexOf(type.movetype) == -1 && bList.indexOf(type.ID) == -1) {
        return;
      }

      if (type.blocked) {
        return;
      }

      controller.ui.addInfo(key, (type.costs <= gold));
    });
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.source.propertyId;
    controller.data.p2 = controller.ui.actionDataCode;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    Property factory = model.battlefield.properties.getProperty(controller.data.p1);
    String type = SheetIdNumberUtil.convertNumberToId(controller.data.p2);

    UnitType sheet = model.typeDB.units.get(type);

    factory.owners.getOwner().manpower--;
    factory.owners.getOwner().gold -= sheet.costs;

    model.battlefield.properties.forEachProperty((pi, prop) -> {
      if (prop == factory) {
        model.battlefield.units.createUnitAtPosition(prop.position.getPositionX(), prop.position.getPositionY(), prop.owners.getOwner(), type);
      }
    });

    recalcVision.evaluateByData(model, controller);
  }

}
