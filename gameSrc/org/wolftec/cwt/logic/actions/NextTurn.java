package org.wolftec.cwt.logic.actions;

import org.wolftec.cwt.logic.features.FogLogic;
import org.wolftec.cwt.logic.features.SupplyLogic;
import org.wolftec.cwt.logic.features.TurnLogic;
import org.wolftec.cwt.logic.features.WeatherLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.wotec.action.Action;
import org.wolftec.cwt.wotec.action.ActionData;
import org.wolftec.cwt.wotec.action.ActionManager;
import org.wolftec.cwt.wotec.action.ActionType;
import org.wolftec.cwt.wotec.config.ConfigurableValue;
import org.wolftec.cwt.wotec.config.ConfigurationProvider;
import org.wolftec.cwt.wotec.net.NetworkManager;
import org.wolftec.cwt.wotec.state.StateFlowData;
import org.wolftec.cwt.wotec.state.StateManager;

public class NextTurn implements Action, ConfigurationProvider {

  private FogLogic fog;
  private StateManager state;
  private NetworkManager network;
  private ModelManager model;
  private ActionManager actions;

  private UserInteractionData uiData;

  private TurnLogic turn;
  private WeatherLogic weather;
  private SupplyLogic supply;

  private ChangeWeather changeWeather;

  private ConfigurableValue cfgPropertyHealingEnabled;
  private ConfigurableValue cfgPropertyFundsEnabled;
  private ConfigurableValue cfgAutoSupplyAtTurnStartEnabled;
  private ConfigurableValue cfgDayLimit;

  @Override
  public void onConstruction() {
    cfgPropertyFundsEnabled = new ConfigurableValue("game.turnStart.funds.enabled", 0, 1, 1);
    cfgPropertyHealingEnabled = new ConfigurableValue("game.turnStart.healing.enabled", 0, 1, 1);
    cfgAutoSupplyAtTurnStartEnabled = new ConfigurableValue("game.turnStart.autoSupply", 0, 1, 1);
    cfgDayLimit = new ConfigurableValue("game.limits.days", 0, 999, 0);
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
    if (network.isHost()) {

      if (model.day > 0 && model.day >= cfgDayLimit.value) {
        stateTransition.setTransitionTo("IngameLeaveState");
        return;
      }

      if (model.weatherLeftDays == 0) {
        ActionData weatherChangeData = actions.acquireData();
        changeWeather.fillData(uiData, weatherChangeData);
        actions.localActionData(changeWeather.key(), weatherChangeData, false);
      }
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
          if (supply.canPropertyRepairAt(x, y)) {
            supply.propertyRepairsAt(x, y);
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
                supply.refillSuppliesByPosition(x + 1, y);
              }
              if (supply.canRefillObjectAt(tile.unit, x - 1, y)) {
                supply.refillSuppliesByPosition(x - 1, y);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y + 1)) {
                supply.refillSuppliesByPosition(x, y + 1);
              }
              if (supply.canRefillObjectAt(tile.unit, x, y - 1)) {
                supply.refillSuppliesByPosition(x, y - 1);
              }
            }
          }
        }
      }
    });
  }
}
