package org.wolfTec.wolfTecEngine.localization;

import org.stjs.javascript.functions.Callback0;

public interface Localization {

  public abstract void autoSelectLanguage(Callback0 cb);

  /**
   * Selects a language by it's key.
   */
  public abstract void selectLanguage(String language, Callback0 cb);

  /**
   * Returns the localized string of a given identifier.
   */
  public abstract String solveKey(String key);

}