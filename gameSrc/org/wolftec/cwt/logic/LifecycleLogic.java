package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.config.ConfigurableValue;
import org.wolftec.cwt.core.config.ConfigurationProvider;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetManager;

public class LifecycleLogic implements Injectable, ConfigurationProvider {

  private ModelManager model;
  private SheetManager sheets;
  private FogLogic     fog;

  private ConfigurableValue noUnitsLeftLoose;

  @Override
  public void onConstruction() {
    noUnitsLeftLoose = new ConfigurableValue("game.loose.whenNoUnitLeft", 0, 1, 0);
  }

  //
  // Returns an inactive **unit object** or **null** if every slot in the unit
  // list is used.
  //
  public Unit getInactiveUnit() {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {
      if (model.getUnit(i).owner == null) {
        return model.getUnit(i);
      }
    }
    return null;
  }

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {cwt.Player|cwt.Unit|cwt.Property} player
  // @param type
  //
  public void createUnit(int x, int y, Player player, String type) {
    Tile tile = model.getTile(x, y);

    Unit unit = getInactiveUnit();

    // set references
    unit.owner = player;
    tile.unit = unit;
    player.numberOfUnits++;

    unit.initByType(sheets.units.get(type));

    fog.addUnitVision(x, y, player);
  }

  //
  //
  // @param {number} x
  // @param {number} y
  // @param {boolean} silent
  //
  public void destroyUnit(int x, int y, boolean silent) {
    Tile tile = model.getTile(x, y);

    fog.removeUnitVision(x, y, tile.unit.owner);

    // TODO check loads

    // remove references
    Player owner = tile.unit.owner;
    owner.numberOfUnits--;

    tile.unit.owner = null;
    tile.unit = null;

    // end game when the player does not have any unit left
    if (noUnitsLeftLoose.value == 1 && owner.numberOfUnits == 0) {
      deactivatePlayer(owner);
    }
  }

  /**
   * A player has loosed the game round due a specific reason. This function
   * removes all of his units and properties. Furthermore the left teams will be
   * checked. If only one team is left then the end game event will be invoked.
   * 
   * @param player
   */
  public void deactivatePlayer(Player player) {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++) {
      Unit unit = model.getUnit(i);
      if (unit.owner == player) {
        // TODO
      }
    }

    // drop properties
    for (int i = 0, e = Constants.MAX_PROPERTIES; i < e; i++) {
      Property prop = model.getProperty(i);
      if (prop.owner == player) {
        prop.makeNeutral();

        // TODO: change type when the property is a changing type property
        String changeType = prop.type.changeAfterCaptured;
      }
    }

    player.deactivate();

    // when no opposite teams are found then the game has ended
    if (!model.areEnemyTeamsLeft()) {
      // TODO
    }
  }

  //
  //
  // @return {boolean}
  //
  public boolean hasFreeUnitSlot(Player player) {
    return player.numberOfUnits < Constants.MAX_UNITS;
  }

  public boolean isActable(Unit unit) {
    return unit.canAct;
  }

  public void makeActable(Unit unit) {
    unit.canAct = true;
  }

  public void makeInactable(Unit unit) {
    unit.canAct = false;
  }
}
