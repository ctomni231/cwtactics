package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.core.ConstructedClass;

public class MapRendererSystem implements ISystem, ConstructedClass {
  //
  // @Override
  // public void onConstruction() {
  // events().INPUT_CANCEL.subscribe(this::renderRandomBackgroundColor);
  // }
  //
  // public void renderRandomBackgroundColor(Playground app) {
  // info("Changing background color");
  //
  // int r = JSGlobal.parseInt(255 * Math.random(), 10);
  // int g = JSGlobal.parseInt(255 * Math.random(), 10);
  // int b = JSGlobal.parseInt(255 * Math.random(), 10);
  //
  // String color = "rgb(" + JSCollections.$array(r, g, b).join(", ") + ")";
  //
  // app.layer.clear(color);
  // }
}
