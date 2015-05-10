package org.wolftec.cwtactics.game.states;

import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;

public class StartScreen extends PlaygroundState implements ConstructedClass {

  @Override
  public void enter() {
  }

  @Override
  public void render() {
    app.layer.clear("black").fillStyle("white").font("24pt Arial").fillText("Custom Wars: Tactics", 60, 228).fillText("Development Version", 120, 270);
  }
}
