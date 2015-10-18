package org.wolftec.cwt.core.config;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.ioc.ObservesIocState;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.NullUtil;

public class ConfigurableValueManager implements Injectable, ObservesIocState {

  private Log log;

  private Array<ConfigurationProvider> configHolders;
  private Array<ConfigurableValue>     configurableValues;

  @Override
  public void onIocReady() {
    configurableValues = collectAllConfigValues(configHolders);

    // no longer needed => free reference
    configHolders = null;
  }

  /**
   * Collects all {@link ConfigurableValue} objects from {@link Injectable}
   * classes and puts them into a list.
   */
  private Array<ConfigurableValue> collectAllConfigValues(Array<ConfigurationProvider> injectables) {
    Array<ConfigurableValue> values = JSCollections.$array();
    ListUtil.forEachArrayValue(injectables, (index, configHolder) -> {
      ClassUtil.forEachClassProperty(ClassUtil.getClass(configHolder), (prop, defValue) -> {
        Object value = JSObjectAdapter.$get(configHolder, prop);
        if (NullUtil.isPresent(value) && value instanceof ConfigurableValue) {
          log.info("adding config value " + prop);

          values.push((ConfigurableValue) value);
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

  public void forEachConfig(Callback1<ConfigurableValue> iterator) {
    configurableValues.forEach(iterator);
  }
}
