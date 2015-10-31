package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.Action;
import org.wolftec.cwt.logic.ActionData;
import org.wolftec.cwt.logic.ActionType;
import org.wolftec.cwt.logic.features.SupplyLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class SupplyUnit implements Action {

  private SupplyLogic supply;
  private ModelManager model;

  @Override
  public String key() {
    return "supplyUnit";
  }

  @Override
  public boolean condition(UserInteractionData data) {
    Unit unit = data.source.unit;
    return supply.isSupplier(unit) && supply.hasRefillTargetsNearby(unit, data.target.x, data.target.y);
  }

  @Override
  public ActionType type() {
    return ActionType.UNIT_ACTION;
  }

  @Override
  public void fillData(UserInteractionData interactionData, ActionData actionData) {
    actionData.p1 = interactionData.target.x;
    actionData.p2 = interactionData.target.y;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    int x = data.p1;
    int y = data.p2;
    Unit supplier = model.getTile(x, y).unit;

    if (supply.canRefillObjectAt(supplier, x + 1, y)) {
      supply.refillSuppliesByPosition(x + 1, y);
    }

    if (supply.canRefillObjectAt(supplier, x - 1, y)) {
      supply.refillSuppliesByPosition(x - 1, y);
    }

    if (supply.canRefillObjectAt(supplier, x, y + 1)) {
      supply.refillSuppliesByPosition(x, y + 1);
    }

    if (supply.canRefillObjectAt(supplier, x, y - 1)) {
      supply.refillSuppliesByPosition(x, y - 1);
    }
  }
}
