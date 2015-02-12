package org.wolfTec.cwt.game.localization;

import java.util.Iterator;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolfTec.cwt.game.assets.AssetItem;
import org.wolfTec.cwt.game.assets.AssetLoader;
import org.wolfTec.cwt.game.assets.AssetType;
import org.wolfTec.cwt.game.persistence.StorageBean;

public class LocalizationBean implements AssetLoader {

  /**
   * Holds all available languages.
   */
  private Map<String, Map<String, String>> languages;

  /**
   * The current active language.
   */
  private Map<String, String> selected;

  public LocalizationBean() {
    languages = JSCollections.$map();
    selected = null;
  }

  @Override
  public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.LANGUAGE) {

    }
  }

  @Override
  public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    if (item.type == AssetType.LANGUAGE) {

    }
  }

  /**
   * Registers a language object. The properties of the object will be the keys
   * and its values the localized string for the key.
   */
  public void registerLanguage(String key, Map<String, String> obj) {
    if (key == null || obj == null) {
      throw new Error("IllegalArgumentException");
    }
    if (JSObjectAdapter.hasOwnProperty(languages, key)) {
      throw new Error("LanguageAlreadyRegisteredException");
    }

    // copy keys and values to a fresh object
    Map<String, String> newLang = JSCollections.$map();
    Iterator<String> langIt = languages.iterator();
    while (langIt.hasNext()) {
      String langItemKey = langIt.next();
      newLang.$put(langItemKey, obj.$get(langItemKey));
    }

    // register it
    languages.$put(key, newLang);
  }

  /**
   * Selects a language by it's key.
   */
  public void selectLanguage(String language) {
    if (!JSObjectAdapter.hasOwnProperty(languages, language)) {
      throw new IllegalArgumentException("unknown language");
    }
    selected = languages.$get(language);
  }

  /**
   * Returns the localized string of a given identifier.
   */
  public String solveKey(String key) {
    if (selected == null) return key;
    String str = selected.$get(key);
    return str != null ? str : key;
  }
}
