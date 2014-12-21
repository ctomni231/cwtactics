package net.wolfTec.utility;

import net.wolfTec.bridges.Globals;
import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

/**
 *
 */
public class Storage {

    @SyntheticType
    public static class StorageEntry {
        public String key;
        public Object value;
    }

    /**
     * iOS 7 has a serious bug which makes unable to get the permission to increase the internal
     * persistent storage above 5MB. To prevent that bug we simply use 4 MB as storage. If the
     * pre-set size of the storage is below 5MB then iOS7 creates a database that can be filled
     * up to 50MB without any permission. Strange? Yes it is!
     */
    public static final int IOS7_WEBSQL_BUGFIX_SIZE = 4;

    /**
     * Maximum size of the application storage.
     */
    public static final int DEFAULT_DB_SIZE = 50;

    static {

        // generate config object for Mozilla localForage
        Map<String, Object> config = JSCollections.$map();
        config.$put("name", "CWT_DATABASE");
        config.$put("size", (1 == 2 ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE * 1024 * 1024));

        Globals.localForage.config(config);
    }


    /**
     * The given callback will be invoked with the value saved by the given key.
     */
    public static void get(String key, Callback1<StorageEntry> callback) {
        Globals.localForage.getItem(key, callback);
    }

    /**
     * Saves a value with a given key. If the key exists, then the old value
     * will be overwritten. After the saveGameConfig process, the callback will be invoked.
     */ 
    public static <T> void set(final String key, final T value, final Callback2<Object, Object> callback) { 
        Globals.localForage.setItem(key, value, new Callback2<Object, Object>() {
            @Override public void $invoke(Object result, Object error) {

                // try a second time when fail at the first time because on ios the question
                // for more storage invokes an error => we don't want to need to reload then
                if (error != null) {
                    Globals.localForage.setItem(key, value, callback);

                } else {
                    callback.$invoke(result, null);
                }
            }
        });
    }

    /**
     * The given callback will be invoked with a list of all keys that are saved in the storage.
     */
    public static void keys(Callback1<Array<String>> callback) {
        Globals.localForage.keys(callback);
    }

    /**
     * Clears all values from the storage. The given callback will be invoked afterwards.
     */
    public static void clear(Callback0 callback) {
        Globals.localForage.clear(callback);
    }

    /**
     * Removes a key including the saved value from the storage. The given callback will
     * be invoked afterwards.
     */
    public static void remove(String key, Callback0 callback) {
        Globals.localForage.removeItem(key, callback);
    }
}
