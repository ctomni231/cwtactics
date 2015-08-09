package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.BrowserUtil;
import org.wolftec.cwt.core.ioc.IoCConfiguration;
import org.wolftec.cwt.core.ioc.IoCContainer;

public class Main {

  public static void main(String[] args) {
    long ts;

    ts = BrowserUtil.getTimestamp();
    createIocContainer();
    // TODO init statemachine
    ts = BrowserUtil.getTimestamp() - ts;

    Global.console.log("STARTUP " + ts + "ms");
  }

  private static void createIocContainer() {
    IoCContainer ct = new IoCContainer();
    ct.initByConfig(createIoCConfig());
    if (Constants.DEBUG) {
      JSObjectAdapter.$put(Global.window, "__ioc__", ct);
    }
  }

  private static IoCConfiguration createIoCConfig() {
    IoCConfiguration cfg = new IoCConfiguration();
    cfg.namespaces = JSCollections.$array(Constants.NAMESPACE);
    return cfg;
  }
}
