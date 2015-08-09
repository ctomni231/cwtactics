package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.ioc.IoCConfiguration;
import org.wolftec.cwt.core.ioc.IoCContainer;
import org.wolftec.cwt.states.StateManager;
import org.wolftec.cwt.states.start.NoneState;

public class Main {

  public static void main(String[] args) {
    long ts;

    ts = BrowserUtil.getTimestamp();
    IoCContainer ioc = createIocContainer();
    ioc.getManagedObjectByType(StateManager.class).setState(NoneState.class, true);
    ioc.getManagedObjectByType(GameLoopManager.class).start();
    ts = BrowserUtil.getTimestamp() - ts;

    Global.console.log("STARTUP " + ts + "ms");
  }

  private static IoCContainer createIocContainer() {
    IoCContainer ct = new IoCContainer();
    ct.initByConfig(createIoCConfig());
    if (Constants.DEBUG) {
      JSObjectAdapter.$put(Global.window, "__ioc__", ct);
    }
    return ct;
  }

  private static IoCConfiguration createIoCConfig() {
    IoCConfiguration cfg = new IoCConfiguration();
    cfg.namespaces = JSCollections.$array(Constants.NAMESPACE);
    return cfg;
  }
}
