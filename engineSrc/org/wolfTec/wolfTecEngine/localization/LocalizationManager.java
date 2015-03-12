package org.wolfTec.wolfTecEngine.localization;

import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.JsExec;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.vfs.VirtualFilesystemManager;

/**
 * 
 */
@ManagedComponent
public class LocalizationManager implements Localization {

  @ManagedConstruction
  private Logger p_log;
  
  @Injected
  private VirtualFilesystemManager p_vfs;

  /**
   * The current active language.
   */
  private Map<String, String> language;

  @Override
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

  @Override
  public void selectLanguage(String language, Callback0 cb) {
    p_vfs.readFile("lang/lang_" + language, entry -> {
      if (entry.value != null) {
        this.language = (Map<String, String>) entry.value;
        cb.$invoke();
      }
      p_log.error("Could not load language from file system");
    });
  }

  @Override
  public String solveKey(String key) {
    String str = language.$get(key);
    return str != JSGlobal.undefined ? str : key;
  }
}
