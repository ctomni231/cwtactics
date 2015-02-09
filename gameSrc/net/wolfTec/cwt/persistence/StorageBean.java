package net.wolfTec.cwt.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolfTec.utility.Bean;

@Bean public class StorageBean {

  /**
   * iOS 7 has a serious bug which makes unable to get the permission to
   * increase the internal persistent storage above 5MB. To prevent that bug we
   * simply use 4 MB as storage. If the pre-set size of the storage is below 5MB
   * then iOS7 creates a database that can be filled up to 50MB without any
   * permission. Strange? Yes it is!
   */
  public static final int IOS7_WEBSQL_BUGFIX_SIZE = 4;

  /**
   * Maximum size of the application storage.
   */
  public static final int DEFAULT_DB_SIZE = 50;

  static {

    Map<String, Object> config = JSCollections.$map();
    config.$put("name", "CWT_DATABASE");
    config.$put("size", (1 == 2 ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE * 1024 * 1024));

    JSObjectAdapter.$js("localForage.config(config)");
  }

  /**
   * The given callback will be invoked with the value saved by the given key.
   */
  public <T> void get(String key, Callback1<StorageEntry<T>> callback) {
    JSObjectAdapter.$js("localForage.getItem(key, callback)");
  }

  /**
   * Saves a value with a given key. If the key exists, then the old value will
   * be overwritten. After the saveGameConfig process, the callback will be
   * invoked.
   */
  public <T> void set(final String key, final T value, final Callback2<Object, Object> callback) {

    Callback2<StorageEntry<?>, Object> safeCb = (result, error) -> {
      // try a second time when fail at the first time because on ios the
      // question for more storage invokes an error => we don't want to
      // need to reload then
      if (error != null) {
        JSObjectAdapter.$js("localForage.setItem(key, value, callback)");
      } else {
        callback.$invoke(result, null);
      }
    };

    JSObjectAdapter.$js("localForage.setItem(key, value, callback)");
  }

  /**
   * The given callback will be invoked with a list of all keys that are saved
   * in the storage.
   */
  public void keys(Callback1<Array<String>> callback) {
    JSObjectAdapter.$js("localForage.keys(callback)");
  }

  /**
   * Clears all values from the storage. The given callback will be invoked
   * afterwards.
   */
  public void clear(Callback0 callback) {
    JSObjectAdapter.$js("localForage.clear(callback)");
  }

  /**
   * Removes a key including the saved value from the storage. The given
   * callback will be invoked afterwards.
   */
  public void remove(String key, Callback0 callback) {
    JSObjectAdapter.$js("localForage.removeItem(key, callback)");
  }

}
