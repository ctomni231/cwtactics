package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.SyntheticType;

@SyntheticType
public class LocalForageConfig {

  /**
   * The preferred driver(s) to use. Same format as what is passed to
   * <code>setDriver()</code>, above.
   * 
   * Default: <code>[localforage.INDEXEDDB, localforage.WEBSQL,
   * localforage.LOCALSTORAGE]</code>
   */
  public Array<Integer> driver;

  /**
   * The name of the database. May appear during storage limit prompts. Useful
   * to use the name of your app here. In localStorage, this is used as a key
   * prefix for all keys stored in localStorage.
   * 
   * Default: <code>localforage</code>
   */
  public String         name;

  /**
   * The size of the database in bytes. Used only in WebSQL for now.
   * 
   * Default: <code>4980736</code>
   */
  public int            size;

  /**
   * The name of the datastore. In IndexedDB this is the dataStore, in WebSQL
   * this is the name of the key/value table in the database. Must be
   * alphanumeric, with underscores. Any non-alphanumeric characters will be
   * converted to underscores.
   * 
   * Default: <code>keyvaluepairs</code>
   */
  public String         storeName;

  /**
   * The version of your database. May be used for upgrades in the future;
   * currently unused.
   * 
   * Default: <code>1.0</code>
   */
  public String         version;

  /**
   * A description of the database, essentially for developer usage.
   * 
   * Default: <code>""</code>
   */
  public String         description;

}