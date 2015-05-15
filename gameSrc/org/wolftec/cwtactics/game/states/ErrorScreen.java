package org.wolftec.cwtactics.game.states;

import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;

public class ErrorScreen extends PlaygroundState implements ConstructedClass {

  public String errorMsg;

  @Override
  public void onConstruction() {
    errorMsg = null;
  }

  @Override
  public void enter() {
  }

  @Override
  public void render() {
    app.layer.clear("black").fillStyle("red").font("24pt Arial").fillText("An error occured", 60, 228).fillText(errorMsg, 120, 270);
  }
}
