package org.wolftec.cwt.view.i18n;

import org.stjs.javascript.Map;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.ObjectUtil;
import org.wolftec.cwt.core.Properties;
import org.wolftec.cwt.core.annotations.OptionalField;

public class LanguageBundle {

  private Map<String, Properties> languages;

  @OptionalField private Properties language;

  public void registerLanguage(String languageKey, Map<String, String> data) {
    AssertUtil.assertThat(!NullUtil.isPresent(languages.$get(languageKey)));
    Properties props = new Properties();
    ObjectUtil.forEachMapValue(data, (skey, value) -> props.put(skey, value));
    languages.$put(languageKey, props);
  }

  public boolean hasLanguage(String key) {
    return NullUtil.isPresent(languages.$get(key));
  }

  /**
   * Selects a language by it's key.
   */
  public void setLanguage(String key) {
    language = NullUtil.getOrThrow(languages.$get(key));
  }

  /**
   * 
   * @param key
   * @return localized value or key if localized value does not exists
   */
  public String resolve(String key) {
    return NullUtil.getOrElse(language.get(key), key);
  }
}
