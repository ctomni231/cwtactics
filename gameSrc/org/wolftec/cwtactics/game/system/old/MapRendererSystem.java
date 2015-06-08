package org.wolftec.cwtactics.game.system.old;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.game.ISystem;

public class MapRendererSystem implements ISystem, ConstructedClass {

  @Override
  public void onConstruction() {
    events().INPUT_CANCEL.subscribe(this::renderRandomBackgroundColor);
  }

  public void renderRandomBackgroundColor(Playground app) {
    info("Changing background color");

    int r = JSGlobal.parseInt(255 * Math.random(), 10);
    int g = JSGlobal.parseInt(255 * Math.random(), 10);
    int b = JSGlobal.parseInt(255 * Math.random(), 10);

    String color = "rgb(" + JSCollections.$array(r, g, b).join(", ") + ")";

    app.layer.clear(color);
  }
}
