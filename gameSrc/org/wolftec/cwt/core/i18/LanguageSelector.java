package org.wolftec.cwt.core.i18;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.Log;
import org.wolftec.cwt.core.Option;
import org.wolftec.cwt.core.loading.GameLoader;
import org.wolftec.cwt.core.persistence.PersistenceManager;

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
    storage.get("cfg.language", (error, keyValue) -> {
      if (Option.ofNullable(keyValue).isPresent()) {
        tryToSelectLanguage((String) keyValue);
        done.$invoke();

      } else {
        switch (browserLanguage().orElse("en")) {

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
      }
    });
  }

  private Option<String> browserLanguage() {
    return Option.ofNullable((String) JSObjectAdapter.$js("window.navigator.userLanguage || window.navigator.language"));
  }
}
