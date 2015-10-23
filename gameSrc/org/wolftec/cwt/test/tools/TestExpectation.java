package org.wolftec.cwt.test.tools;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.annotations.OptionalParameter;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.Property;
import org.wolftec.cwt.model.gameround.Unit;
import org.wolftec.cwt.model.sheets.SheetDatabase;
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

  @Native
  public void propertyAt(int x, int y, String type, int ownerId) {
    // ... calls overloaded method ...
  }

  public void propertyAt(int x, int y, String type, int ownerId, @OptionalParameter Callback1<Property> propertyEditor) {
    parent.life.createProperty(x, y, parent.model.getPlayer(ownerId), type);
    if (NullUtil.isPresent(propertyEditor)) {
      propertyEditor.$invoke(parent.model.getTile(x, y).property);
    }
  }

  @Native
  public void unitAt(int x, int y, String type, int ownerId) {
    // ... calls overloaded method ...
  }

  public void unitAt(int x, int y, String type, int ownerId, @OptionalParameter Callback1<Unit> unitEditor) {

    // just do that to make sure that the type exists
    parent.sheets.units.get(type);

    parent.life.createUnit(x, y, parent.model.getPlayer(ownerId), type);

    if (NullUtil.isPresent(unitEditor)) {
      unitEditor.$invoke(parent.model.getTile(x, y).unit);
    }
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
    parent.uiData.source.set(parent.model, x, y);
  }

  public void targetSelectionAt(int x, int y) {
    parent.uiData.target.set(parent.model, x, y);
  }

  public void sourceAndTargetSelectionAt(int x, int y) {
    parent.uiData.source.set(parent.model, x, y);
    parent.uiData.target.set(parent.model, x, y);
  }

  <T extends SheetType> void registerType(String id, T sheet, SheetDatabase<T> db) {
    sheet.ID = id;
    db.registerSheet(sheet);
  }
}
