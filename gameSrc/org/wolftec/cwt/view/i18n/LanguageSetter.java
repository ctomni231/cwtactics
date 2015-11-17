package org.wolftec.cwt.view.i18n;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.AsyncCallback;
import org.wolftec.cwt.core.annotations.AsyncOperation;
import org.wolftec.cwt.core.annotations.OptionalReturn;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.log.LogFactory;
import org.wolftec.cwt.core.persistence.FolderStorage;

public class LanguageSetter {

  private Log log;
  private FolderStorage storage;

  public LanguageSetter() {
    log = LogFactory.byClass(LanguageSetter.class);
    storage = new FolderStorage("cfg/");
  }

  @AsyncOperation
  public void setLanguageForActiveEnvironment(LanguageBundle bundle, @AsyncCallback Callback0 done) {
    storage.readFile("language", (keyValue) -> {
      if (NullUtil.isPresent(keyValue)) {
        tryToSelectLanguage(bundle, (String) keyValue);
        done.$invoke();

      } else {
        switch (NullUtil.getOrElse(browserLanguage(), "en")) {

          case "de":
          case "de-de":
          case "de-De":
          case "german":
          case "Deutsch":
            tryToSelectLanguage(bundle, "de");
            break;

          case "en":
          default:
            tryToSelectLanguage(bundle, "en");
            break;
        }

        done.$invoke();
      }
    } , JsUtil.throwErrorCallback());
  }

  private void tryToSelectLanguage(LanguageBundle bundle, String key) {
    if (bundle.hasLanguage(key)) {
      log.info("select language " + key);
      bundle.setLanguage(key);

    } else {
      log.info("could not select language " + key + " because it does not exists");
    }
  }

  @OptionalReturn
  private String browserLanguage() {
    return (String) JSObjectAdapter.$js("window.navigator.userLanguage || window.navigator.language");
  }
}
