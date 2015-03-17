package org.wolftec.cwtactics;

import org.wolftec.core.ComponentManager;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagerOptions;

public abstract class Game {

  private static ComponentManager engine;

  /**
   * 
   */
  public static void start() {
    if (engine != null) {
      JsUtil.raiseError("AlreadyInitialized");
    }

    // TODO
    ManagerOptions options = null;

    engine = new ComponentManager(options);
  }

  /**
   * 
   * @return
   */
  public static String getVersion() {
    return "CustomWars: Tactics " + EngineGlobals.VERSION;
  }

}
