package org.wolftec.wCore.i18n;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.VirtualFilesystemManager;

/**
 * 
 */
public class LocalizationManager {

  @ManagedConstruction
  private Logger log;

  @Injected
  private VirtualFilesystemManager vfs;

  @Injected
  private LanguageFileConverter converter;

  /**
   * The current active language.
   */
  private Map<String, String> language;

  public void autoSelectLanguage(Callback0 cb) {
    selectLanguage(getBrowserLanguage(), cb);
  }

  /**
   * 
   * @return language that is set in the active browser like "de"
   */
  public String getBrowserLanguage() {
    return JsExec.injectJS("navigator.language || navigator.userLanguage");
  }

  /**
   * Selects a language by it's key.
   */
  public void selectLanguage(String language, Callback0 cb) {
    vfs.readKey("lang/lang_" + language, converter, (err, langFile) -> {
      if (langFile.value != null) {
        this.language = langFile.value;
        cb.$invoke();

      } else {
        log.error("Could not load language from file system");
      }
    });
  }

  /**
   * Returns the localized string of a given identifier.
   */
  public String solveKey(String key) {
    String str = language.$get(key);
    return str != JSGlobal.undefined ? str : key;
  }
}
