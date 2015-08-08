package org.wolftec.cwt.i18n;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.loading.Loader;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class LanguageSelector implements Loader {

  private Log                log;
  private LanguageManager    i18n;
  private PersistenceManager storage;

  @Override
  public int priority() {
    return 10;
  }

  @Override
  public void onLoad(Callback0 done) {
    log.info("automatical select language by environment settings");

    storage.get("cfg.language", (key, keyValue) -> {
      Nullable.ifPresentOrElse(keyValue, (value) -> {
        i18n.selectLanguage((String) value);
        done.$invoke();

      }, () -> {
        switch (Nullable.getOrElse(browserLanguage(), "en")) {

          case "de":
          case "de-de":
          case "de-De":
          case "german":
          case "Deutsch":
            i18n.selectLanguage("de");
            break;

          case "en":
          default:
            i18n.selectLanguage("en");
            break;
        }
        done.$invoke();
      });
    });
  }

  private String browserLanguage() {
    return (String) JSObjectAdapter.$js("window.navigator.userLanguage || window.navigator.language");
  }
}
