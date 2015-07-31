package org.wolftec.cwt.loading;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.system.Localization;
import org.wolftec.cwt.system.Log;

public class LanguageSelector implements Loader {

  private Log          log;
  private Localization i18n;

  @Override
  public int priority() {
    return 10;
  }

  @Override
  public void onLoad(Callback0 done) {
    log.info("automatical select language by environment settings");

    // todo: recognize custom user selected language

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
