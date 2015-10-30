package org.wolftec.wTec.i18;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.ObjectUtil;
import org.wolftec.wTec.ioc.Injectable;

public class LanguageManager implements Injectable {

  /**
   * Holds all available languages.
   */
  Map<String, Map<String, String>> languages;

  /**
   * The current active language.
   */
  Map<String, String> selected;

  public LanguageManager() {
    languages = JSCollections.$map();
    selected = JSCollections.$map();
  }

  /**
   * Registers a language object. The properties of the object will be the keys
   * and its values the localized string for the key.
   */
  public void registerLanguage(String key, Map<String, String> obj) {
    AssertUtil.assertThat(!NullUtil.isPresent(languages.$get(key)));
    Map<String, String> newLang = JSCollections.$map();

    ObjectUtil.forEachMapValue(obj, (skey, value) -> {
      newLang.$put(skey, value);
    });

    languages.$put(key, newLang);
  }

  /**
   * 
   * @param key
   * @return true if a language with the given key is loaded, else false
   */
  public boolean hasLanguage(String key) {
    return NullUtil.isPresent(languages.$get(key));
  }

  /**
   * Selects a language by it's key.
   */
  public void selectLanguage(String key) {
    Map<String, String> language = languages.$get(key);
    selected = NullUtil.getOrThrow(language);
  }

  /**
   * Returns the localized string of a given identifier.
   */
  public String forKey(String key) {
    return NullUtil.getOrElse(selected.$get(key), key);
  }
}
