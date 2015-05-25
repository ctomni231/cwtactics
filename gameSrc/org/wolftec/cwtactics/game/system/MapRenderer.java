package org.wolftec.cwtactics.game.system;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.playground.Playground;

public class MapRenderer implements ISystem, ConstructedClass {

  private Playground appRef;

  @Override
  public void onConstruction() {
    events().INIT_ENGINE.subscribe((app) -> {
      appRef = app;
    });

    events().INPUT_CANCEL.subscribe((app) -> {
      info("CLICK");

      int r = JSGlobal.parseInt(255 * Math.random(), 10);
      int g = JSGlobal.parseInt(255 * Math.random(), 10);
      int b = JSGlobal.parseInt(255 * Math.random(), 10);

      String color = "rgb(" + JSCollections.$array(r, g, b).join(", ") + ")";
      info("NEW COLOR: " + color);

      app.layer.clear(color);
    });
  }
}
