package org.wolftec.cwt.i18n;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.GameLoader;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class LanguageSelector implements GameLoader {

  private Log                log;
  private LanguageManager    i18n;
  private PersistenceManager storage;

  @Override
  public int priority() {
    return 1;
  }

  private void tryToSelectLanguage(String key) {
    if (i18n.hasLanguage(key)) {
      log.info("select language " + key);
      i18n.selectLanguage(key);
    }
  }

  @Override
  public void onLoad(Callback0 done) {
    storage.get("cfg.language", (key, keyValue) -> {
      Nullable.ifPresentOrElse(keyValue, (value) -> {
        tryToSelectLanguage((String) value);
        done.$invoke();

      }, () -> {
        switch (Nullable.getOrElse(browserLanguage(), "en")) {

          case "de":
          case "de-de":
          case "de-De":
          case "german":
          case "Deutsch":
            tryToSelectLanguage("de");
            break;

          case "en":
          default:
            tryToSelectLanguage("en");
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
