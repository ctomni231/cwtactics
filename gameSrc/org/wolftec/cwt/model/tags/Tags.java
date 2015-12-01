package org.wolftec.cwt.model.tags;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.javascript.JsUtil;

public class Tags {

  private Array<TagValue> configurableValues;

  public Tags() {
    configurableValues = JSCollections.$array();
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

  public TagValue registerConfig(String key, int min, int max, int def, int step) {
    return registerConfigObject(new TagValue(key, min, max, def, step));
  }

  public TagValue registerConfigObject(TagValue cfg) {
    configurableValues.push(cfg);
    return cfg;
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
