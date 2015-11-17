package org.wolftec.cwt.model.tags;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.collection.ListUtil;
import org.wolftec.cwt.core.javascript.ClassUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.managed.ObservesIocState;

public class ConfigurationManager implements ManagedClass, ObservesIocState {

  private Log log;

  private Array<Configurable> configHolders;
  private Array<TagValue> configurableValues;

  @Override
  public void onIocReady() {
    configurableValues = collectAllConfigValues(configHolders);

    // no longer needed => free reference
    configHolders = null;
  }

  /**
   * Collects all {@link TagValue} objects from {@link ManagedClass}
   * classes and puts them into a list.
   */
  private Array<TagValue> collectAllConfigValues(Array<Configurable> injectables) {
    Array<TagValue> values = JSCollections.$array();
    ListUtil.forEachArrayValue(injectables, (index, configHolder) -> {
      ClassUtil.forEachClassProperty(ClassUtil.getClass(configHolder), (prop, defValue) -> {
        Object value = JSObjectAdapter.$get(configHolder, prop);
        if (NullUtil.isPresent(value) && value instanceof TagValue) {
          log.info("adding config value " + prop);

          values.push((TagValue) value);
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

  public void forEachConfig(Callback1<TagValue> iterator) {
    configurableValues.forEach(iterator);
  }

  public TagValue getConfig(String cfgKey) {
    for (int i = 0; i < configurableValues.$length(); i++) {
      TagValue cfg = configurableValues.$get(i);
      if (cfg.key == cfgKey) {
        return cfg;
      }
    }
    return JsUtil.throwError("unknown config key '" + cfgKey + "'");
  }
}
