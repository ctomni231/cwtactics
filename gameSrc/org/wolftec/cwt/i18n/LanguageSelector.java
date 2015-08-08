package org.wolftec.cwt.i18n;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.loading.Loader;
import org.wolftec.cwt.system.Log;

public class LanguageSelector implements Loader {

  private Log          log;
  private LanguageManager i18n;

  @Override
  public int priority() {
    return 10;
  }

  @Override
  public void onLoad(Callback0 done) {
    log.info("automatical select language by environment settings");

    // TODO recognize custom user selected language

    String language = JSObjectAdapter.$js("window.navigator.userLanguage || window.navigator.language");
    String key;

    switch (language) {

      case "de":
      case "de-de":
      case "de-De":
      case "german":
      case "Deutsch":
        key = "de";
        break;

      case "en":
      default:
        key = "en";
        break;
    }

    i18n.selectLanguage(key);

    done.$invoke();
  }
}
