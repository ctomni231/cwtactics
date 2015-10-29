package org.wolftec.cwt.test;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.action.Action;
import org.wolftec.cwt.core.annotations.OptionalParameter;
import org.wolftec.cwt.core.state.StateFlowData;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.logic.features.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Player;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.sheets.types.CommanderType;
import org.wolftec.cwt.model.sheets.types.MoveType;
import org.wolftec.cwt.model.sheets.types.PropertyType;
import org.wolftec.cwt.model.sheets.types.SheetType;
import org.wolftec.cwt.model.sheets.types.TileType;
import org.wolftec.cwt.model.sheets.types.UnitType;
import org.wolftec.cwt.model.sheets.types.WeatherType;

public class TestExpectation {

  private CwtTestManager parent;

  public TestExpectation(CwtTestManager parent) {
    this.parent = parent;
  }

  public UnitType unitType(String id) {
    return sheetType(id, parent.sheets.units);
  }

  public CommanderType coType(String id) {
    return sheetType(id, parent.sheets.commanders);
  }

  public MoveType moveType(String id) {
    return sheetType(id, parent.sheets.movetypes);
  }

  public PropertyType propertyType(String id) {
    return sheetType(id, parent.sheets.properties);
  }

  <T extends SheetType> T sheetType(String id, SheetDatabase<T> db) {
    return db.get(id);
  }

  public void unitTypeExists(String id) {
    registerType(id, new UnitType(), parent.sheets.units);
  }

  public void moveTypeExists(String id) {
    MoveType sheet = new MoveType();
    sheet.costs = JSCollections.$map();
    registerType(id, sheet, parent.sheets.movetypes);
  }

  public void tileTypeExists(String id) {
    registerType(id, new TileType(), parent.sheets.tiles);
  }

  public void coTypeExists(String id) {
    registerType(id, new CommanderType(), parent.sheets.commanders);
  }

  public void propertyTypeExists(String id) {
    registerType(id, new PropertyType(), parent.sheets.properties);
  }

  public void weatherTypeExists(String id) {
    registerType(id, new WeatherType(), parent.sheets.weathers);
  }

  public void movingUnit(String unitType, String movingType, int moverange) {
    UnitType unit = parent.sheets.units.get(unitType);

    // just do that to make sure that the type exists
    parent.sheets.movetypes.get(movingType);

    unit.movetype = movingType;
    unit.range = moverange;
  }

  public void inTeam(int owner, int team) {
    parent.model.getPlayer(owner).team = team;
  }

  public void moveCosts(String id, String moverType, int value) {
    parent.sheets.movetypes.get(id).costs.$put(moverType, value);
  }

  public void filledMapWithTiles(int width, int height, String tileType) {
    TileType tileSheet = parent.sheets.tiles.get(tileType);
    parent.model.mapHeight = height;
    parent.model.mapWidth = width;
    parent.model.forEachTile((x, y, tile) -> tile.type = tileSheet);
  }

  public void tileTypeAt(int x, int y, String type) {
    parent.model.getTile(x, y).type = parent.sheets.tiles.get(type);
  }

  public void everythingVisible() {
    parent.model.forEachTile((x, y, tile) -> tile.visionTurnOwner = 1);
  }

  public void everythingCanAct() {
    ModelManager model = parent.model;
    model.forEachUnit((id, unit) -> unit.canAct = model.isTurnOwnerObject(unit));
  }

  public void everythingCannotAct() {
    parent.model.forEachUnit((id, unit) -> unit.canAct = false);
  }

  public void player(int id, Callback1<Player> editor) {
    if (NullUtil.isPresent(editor)) {
      editor.$invoke(parent.model.getPlayer(id));
    }
  }

  public void mainCo(int id, String coId) {
    player(id, p -> p.coA = parent.sheets.commanders.get(coId));
  }

  @Native
  public void propertyAt(int x, int y, String type, int ownerId) {
    // ... calls overloaded method ...
  }

  public void propertyAt(int x, int y, String type, int ownerId, @OptionalParameter Callback1<Property> propertyEditor) {
    if (!NullUtil.isPresent(parent.model.getTile(x, y).property)) {
      parent.life.createProperty(x, y, parent.model.getPlayer(ownerId), type);
      if (NullUtil.isPresent(propertyEditor)) {
        propertyEditor.$invoke(parent.model.getTile(x, y).property);
      }
    }
  }

  @Native
  public void unitExistsAt(int x, int y, String type, int ownerId) {
    // ... calls overloaded method ...
  }

  public void unitExistsAt(int x, int y, String type, int ownerId, @OptionalParameter Callback1<Unit> unitEditor) {
    if (!NullUtil.isPresent(parent.model.getTile(x, y).unit)) {
      parent.life.createUnit(x, y, parent.model.getPlayer(ownerId), type);
      if (NullUtil.isPresent(unitEditor)) {
        unitEditor.$invoke(parent.model.getTile(x, y).unit);
      }
    }
  }

  @Native
  public void loadedUnitExistsIn(int tx, int ty, String type) {
    // ... calls overloaded method ...
  }

  public void loadedUnitExistsIn(int tx, int ty, String type, @OptionalParameter Callback1<Unit> unitEditor) {
    Unit apc = parent.model.getTile(tx, ty).unit;
    Unit load = parent.life.createLoadedUnit(apc, apc.owner, type);

    if (NullUtil.isPresent(unitEditor)) {
      unitEditor.$invoke(load);
    }
  }

  public Unit unitAt(int x, int y) {
    return NullUtil.getOrThrow(parent.model.getTile(x, y).unit, "no unit there");
  }

  public void turnOwner(int ownerId) {
    parent.model.turnOwner = parent.model.getPlayer(0);
    parent.uiData.actor = parent.model.turnOwner;
  }

  public void weather(String type, int duration) {
    parent.model.weather = parent.sheets.weathers.get(type);
    parent.model.weatherLeftDays = duration;
  }

  public void sourceSelectionAt(int x, int y) {
    parent.uiData.movePath.clear();
    parent.uiData.source.set(parent.model, x, y);
    parent.uiData.target.set(parent.model, x, y);
  }

  /**
   * <p>
   * <strong>This method does not check the correctness of the move path<strong>
   * </p>
   * 
   * @param arguments
   *          move codes
   */
  public void movePathSelected(int... arguments) {
    if (!parent.model.isValidPosition(parent.uiData.source.x, parent.uiData.source.y)) {
      JsUtil.throwError("source position must be set before target");
    }

    int x = parent.uiData.source.x;
    int y = parent.uiData.source.y;
    parent.uiData.movePath.clear();

    for (int i = 0; i < arguments.length; i++) {
      int code = arguments[i];

      switch (code) {

        case MoveLogic.MOVE_CODES_DOWN:
          y++;
          break;

        case MoveLogic.MOVE_CODES_UP:
          y--;
          break;

        case MoveLogic.MOVE_CODES_LEFT:
          x--;
          break;

        case MoveLogic.MOVE_CODES_RIGHT:
          x++;
          break;
      }

      parent.uiData.movePath.push(code);
    }

    parent.uiData.target.set(parent.model, x, y);
  }

  /**
   * 
   * @param x
   * @param y
   */
  public void targetSelectionAt(int x, int y) {
    if (!parent.model.isValidPosition(parent.uiData.source.x, parent.uiData.source.y)) {
      JsUtil.throwError("source position must be set before target");
    }

    parent.uiData.target.set(parent.model, x, y);
    parent.uiData.targets.setAllValuesTo(1, 1);
    parent.move.generateMovePath(parent.uiData.source.x, parent.uiData.source.y, x, y, parent.uiData.targets, parent.uiData.movePath);
  }

  public void actionSelectionAt(int x, int y) {
    parent.uiData.actionTarget.set(parent.model, x, y);
  }

  public void menuEntrySelected(int index) {
    parent.uiData.selectInfoAtIndex(index);
  }

  <T extends SheetType> void registerType(String id, T sheet, SheetDatabase<T> db) {
    sheet.ID = id;
    db.registerSheet(sheet);
  }

  public void actionSubMenuOpened(Action action) {
    parent.modify.buildActionMenu(action);
  }

  @Native
  public void actionTriggered(Action action) {
    // native
  }

  public void actionTriggered(Action action, Callback1<StateFlowData> flowData) {
    parent.modify.invokeAction(action, flowData);
  }

  public void actionTargetMapOpened(Action action) {
    parent.uiData.targets.reset();
    action.prepareTargets(parent.uiData);
  }

  public void configValue(String cfg, int value) {
    parent.cfg.getConfig(cfg).setValue(value);
  }
}
