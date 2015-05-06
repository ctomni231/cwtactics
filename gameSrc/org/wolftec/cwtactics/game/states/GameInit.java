package org.wolftec.cwtactics.game.states;

import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.playground.PlaygroundState;

public class GameInit extends PlaygroundState implements ConstructedClass {

  @Override
  public void enter() {
  }

  @Override
  public void render() {
    app.layer.clear("black");
  }

}
