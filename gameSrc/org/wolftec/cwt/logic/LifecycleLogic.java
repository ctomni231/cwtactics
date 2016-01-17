package org.wolftec.cwt.logic;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.annotations.OptionalReturn;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Tile;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.tags.Configurable;
import org.wolftec.cwt.tags.Configuration;
import org.wolftec.cwt.util.NullUtil;

public class LifecycleLogic implements ManagedClass, Configurable
{

  private ModelManager model;
  private SheetManager sheets;
  private FogLogic fog;

  private Configuration noUnitsLeftLoose;

  @Override
  public void onConstruction()
  {
    noUnitsLeftLoose = new Configuration("game.loose.whenNoUnitLeft", 0, 1, 0);
  }

  @OptionalReturn
  public Unit getInactiveUnit()
  {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++)
    {
      if (model.getUnit(i).owner == null)
      {
        return model.getUnit(i);
      }
    }
    return null;
  }

  @OptionalReturn
  public Property getInactiveProperty()
  {
    for (int i = 0, e = Constants.MAX_PROPERTIES; i < e; i++)
    {
      if (model.getProperty(i).type == null)
      {
        return model.getProperty(i);
      }
    }
    return null;
  }

  /**
   * @param prop
   * @return true when a loose of this property causes a loose of the game round
   */
  public boolean isCriticalProperty(Property prop)
  {
    return prop.type.looseAfterCaptured;
  }

  public void createUnitAtPosition(int x, int y, Player player, String type)
  {
    Tile tile = model.getTile(x, y);
    Unit unit = createUnit(player, type);
    tile.unit = unit;
    fog.addUnitVision(x, y, player);
  }

  public Unit createUnitAsLoad(Unit transporter, Player player, String type)
  {
    Unit unit = createUnit(player, type);
    unit.loadedIn = model.getUnitId(transporter);
    return unit;
  }

  private Unit createUnit(Player player, String type)
  {
    Unit unit = getInactiveUnit();
    UnitType typeSheet = sheets.units.get(type);
    unit.owner = player;
    unit.type = typeSheet;
    unit.hp = 99;
    unit.exp = 0;
    unit.ammo = typeSheet.ammo;
    unit.fuel = typeSheet.fuel;
    unit.hidden = false;
    unit.loadedIn = Constants.INACTIVE;
    unit.canAct = false;
    player.numberOfUnits++;
    return unit;
  }

  public void destroyUnit(int x, int y)
  {
    Tile tile = model.getTile(x, y);

    fog.removeUnitVision(x, y, tile.unit.owner);

    Player owner = tile.unit.owner;
    owner.numberOfUnits--;

    int unitId = model.getUnitId(tile.unit);
    model.forEachUnit((id, unit) ->
    {
      if (unit.loadedIn == unitId)
      {
        unit.owner = null;
      }
    });

    tile.unit.owner = null;
    tile.unit = null;

    if (noUnitsLeftLoose.value == 1 && owner.numberOfUnits == 0)
    {
      deactivatePlayer(owner);
    }
  }

  public void createProperty(int x, int y, Player player, String type)
  {
    Tile tile = model.getTile(x, y);
    Property prop = getInactiveProperty();
    prop.owner = player;
    prop.type = sheets.properties.get(type);
    tile.property = prop;
    player.numberOfProperties++;
    fog.addPropertyVision(x, y, player);
  }

  /**
   * A player has loosed the game round due a specific reason. This function
   * removes all of his units and properties. Furthermore the left teams will be
   * checked. If only one team is left then the end game event will be invoked.
   * 
   * @param player
   */
  public void deactivatePlayer(Player player)
  {
    for (int i = 0, e = Constants.MAX_UNITS * Constants.MAX_PLAYER; i < e; i++)
    {
      Unit unit = model.getUnit(i);
      if (unit.owner == player)
      {
        model.searchUnit(unit, (x, y, u) -> destroyUnit(x, y));
      }
    }

    // drop properties
    for (int i = 0, e = Constants.MAX_PROPERTIES; i < e; i++)
    {
      Property prop = model.getProperty(i);
      if (prop.owner == player)
      {
        prop.owner = null;
        prop.type = sheets.properties.get(prop.type.changeAfterCaptured);
      }
    }

    player.deactivate();

    // when no opposite teams are found then the game has ended
    if (!model.areEnemyTeamsLeft())
    {
      endGameround();
    }
  }

  public boolean hasFreeUnitSlot(Player player)
  {
    return player.numberOfUnits < Constants.MAX_UNITS;
  }

  public boolean isActable(Unit unit)
  {
    return unit.canAct;
  }

  public void makeActable(Unit unit)
  {
    unit.canAct = true;
  }

  public void makeInactable(Unit unit)
  {
    unit.canAct = false;
  }

  public void endGameround()
  {

  }

  public boolean isGameroundEnded()
  {
    return false;
  }

  public void destroyEverything()
  {

    model.forEachTile((x, y, tile) ->
    {
      tile.type = null;
      if (NullUtil.isPresent(tile.unit))
      {
        destroyUnit(x, y);
      }
      tile.property = null;
    });

    model.forEachPlayer((index, player) ->
    {
      player.clientControlled = true;
      player.team = index;
      player.coA = null;
      player.gold = 999999;
      player.manpower = 999999;
    });

    model.forEachProperty((index, property) ->
    {
      property.points = 20; /* TODO */
      property.owner = null;
      property.type = null;
    });

    model.day = 0;
    model.gameTimeElapsed = 0;
    model.gameTimeLimit = 0;
    model.turnTimeElapsed = 0;
    model.turnTimeLimit = 0;
    model.mapHeight = 0;
    model.mapWidth = 0;
    model.turnOwner = model.getPlayer(0);
    model.lastClientPlayer = model.getPlayer(0);
    model.weather = null;
    model.weatherLeftDays = 0;
  }
}
