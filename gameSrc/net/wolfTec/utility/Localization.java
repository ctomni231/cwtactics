package net.wolfTec.utility;

import net.wolfTec.Constants;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

import java.util.Iterator;

public class Localization {

    public static final String LOG_HEADER = Constants.logHeader("localization");

    /**
     * Holds all available languages.
     */
    private Map<String, Map<String, String>> languages = JSCollections.$map();

    /**
     * The current active language.
     */
    private Map<String, String> selected;

    /**
     * Registers a language object. The properties of the object will be the keys and its
     * values the localized string for the key.
     */
    public void registerLanguage(String key, Map<String, String> obj) {
        if (key == null || obj == null) Debug.logCritical(LOG_HEADER, "IllegalArgumentException");
        if (JSObjectAdapter.hasOwnProperty(languages, key)) {
            Debug.logCritical(LOG_HEADER, "LanguageAlreadyRegisteredException");
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
    public void selectLanguage(String key) {
        if (!JSObjectAdapter.hasOwnProperty(languages, key)) throw new IllegalArgumentException("unknown language");
        selected = languages.$get(key);
    }

    /**
     * Returns the localized string of a given identifier.
     */
    public String forKey(String key) {
        if (selected == null) return key;
        String str = selected.$get(key);
        return str != null ? str : key;
    }
}
