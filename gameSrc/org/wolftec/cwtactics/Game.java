package org.wolftec.cwtactics;

import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.core.ManagerOptions;

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

    engine.onPostInit = (manager) -> {
      // TODO manually init wCore and wPlay components
    };
  }

  /**
   * 
   * @return
   */
  public static String getVersion() {
    return "CustomWars: Tactics " + EngineGlobals.VERSION;
  }

}
