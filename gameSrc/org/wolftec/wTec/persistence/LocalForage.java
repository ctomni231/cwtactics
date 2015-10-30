package org.wolftec.wTec.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function3;

@GlobalScope
@STJSBridge
public class LocalForage {

  public Integer            LOCALSTORAGE;
  public Integer            WEBSQL;
  public Integer            INDEXEDDB;

  public static LocalForage localforage;

  /**
   * Set and persist localForage options. This must be called before any other
   * calls to localForage are made, but can be called after localForage is
   * loaded. If you set any config values with this method they will persist
   * after driver changes, so you can call <code>config()</code> then
   * <code>setDriver()</code>. The following config values can be set:
   * 
   * @param config
   */
  public native void config(LocalForageConfig config);

  /**
   * Force usage of a particular driver or drivers, if available.
   * 
   * By default, localForage selects backend drivers for the datastore in this
   * order:
   * 
   * <ul>
   * <li>IndexedDB</li>
   * <li>WebSQL</li>
   * <li>localStorage</li>
   * </ul>
   * 
   * If you would like to force usage of a particular driver you can use
   * setDriver() with one or more of the following parameters.
   * 
   * <ul>
   * <li>localforage.INDEXEDDB</li>
   * <li>localforage.WEBSQL</li>
   * <li>localforage.LOCALSTORAGE</li>
   * </ul>
   * 
   * If the backend you’re trying to load isn’t available on the user’s browser,
   * localForage will continue to use whatever backend driver it was previously
   * using. This means that if you try to force a Gecko browser to use WebSQL,
   * it will fail and continue using IndexedDB.
   * 
   * @param driverId
   */
  public native void setDriver(Integer driverId);

  /**
   * Supply a list of drivers, in order of preference.
   * 
   * further see setDriver(int) for more information.
   * 
   * @param driverId
   */
  public native void setDriver(Array<Integer> driverId);

  /**
   * Gets an item from the storage library and supplies the result to a
   * callback. If the key does not exist, getItem() will return null.
   * 
   * Even if undefined is saved, null will be returned by getItem(). This is due
   * to a limitation in localStorage, and for compatibility reasons localForage
   * cannot store the value undefined.
   * 
   * @param key
   * @param callback
   *          (error, value)
   */
  public native <T> void getItem(String key, Callback2<String, T> successCallback);

  /**
   * Saves data to an offline store. You can store the following types of
   * JavaScript objects:
   * 
   * <ul>
   * <li>Array</li>
   * <li>ArrayBuffer</li>
   * <li>Blob</li>
   * <li>Float32Array</li>
   * <li>Float64Array</li>
   * <li>Int8Array</li>
   * <li>Int16Array</li>
   * <li>Int32Array</li>
   * <li>Number</li>
   * <li>Object</li>
   * <li>Uint8Array</li>
   * <li>Uint8ClampedArray</li>
   * <li>Uint16Array</li>
   * <li>Uint32Array</li>
   * <li>String</li>
   * </ul>
   * 
   * When using localStorage and WebSQL backends, binary data will be serialized
   * before being saved (and retrieved). This serialization will incur a size
   * increase when binary data is saved.
   * 
   * @param key
   * @param objectToSave
   * @param callback
   *          (error, value)
   */
  public native <T> void setItem(String key, Object objectToSave, Callback2<String, T> successCallback);

  /**
   * Removes the value of a key from the offline store.
   * 
   * @param key
   * @param callback
   *          (error)
   */
  public native void removeItem(String key, Callback1<String> successCallback);

  /**
   * Removes every key from the database, returning it to a blank slate.
   * 
   * localforage.clear() will remove every item in the offline store. Use this
   * method with caution.
   * 
   * @param callback
   *          (error)
   */
  public native void clear(Callback1<String> successCallback);

  /**
   * Gets the number of keys in the offline store (i.e. its “length”).
   * 
   * @param callback
   *          (error, numberOfKeys)
   */
  public native void length(Callback2<String, Integer> successCallback);

  /**
   * Get the name of a key based on its ID.
   * 
   * This method is inherited from the localStorage API, but is acknowledged to
   * be kinda weird.
   * 
   * @param keyIndex
   * @param callback
   *          (error, keyName)
   */
  public native void key(Integer keyIndex, Callback2<String, String> successCallback);

  /**
   * Get the list of all keys in the datastore.
   * 
   * @param callback
   *          (error, keylist)
   */
  public native void keys(Callback2<String, Array<String>> successCallback);

  /**
   * Iterate over all value/key pairs in datastore.
   * 
   * iteratorCallback is called once for each pair, with the following
   * arguments:
   * 
   * <ul>
   * <li>value</li>
   * <li>key</li>
   * <li>iterationNumber -one-based number</li>
   * </ul>
   * 
   * iterate supports early exit by returning non undefined value inside
   * iteratorCallback callback. Resulting value will be passed to
   * successCallback as the result of iteration.
   * 
   * This means if you’re using CoffeeScript, you’ll need to manually return
   * nothing to keep iterating through each key/value pair.
   * 
   * @param iteratorCallback
   *          (value, key, iterationNumber)
   * @param successCallback
   *          (exitValue)
   */
  public native <T> void iterate(Function3<T, String, Integer, Object> iteratorCallback, Callback1<Object> successCallback);
}
