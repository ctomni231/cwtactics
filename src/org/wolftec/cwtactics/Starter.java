package org.wolftec.cwtactics;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.JSStringAdapter;
import org.wolftec.cwtactics.engine.util.BrowserUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;
import org.wolftec.cwtactics.game.core.Kernel;
import org.wolftec.cwtactics.game.event.system.SystemInitializedEvent;

/**
 * Starter class with main function.
 */
public class Starter {
  public static void main(String[] args) {
    Array<Object> namespaces = systemNamespaces();
    Kernel kernel;

    kernel = createKernel(namespaces);
    mayPublishKernelInNamespace(kernel, cwtNamespace());
    publishReadyEvent(kernel);
  }

  private static Kernel createKernel(Array<Object> namespaces) {
    Kernel kernel = new Kernel();
    kernel.init(namespaces);
    return kernel;
  }

  private static void publishReadyEvent(Kernel kernel) {
    kernel.getSysEventManager().getEventNodeAsPublisher(SystemInitializedEvent.class).onSystemInitialized();
  }

  private static void mayPublishKernelInNamespace(Kernel kernel, Object namespace) {
    if (Constants.DEBUG) {
      JSObjectAdapter.$put(namespace, "__kernel__", kernel);
    }
  }

  private static Array<Object> systemNamespaces() {
    Array<Object> result = JSCollections.$array();

    result.push(cwtNamespace());
    Array<String> additionalNamespaces = JSStringAdapter.split(CheckedValue.of(BrowserUtil.getUrlParameter("forcedConstruction")).getOrElse(""), ",");
    additionalNamespaces.$forEach((namespace) -> {
      if (namespace.length() > 0) {
        result.push(JSObjectAdapter.$get(Global.window, namespace));
      }
    });

    return result;
  }

  private static Object cwtNamespace() {
    return JSObjectAdapter.$get(Global.window, Constants.NAMESPACE);
  }
}
