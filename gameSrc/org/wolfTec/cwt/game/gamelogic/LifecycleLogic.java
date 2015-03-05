package org.wolfTec.cwt.game.gamelogic;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.game.gamemodel.bean.GameConfigBean;
import org.wolfTec.cwt.game.gamemodel.bean.GameRoundBean;
import org.wolfTec.cwt.game.gamemodel.bean.ObjectTypesBean;
import org.wolfTec.cwt.game.gamemodel.model.Player;
import org.wolfTec.cwt.game.gamemodel.model.Property;
import org.wolfTec.cwt.game.gamemodel.model.Tile;
import org.wolfTec.cwt.game.gamemodel.model.Unit;
import org.wolfTec.cwt.game.gamemodel.model.UnitType;
import org.wolfTec.managed.Injected;
import org.wolfTec.managed.ManagedComponent;

@ManagedComponent
public class LifecycleLogic {

  @Injected
  private FogLogic fog;

  @Injected
  private CaptureLogic capture;

  @Injected
  private SupplyLogic supply;

  @Injected
  private ObjectTypesBean types;

  @Injected
  private GameConfigBean config;

  @Injected
  private GameRoundBean gameround;

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

    for (int i = 0, e = gameround.getMaxAmountOfUnits(); i < e; i++) {
      Unit unit = gameround.getUnit(i);
      if (unit.owner == player) {
        // TODO
      }
    }

    // drop properties
    for (int i = 0, e = gameround.getMaxAmountOfProperties(); i < e; i++) {
      Property prop = gameround.getProperty(i);
      if (prop.owner == player) {
        capture.makeNeutral(prop);

        // TODO: change type when the property is a changing type property
        String changeType = prop.type.changesTo;
      }
    }

    deactivatePlayer(player);

    // when no opposite teams are found then the game has ended
    if (!gameround.areEnemyTeamsLeft()) {
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
    return unit.owner == null;
  }

  /**
   * Damages a unit.
   *
   * @param damage
   * @param minRest
   */
  public void damageUnit(Unit unit, int damage, int minRest) {
    if (damage == 0) return;

    unit.hp = unit.hp - damage;
    if (unit.hp < minRest) unit.hp = minRest;
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

    unit.hp = unit.hp + health;
    if (unit.hp > 99) {

      // pay difference of the result health and 100 as
      // gold ( in relation to the unit cost ) to the
      // unit owners gold depot
      if (diffAsGold == true) {
        int diff = unit.hp - 99;
        unit.owner.gold += JSGlobal.parseInt((unit.type.cost * diff) / 100, 10);
      }

      unit.hp = 99;
    }
  }

  public void createUnit(int x, int y, Player player, UnitType type) {
    Tile tile = gameround.getTile(x, y);
    Unit unit = gameround.getInactiveUnit();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(type);

    fog.addUnitVision(x, y, player);
  }

  public void destroyUnit(int x, int y, boolean silent) {
    Tile tile = gameround.getTile(x, y);
    fog.removeUnitVision(x, y, tile.unit.owner);

    // TODO check loads

    // remove references
    Player owner = tile.unit.owner;
    owner.numberOfUnits--;

    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (config.getConfigValue("cfgNoUnitsLeftLoose") == 1 && owner.numberOfUnits == 0) {
      this.deactivatePlayer(owner);
    }
  }

  public boolean hasFreeUnitSlot(Player player) {
    return player.numberOfUnits < EngineGlobals.MAX_UNITS;
  }

  private void checkForRepairTargets(int x, int y, Tile tile) {

    // check repair via property
    // TODO
    // if (tile.unit.getHp() < 99) actions.localAction("healUnit", x, y);

    // give funds
    supply.raiseFunds(tile.property);
  }

  private void checkForSupplyTargets(int x, int y, Tile tile) {

    // check neighbours
    // TODO
    // if (supply.isSupplier(tile.unit)) {
    // if (supply.canRefillObjectAt(tile.unit, x + 1, y))
    // actions.localAction("refillSupply", x + 1, y);
    // if (supply.canRefillObjectAt(tile.unit, x - 1, y))
    // actions.localAction("refillSupply", x - 1, y);
    // if (supply.canRefillObjectAt(tile.unit, x, y + 1))
    // actions.localAction("refillSupply", x, y + 1);
    // if (supply.canRefillObjectAt(tile.unit, x, y - 1))
    // actions.localAction("refillSupply", x, y - 1);
    // }

    // drain fuel
    supply.drainFuel(tile.unit);
  }

  public void startsTurn(Player player) {

    // Sets the new turn owner and also the client, if necessary
    if (player.clientControlled) {
      gameround.lastClientPlayer = player;
    }

    // *************************** Update Fog ****************************

    // the active client can see what his and all allied objects can see
    int clTid = gameround.lastClientPlayer.team;
    for (int i = 0, e = EngineGlobals.MAX_PLAYER; i < e; i++) {
      Player cPlayer = gameround.getPlayer(i);

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
