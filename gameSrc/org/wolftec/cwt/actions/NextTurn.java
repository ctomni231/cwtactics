package org.wolftec.cwt.actions;

import org.wolftec.cwt.config.ConfigurableValue;
import org.wolftec.cwt.config.ConfigurationProvider;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.action.ActionData;
import org.wolftec.cwt.core.action.ActionManager;
import org.wolftec.cwt.core.action.ActionType;
import org.wolftec.cwt.logic.FogLogic;
import org.wolftec.cwt.logic.SupplyLogic;
import org.wolftec.cwt.logic.TurnLogic;
import org.wolftec.cwt.logic.WeatherLogic;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.network.NetworkManager;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.states.StateFlowData;
import org.wolftec.cwt.states.UserInteractionData;

public class NextTurn implements Action, ConfigurationProvider {

  private FogLogic       fog;
  private StateManager   state;
  private NetworkManager network;
  private ModelManager   model;
  private ActionManager  actions;

  private UserInteractionData uiData;

  private TurnLogic    turn;
  private WeatherLogic weather;
  private SupplyLogic  supply;

  private RefillSupply  refillSupply;
  private ChangeWeather changeWeather;
  private HealUnit      healUnit;

  private ConfigurableValue cfgPropertyHealingEnabled;
  private ConfigurableValue cfgPropertyFundsEnabled;
  private ConfigurableValue cfgAutoSupplyAtTurnStartEnabled;

  // TODO better in on construct or autoconstruct ConfigurableValue
  public NextTurn() {
    cfgPropertyFundsEnabled = new ConfigurableValue(0, 1, 1);
    cfgPropertyHealingEnabled = new ConfigurableValue(0, 1, 1);
    cfgAutoSupplyAtTurnStartEnabled = new ConfigurableValue(0, 1, 1);
  }

  @Override
  public String key() {
    return "nextTurn";
  }

  @Override
  public boolean noAutoWait() {
    return true;
  }

  @Override
  public ActionType type() {
    return ActionType.MAP_ACTION;
  }

  @Override
  public void evaluateByData(int delta, ActionData data, StateFlowData stateTransition) {
    turn.stopTurn();
    if (network.isHost() && model.weatherLeftDays == 0) {
      ActionData weatherChangeData = actions.acquireData();
      changeWeather.fillData(uiData, weatherChangeData);
      actions.localActionData(changeWeather.key(), weatherChangeData);
    }

    // TODO move somewhere else
    model.forEachProperty((pi, property) -> {

      // // give funds
      // exports.raiseFunds(tile.property);
    });

    // TODO move somewhere else
    model.forEachTile((x, y, tile) -> {

      if (tile.property != null && tile.property.owner == model.turnOwner) {
        if (cfgPropertyFundsEnabled.value == 1) {
          supply.raiseFunds(tile.property);
        }

        if (cfgPropertyHealingEnabled.value == 1) {
          if (tile.unit != null && tile.unit.hp < 99 && tile.property.owner == tile.unit.owner) {
            ActionData healData = actions.acquireData();
            uiData.target.set(model, x, y);
            healUnit.fillData(uiData, healData);
            actions.localActionData(healUnit.key(), healData);
          }
        }
      }

      if (tile.unit != null) {

        tile.unit.canAct = tile.unit.owner == model.turnOwner;

        if (tile.unit.owner == model.turnOwner) {
          supply.drainFuel(tile.unit);

          if (cfgAutoSupplyAtTurnStartEnabled.value == 1) {
            if (supply.isSupplier(tile.unit)) {
              if (supply.canRefillObjectAt(tile.unit, x + 1, y)) {
                ActionData supplyData = actions.acquireData();
                uiData.target.set(model, x + 1, y);
                refillSupply.fillData(uiData, supplyData);
                actions.localActionData(refillSupply.key(), supplyData);
              }
              if (supply.canRefillObjectAt(tile.unit, x - 1, y)) {
                ActionData supplyData = actions.acquireData();
                uiData.target.set(model, x - 1, y);
                refillSupply.fillData(uiData, supplyData);
                actions.localActionData(refillSupply.key(), supplyData);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y + 1)) {
                ActionData supplyData = actions.acquireData();
                uiData.target.set(model, x, y + 1);
                refillSupply.fillData(uiData, supplyData);
                actions.localActionData(refillSupply.key(), supplyData);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y - 1)) {
                ActionData supplyData = actions.acquireData();
                uiData.target.set(model, x, y - 1);
                refillSupply.fillData(uiData, supplyData);
                actions.localActionData(refillSupply.key(), supplyData);
              }
            }
          }
        }
      }
    });
  }
}
