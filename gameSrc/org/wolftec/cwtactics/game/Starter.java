package org.wolftec.cwtactics.game;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSStringAdapter;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.game.core.ConstructedFactory;
import org.wolftec.cwtactics.game.event.SystemStartEvent;

/**
 * Starter class with main function.
 */
public class Starter {
  public static void main(String[] args) {
    String forcedParam = BrowserUtil.getUrlParameterMap().$get("forcedConstruction");
    Array<String> forcedConst = forcedParam != JSGlobal.undefined ? JSStringAdapter.split(forcedParam, ",") : JSCollections.$array();
    ConstructedFactory.initObjects(forcedConst);
    ConstructedFactory.getObject(EventEmitter.class).publish(SystemStartEvent.class).onSystemInitialized();
  }
}
