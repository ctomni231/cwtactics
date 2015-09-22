package org.wolftec.cwt.config;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.ListUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.ClassUtil;

public class ConfigurableValueManager implements Injectable {

  private Array<ConfigurationProvider> configHolders;
  private Array<ConfigurableValue>     configurableValues;

  @Override
  public void onConstruction() {
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
        if (value instanceof ConfigurableValue) {
          values.push((ConfigurableValue) value);
        }
      });
    });
    return values;
  }
}
