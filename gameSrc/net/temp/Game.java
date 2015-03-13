package net.temp;

import net.temp.wolfTecEngine.Engine;

import org.stjs.javascript.JSGlobal;
import org.wolftec.core.ManagerOptions;

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
    ManagerOptions options = null;
    
    engine = new Engine(options);
  }

}
