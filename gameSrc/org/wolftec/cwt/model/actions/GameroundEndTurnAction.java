package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.model.ActionType;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.tags.TagValue;
import org.wolftec.cwt.model.tags.Tags;

public class GameroundEndTurnAction extends AbstractAction {

  private final GameroundRecalcVisionAction recalcVision;
  private final GameroundChangeWeatherAction changeWeather;

  private final TagValue cfgPropertyHealingEnabled;
  private final TagValue cfgPropertyFundsEnabled;
  private final TagValue cfgAutoSupplyAtTurnStartEnabled;
  private final TagValue cfgDayLimit;

  public GameroundEndTurnAction(Tags tags, GameroundRecalcVisionAction recalcVision, GameroundChangeWeatherAction changeWeather) {
    this.recalcVision = recalcVision;
    this.changeWeather = changeWeather;

    cfgPropertyFundsEnabled = tags.registerConfig("game.turnStart.funds.enabled", 0, 1, 1, 1);
    cfgPropertyHealingEnabled = tags.registerConfig("game.turnStart.healing.enabled", 0, 1, 1, 1);
    cfgAutoSupplyAtTurnStartEnabled = tags.registerConfig("game.turnStart.autoSupply", 0, 1, 1, 1);
    cfgDayLimit = tags.registerConfig("game.limits.days", 0, 999, 0, 1);
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
  public void evaluateByData(ModelData model, ControllerData controller) {
    int pid = model.battlefield.turns.turnOwner.id;
    int oid = pid;

    pid++;
    while (pid != oid) {

      if (pid == Constants.MAX_PLAYER) {
        pid = 0;

        // Next day
        model.battlefield.turns.day++;
        model.battlefield.weather.decreaseLeftDays();
      }

      if (model.battlefield.players.getPlayer(pid).team != Constants.INACTIVE) {
        break;
      }

      pid++;
    }

    /*
     * If the new player id is the same as the old player id then the game aw2
     * is corrupted
     */
    AssertUtil.assertThatNot(pid == oid, "illegal game state");

    Player player = model.battlefield.players.getPlayer(pid);

    model.battlefield.turns.turnOwner = player;

    // Sets the new turn owner and also the client, if necessary
    if (player.clientControlled) {
      model.battlefield.lastClientPlayer = player;
    }

    // *************************** Update Fog ****************************

    // the active client can see what his and all allied objects can see
    int clTid = model.battlefield.lastClientPlayer.team;
    for (int i = 0, e = Constants.MAX_PLAYER; i < e; i++) {
      Player cPlayer = model.battlefield.players.getPlayer(i);

      cPlayer.turnOwnerVisible = false;
      cPlayer.clientVisible = false;

      // player isn't registered
      if (cPlayer.team == Constants.INACTIVE) {
        continue;
      }

      if (cPlayer.team == clTid) {
        cPlayer.clientVisible = true;
      }
      if (cPlayer.team == player.team) {
        cPlayer.turnOwnerVisible = true;
      }
    }

    model.battlefield.units.forEachUnit((index, unit) -> {
      if (unit.owners.getOwner() == player) {
        unit.usable.makeActable();
      } else {
        unit.usable.makeInactable();
      }
    });

    // FIXME
    // if (network.isHost()) {
    //
    // if (self.day > 0 && self.day >= cfgDayLimit.value) {
    // life.endGameround();
    // return;
    // }
    // }

    model.battlefield.map.forEachTile((x, y, tile) -> {

      if (tile.property != null && tile.property.owner == self.turnOwner) {
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
        if (tile.unit.owners.getOwner() == player) {
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

    recalcVision.evaluateByData(model, controller);

    if (!model.battlefield.players.areEnemyPlayersLeft()) {
      controller.transition.setTransitionTo("IngameLeaveState");
    }

    if (model.battlefield.weather.getLeftDays() == 0) {
      changeWeather.fillData(model, controller);
      changeWeather.evaluateByData(model, controller);
    }
  }
}
