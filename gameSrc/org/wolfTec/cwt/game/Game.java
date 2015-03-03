package org.wolfTec.cwt.game;

import org.stjs.javascript.JSGlobal;
import org.wolfTec.wolfTecEngine.Engine;
import org.wolfTec.wolfTecEngine.EngineOptions;

public abstract class Game {

  public String getVersion() {
    String text = "";
    text += "CustomWars: Tactics " + EngineGlobals.VERSION + " ";
    text += "running on the WolfTec engine " + Engine.VERSION;
    return text;
  }

  private static Engine engine;

  public static void start() {
    if (engine != null) {
      JSGlobal.stjs.exception("AlreadyInitialized");
    }

    // TODO
    EngineOptions options = null;
    
    engine = new Engine(options);
  }

}
