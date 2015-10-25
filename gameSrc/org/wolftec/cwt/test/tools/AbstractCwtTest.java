package org.wolftec.cwt.test.tools;

import org.wolftec.cwt.core.test.Test;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.ModelResetter;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.states.UserInteractionData;

public abstract class AbstractCwtTest implements Test {

  protected SheetManager sheets;
  protected ModelResetter modelReset;
  protected ModelManager model;
  protected UserInteractionData uiData;

  public CwtTestManager test;

  @Override
  public void beforeTest() {
    prepareDefaultModel();
    prepareModel();
  }

  protected void prepareDefaultModel() {
    setupDefaultTestTypes();
    setupDefaultModel();
  }

  private void setupDefaultModel() {
    uiData.reset();
    modelReset.reset();
    test.expectThat.filledMapWithTiles(10, 10, "tileA");
    test.expectThat.weather("weatherA", 4);
    test.expectThat.turnOwner(0);
  }

  private void setupDefaultTestTypes() {
    sheets.tiles.dropAll();
    sheets.units.dropAll();
    sheets.armies.dropAll();
    sheets.weathers.dropAll();
    sheets.movetypes.dropAll();
    sheets.properties.dropAll();
    sheets.commanders.dropAll();
    test.expectThat.tileTypeExists("tileA");
    test.expectThat.tileTypeExists("tileB");
    test.expectThat.tileTypeExists("tileC");
    test.expectThat.propertyTypeExists("propA");
    test.expectThat.propertyTypeExists("propB");
    test.expectThat.propertyTypeExists("propC");
    test.expectThat.moveTypeExists("moveA");
    test.expectThat.moveTypeExists("moveB");
    test.expectThat.moveTypeExists("moveC");
    test.expectThat.unitTypeExists("unitA");
    test.expectThat.unitTypeExists("unitB");
    test.expectThat.unitTypeExists("unitC");
    test.expectThat.weatherTypeExists("weatherA");
    test.expectThat.weatherTypeExists("weatherB");
    test.expectThat.weatherTypeExists("weatherC");
    test.expectThat.movingUnit("unitA", "moveA", 1);
    test.expectThat.movingUnit("unitB", "moveB", 1);
    test.expectThat.movingUnit("unitC", "moveC", 1);
  }

  protected void prepareModel() {
  }
}
