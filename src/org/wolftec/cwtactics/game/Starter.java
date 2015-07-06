package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.game.core.CesKernel;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.event.SystemInitializedEvent;

/**
 * Starter class with main function.
 */
public class Starter {

  public static void main(String[] args) {
    CesKernel manager = new CesKernel();
    manager.initObjects(getNamespace(), getForcedSystems());
    manager.getEventEmitter(SystemInitializedEvent.class).onSystemInitialized();
    injectManagerIfNecessarry(manager);
  }

  private static void injectManagerIfNecessarry(CesKernel manager) {
    if (Constants.DEBUG) {
      JSObjectAdapter.$put(Global.window, "cwt_ces", manager);
    }
  }

  private static Object getNamespace() {
    return JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);
  }

  private static Array<String> getForcedSystems() {
    return JSStringAdapter.split(CheckedValue.of(BrowserUtil.getUrlParameter("forcedConstruction")).getOrElse(""), ",");
  }
}
