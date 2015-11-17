package org.wolftec.cwt.core;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.annotations.OptionalReturn;

public class Properties {

  /**
   * keys and localized values.
   */
  Map<String, String> data;

  public Properties() {
    data = JSCollections.$map();
  }

  public void put(String key, String value) {
    AssertUtil.assertThat(NullUtil.isPresent(key) && NullUtil.isPresent(value));
    data.$put(key, value);
  }

  @OptionalReturn
  public String get(String key) {
    return data.$get(key);
  }
}
