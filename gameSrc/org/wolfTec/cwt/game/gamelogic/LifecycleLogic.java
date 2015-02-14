package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.model.GameRoundBean;
import org.wolfTec.cwt.game.model.Player;
import org.wolfTec.cwt.game.model.Tile;
import org.wolfTec.cwt.game.model.Unit;
import org.wolfTec.cwt.game.model.types.UnitType;
import org.wolfTec.cwt.game.utility.AssertUtilyBean;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean public class LifecycleLogic {
  
  @Injected private FogLogic fog;
  @Injected private GameRoundBean gameround;

  /**
   * 
   * @param player
   * @return
   */
  public boolean isInactivePlayer(Player player) {
    return player.team != EngineGlobals.INACTIVE_ID;
  }

  /**
   * A player has loosed the game round due a specific reason. This function
   * removes all of his units and properties. Furthermore the left teams will be
   * checked. If only one team is left then the end game event will be invoked.
   * 
   * @param player
   */
  public void deactivatePlayer(Player player) {
    player.team = EngineGlobals.INACTIVE_ID;
    
    for (var i = 0, e = gameround.units.length; i < e; i++) {
        var unit = model.units[i];
        if (unit.owner == player) {
            // TODO
        }
    }

    // drop properties
    for (var i = 0, e = model.properties.length; i < e; i++) {
        var prop = model.properties[i];
        if (prop.owner == player) {
            prop.makeNeutral();

            // TODO: change type when the property is a changing type property
            var changeType = prop.type.changeAfterCaptured;
        }
    }

    deactivatePlayer(player);

    // when no opposite teams are found then the game has ended
    if (!model.areEnemyTeamsLeft()) {
        // TODO
    }
  }

  /**
   * 
   * @param player
   * @param teamNumber
   */
  public void activatePlayer(Player player, int teamNumber) {
    player.team = teamNumber;
  }

  /**
   * @return {boolean}
   */
  public boolean isInactiveUnit(Unit unit) {
    return unit.getOwner() == null;
  }

  /**
   * Damages a unit.
   *
   * @param damage
   * @param minRest
   */
  public void damageUnit(Unit unit, int damage, int minRest) {
    if (damage == 0) return;

    unit.setHp(unit.getHp() - damage);
    if (unit.getHp() < minRest) unit.setHp(minRest);
  }

  /**
   * Heals an unit. If the unit health will be greater than the maximum health
   * value then the difference will be added as gold to the owners gold depot.
   *
   * @param health
   * @param diffAsGold
   */
  public void healUnit(Unit unit, int health, boolean diffAsGold) {
    if (health == 0) return;

    unit.setHp(unit.getHp() + health);
    if (unit.getHp() > 99) {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold == true) {
        int diff = unit.getHp() - 99;
        unit.getOwner().gold += JSGlobal.parseInt((unit.getType().cost * diff) / 100, 10);
      }

      unit.setHp(99);
    }
  }

  public void createUnit(int x, int y, Player player, UnitType type) {
    Tile tile = getGameRound().getMap().getTile(x, y);
    Unit unit = getInactiveUnit();

    // set references
    unit.setOwner(player);
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(sheet.units.sheets[type]);

    addUnitVision(x, y, player);
  }

  public void destroyUnit(int x, int y, boolean silent) {
    Tile tile = getGameRound().getMap().getTile(x, y);
    removeUnitVision(x, y, tile.unit.getOwner());

    // TODO check loads

    // remove references
    Player owner = tile.unit.getOwner();
    owner.numberOfUnits--;

    tile.unit.setOwner(null);
    tile.unit = null;

    // end game when the player does not have any unit left
    if (getGameConfig().getConfigValue("cfgNoUnitsLeftLoose") == 1 && owner.numberOfUnits == 0) {
      this.deactivatePlayer(owner);
    }
  }

  public boolean hasFreeUnitSlot(Player player) {
    return player.numberOfUnits < EngineGlobals.MAX_UNITS;
  }
  
  var cfgAutoSupply = require("../config").getConfig("autoSupplyAtTurnStart");
  var cfgDayLimit = require("../config").getConfig("round_dayLimit");


  var statemachine = require("../statemachine");

  function checkForRepairTargets(x, y, tile) {

      // check repair via property
      if (tile.unit.hp < 99) actions.localAction("healUnit", x, y);

      // give funds
      exports.raiseFunds(tile.property);
  }

  function checkForSupplyTargets(x, y, tile) {

      // check neighbours
      if (supply.isSupplier(tile.unit)) {
          if (supply.canRefillObjectAt(tile.unit, x + 1, y)) actions.localAction("refillSupply", x + 1, y);
          if (supply.canRefillObjectAt(tile.unit, x - 1, y)) actions.localAction("refillSupply", x - 1, y);
          if (supply.canRefillObjectAt(tile.unit, x, y + 1)) actions.localAction("refillSupply", x, y + 1);
          if (supply.canRefillObjectAt(tile.unit, x, y - 1)) actions.localAction("refillSupply", x, y - 1);
      }

      // drain fuel
      supply.drainFuel(tile.unit);
  }

  exports.startsTurn = function(player) {

      // Sets the new turn owner and also the client, if necessary
      if (player.clientControlled) {
          model.lastClientPlayer = player;
      }

      // *************************** Update Fog ****************************

      // the active client can see what his and all allied objects can see
      var clTid = model.lastClientPlayer.team;
      var i, e;
      for (i = 0, e = EngineGlobals.MAX_PLAYER; i < e; i++) {
          var cPlayer = model.players[i];

          cPlayer.turnOwnerVisible = false;
          cPlayer.clientVisible = false;

          // player isn't registered
          if (cPlayer.team == EngineGlobals.INACTIVE_ID) continue;

          if (cPlayer.team == clTid) {
              cPlayer.clientVisible = true;
          }
          if (cPlayer.team == player.team) {
              cPlayer.turnOwnerVisible = true;
          }
      }
  };
}
