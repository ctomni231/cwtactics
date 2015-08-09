package org.wolftec.cwt.i18n;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.system.Nullable;

public class LanguageManager implements Injectable {

  /**
   * Holds all available languages.
   */
  Map<String, Map<String, String>> languages;

  /**
   * The current active language.
   */
  Map<String, String>              selected;

  public LanguageManager() {
    languages = JSCollections.$map();
    selected = JSCollections.$map();
  }

  /**
   * Registers a language object. The properties of the object will be the keys
   * and its values the localized string for the key.
   */
  public void registerLanguage(String key, Map<String, String> obj) {
    Nullable.getOrThrow(key, "IllegalArgumentException: NoKey");
    Nullable.getOrThrow(obj, "IllegalArgumentException: NoData");

    if (Nullable.isPresent(languages.$get(key))) {
      JsUtil.throwError("IllegalArgumentException: KeyAlreadyRegistered");
    }

    Map<String, String> newLang = JSCollections.$map();
    JsUtil.forEachMapValue(obj, (skey, value) -> {
      newLang.$put(skey, value);
    });

    languages.$put(key, newLang);
  };

  /**
   * Selects a language by it's key.
   */
  public void selectLanguage(String key) {
    selected = Nullable.getOrThrow(languages.$get(key), "UnknownLanguage");
  };

  /**
   * Returns the localized string of a given identifier.
   */
  public String forKey(String key) {
    return Nullable.getOrElse(selected.$get(key), key);
  }
}
