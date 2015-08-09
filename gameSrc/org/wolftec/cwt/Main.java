package org.wolftec.cwt;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.ioc.IoCConfiguration;
import org.wolftec.cwt.core.ioc.IoCContainer;

public class Main {

  public static void main(String[] args) {
    createIocContainer();
    // TODO init statemachine
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
