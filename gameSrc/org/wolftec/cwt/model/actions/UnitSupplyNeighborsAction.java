package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.TileMap;
import org.wolftec.cwt.model.gameround.Unit;

public class UnitSupplyNeighborsAction extends AbstractAction {

  @Override
  public String key() {
    return "supplyUnit";
  }

  private boolean canRefillObjectAt(TileMap map, Unit supplier, int x, int y) {
    if (!map.isValidPosition(x, y)) {
      return false;
    }
    Unit target = map.getTile(x, y).unit;
    return target != supplier && NullUtil.isPresent(target) && target.owners.getOwner() == supplier.owners.getOwner();
  }

  @Override
  public boolean condition(ModelData model, ControllerData controller) {
    Unit unit = controller.ui.source.unit;

    if (!unit.type.supply.supplier) {
      return false;
    }

    int x = controller.ui.target.x;
    int y = controller.ui.target.y;

    if (canRefillObjectAt(model.battlefield.map, unit, x + 1, y)) {
      return false;
    } else if (canRefillObjectAt(model.battlefield.map, unit, x - 1, y)) {
      return false;
    } else if (canRefillObjectAt(model.battlefield.map, unit, x, y + 1)) {
      return false;
    } else if (canRefillObjectAt(model.battlefield.map, unit, x, y - 1)) {
      return false;
    }

    return true;
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public void fillData(ModelData model, ControllerData controller) {
    controller.data.p1 = controller.ui.target.x;
    controller.data.p2 = controller.ui.target.y;
  }

  private void refillSuppliesByPosition(TileMap map, int x, int y) {
    Unit unit = map.getTile(x, y).unit;
    unit.supplies.ammo = unit.type.ammo;
    unit.supplies.fuel = unit.type.fuel;
  }

  @Override
  public void evaluateByData(ModelData model, ControllerData controller) {
    int x = controller.data.p1;
    int y = controller.data.p2;
    TileMap map = model.battlefield.map;
    Unit supplier = map.getTile(x, y).unit;

    if (canRefillObjectAt(map, supplier, x + 1, y)) {
      refillSuppliesByPosition(map, x + 1, y);
    }

    if (canRefillObjectAt(map, supplier, x - 1, y)) {
      refillSuppliesByPosition(map, x - 1, y);
    }

    if (canRefillObjectAt(map, supplier, x, y + 1)) {
      refillSuppliesByPosition(map, x, y + 1);
    }

    if (canRefillObjectAt(map, supplier, x, y - 1)) {
      refillSuppliesByPosition(map, x, y - 1);
    }
  }
}
