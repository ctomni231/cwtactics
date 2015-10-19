package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.ioc.IoCConfiguration;
import org.wolftec.cwt.core.ioc.IoCContainer;
import org.wolftec.cwt.core.state.StateManager;
import org.wolftec.cwt.core.util.JsUtil;

public class Main {

  public static void main(String[] args) {
    long ts;

    ts = JsUtil.getTimestamp();
    IoCContainer ioc = createIocContainer();
    // The main game itself...
    ioc.getManagedObjectByType(StateManager.class).setState("NoneState", true);
    // Just so JSR can test... comment out to see what JSR is up to. (Need to
    // start using testing functions)
    // ioc.getManagedObjectByType(StateManager.class).setState("TempState",
    // true);
    ioc.getManagedObjectByType(GameLoopManager.class).start();
    ts = JsUtil.getTimestamp() - ts;

    Global.console.log("STARTUP " + ts + "ms");
  }

  private static IoCContainer createIocContainer() {
    IoCContainer ct = new IoCContainer();
    ct.initByConfig(createIoCConfig());
    if (Constants.DEBUG) {
      JSObjectAdapter.$put(Global.window, "__ioc__", ct);
      JSObjectAdapter.$put(Global.window, "__dev__", ct.getManagedObjectByType(DevDebug.class));
    }

    return ct;
  }

  private static IoCConfiguration createIoCConfig() {
    IoCConfiguration cfg = new IoCConfiguration();
    cfg.namespaces = JSCollections.$array(Constants.NAMESPACE);
    return cfg;
  }
}
