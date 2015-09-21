package org.wolftec.cwt.test.tools;

import org.wolftec.cwt.core.test.Test;
import org.wolftec.cwt.model.ModelManager;
import org.wolftec.cwt.model.ModelResetter;
import org.wolftec.cwt.sheets.SheetManager;

public abstract class AbstractCwtTest implements Test {

  private SheetManager  sheets;
  private ModelResetter modelReset;
  private ModelManager  model;

  protected AssertionStub assertModel() {
    return new AssertionStub(model);
  }

  protected ExpectationStub expect() {
    return new ExpectationStub();
  }

  @Override
  public void beforeTest() {
    modelReset.reset();
    model.mapHeight = 40;
    model.mapWidth = 40;
    model.weather = sheets.weathers.get("WSUN");
    model.weatherLeftDays = 4;

    model.forEachTile((x, y, tile) -> {
      tile.type = sheets.tiles.get("PLIN");
    });
  }
}
