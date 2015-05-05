package org.wolftec.cwtactics.gameold;

import org.wolftec.cwtactics.EngineGlobals;
import org.wolftec.cwtactics.engine.playground.Playground;

public abstract class CustomWarsTactics extends Playground {

  public static String getVersion() {
    return "CustomWars: Tactics " + EngineGlobals.VERSION;
  }

  @Override
  public void ready() {

  }
}
