package org.wolftec.cwt.tags;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.managed.ObservesIocState;
import org.wolftec.cwt.util.ClassUtil;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;

public class ConfigurationManager implements ManagedClass, ObservesIocState {

  private Log log;

  private Array<Configurable> configHolders;
  private Array<Configuration> configurableValues;

  @Override
  public void onIocReady() {
    configurableValues = collectAllConfigValues(configHolders);

    // no longer needed => free reference
    configHolders = null;
  }

  /**
   * Collects all {@link Configuration} objects from {@link ManagedClass}
   * classes and puts them into a list.
   */
  private Array<Configuration> collectAllConfigValues(Array<Configurable> injectables) {
    Array<Configuration> values = JSCollections.$array();
    ListUtil.forEachArrayValue(injectables, (index, configHolder) -> {
      ClassUtil.forEachClassProperty(ClassUtil.getClass(configHolder), (prop, defValue) -> {
        Object value = JSObjectAdapter.$get(configHolder, prop);
        if (NullUtil.isPresent(value) && value instanceof Configuration) {
          log.info("adding config value " + prop);

          values.push((Configuration) value);
        }
      });
    });
    return values;
  }

  /**
   * Resets all registered configuration objects to their default value.
   */
  public void resetGameOptions() {
    forEachConfig((cfg) -> {
      if (!cfg.key.startsWith("app.")) {
        cfg.value = cfg.def;
      }
    });
  }

  public void forEachConfig(Callback1<Configuration> iterator) {
    configurableValues.forEach(iterator);
  }

  public Configuration getConfig(String cfgKey) {
    for (int i = 0; i < configurableValues.$length(); i++) {
      Configuration cfg = configurableValues.$get(i);
      if (cfg.key == cfgKey) {
        return cfg;
      }
    }
    return JsUtil.throwError("unknown config key '" + cfgKey + "'");
  }
}
