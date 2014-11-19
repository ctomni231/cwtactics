package net.wolfTec.utility;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

import java.util.Iterator;

public class Localization {

    /**
     * Holds all available languages.
     */
    private static Map<String, Map<String, String>> languages = JSCollections.$map();

    /**
     * The current active language.
     */
    private static Map<String, String> selected;

    /**
     * Registers a language object. The properties of the object will be the keys and its
     * values the localized string for the key.
     */
    public static void registerLanguage(String key, Map<String, String> obj) {
        if (key == null || obj == null) Debug.logCritical("IllegalArgumentException");
        if (JSObjectAdapter.hasOwnProperty(languages, key)) Debug.logCritical("LanguageAlreadyRegisteredException");

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
    public static void selectLanguage(String key) {
        if (!JSObjectAdapter.hasOwnProperty(languages, key)) throw new IllegalArgumentException("unknown language");
        selected = languages.$get(key);
    }

    /**
     * Returns the localized string of a given identifier.
     */
    public static String forKey(String key) {
        if (selected == null) return key;
        String str = selected.$get(key);
        return str != null ? str : key;
    }
}
