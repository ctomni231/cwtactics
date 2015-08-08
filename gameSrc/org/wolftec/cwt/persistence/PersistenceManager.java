package org.wolftec.cwt.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.wolftec.cwt.core.Injectable;
import org.wolftec.cwt.system.Features;

public class PersistenceManager implements Injectable {

  /**
   * iOS 7 has a serious bug which makes unable to get the permission to
   * increase the internal persistent storage above 5MB. To prevent that bug we
   * simply use 4 MB as storage. If the pre-set size of the storage is below 5MB
   * then iOS7 creates a database that can be filled up to 50MB without any
   * permission. Strange? Yes it is!
   */
  public static final int IOS7_WEBSQL_BUGFIX_SIZE = 4;

  /**
   * Maximum size of the application stoarge.
   */
  public static final int DEFAULT_DB_SIZE         = 50;

  private Features        features;

  @Override
  public void onConstruction() {
    LocalForageConfig config = new LocalForageConfig();
    config.name = "CWT_DATABASE";
    config.size = (features.iosWebSQLFix ? IOS7_WEBSQL_BUGFIX_SIZE : DEFAULT_DB_SIZE) * 1024 * 1024;
    LocalForage.localforage.config(config);
  }

  /**
   * The given callback will be invoked with the value saved by the given key.
   * 
   * @param key
   * @param callback
   */
  public void get(String key, Callback2<String, Object> callback) {
    LocalForage.localforage.getItem(key, callback);
  }

  /**
   * Saves a value with a given key. If the key exists, then the old value will
   * be overwritten. After the save process, the callback will be invoked.
   * 
   * @param key
   * @param value
   * @param callback
   */
  public void set(String key, Object value, Callback2<String, Object> callback) {
    LocalForage.localforage.setItem(key, value, (error, res) -> {

      /*
       * try a second time when fail at the first time because on ios the
       * question for more storage invokes an error => we don't want to need to
       * reload then
       */
      if (error != null) {
        LocalForage.localforage.setItem(key, value, callback);

      } else {
        callback.$invoke(error, res);
      }
    });
  }

  /**
   * The given callback will be invoked with a list of all keys that are saved
   * in the storage.
   * 
   * @param callback
   */
  public void keys(Callback2<String, Array<String>> callback) {
    LocalForage.localforage.keys(callback);
  }

  /**
   * Clears all values from the storage. The given callback will be invoked
   * afterwards.
   * 
   * @param callback
   */
  public void clear(Callback1<String> callback) {
    LocalForage.localforage.clear(callback);
  }

  /**
   * Removes a key including the saved value from the storage. The given
   * callback will be invoked afterwards.
   * 
   * @param key
   * @param callback
   */
  public void remove(String key, Callback1<String> callback) {
    LocalForage.localforage.removeItem(key, callback);
  }
}
