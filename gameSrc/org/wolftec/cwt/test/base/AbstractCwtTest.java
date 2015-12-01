package org.wolftec.cwt.test.base;

import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.model.gameround.GameroundEnder;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.tags.Tags;

public abstract class AbstractCwtTest implements Test {

  protected SheetDatabase sheets;
  protected GameroundEnder model;
  protected UserInteractionData uiData;
  protected LifecycleLogic life;
  protected Tags cfg;

  public CwtTestManager test;

  @Override
  public void beforeTest() {
    prepareDefaultModel();
    prepareModel();
  }

  private void prepareDefaultModel() {
    setupDefaultTestTypes();
    setupDefaultModel();
  }

  private void setupDefaultModel() {
    uiData.reset();
    life.destroyEverything();
    cfg.resetGameOptions();
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
    test.expectThat.coTypeExists("coA");
    test.expectThat.coTypeExists("coB");
    test.expectThat.coTypeExists("coC");
    test.expectThat.moveTypeExists("moveA");
    test.expectThat.moveTypeExists("moveB");
    test.expectThat.moveTypeExists("moveC");
    test.expectThat.unitTypeExists("unitA");
    test.expectThat.unitTypeExists("unitB");
    test.expectThat.unitTypeExists("unitC");
    test.expectThat.weatherTypeExists("weatherA");
    test.expectThat.weatherTypeExists("weatherB");
    test.expectThat.weatherTypeExists("weatherC");
    test.expectThat.movingUnit("unitA", "moveA", 10);
    test.expectThat.movingUnit("unitB", "moveB", 10);
    test.expectThat.movingUnit("unitC", "moveC", 10);
  }

  protected void prepareModel() {
  }
}
