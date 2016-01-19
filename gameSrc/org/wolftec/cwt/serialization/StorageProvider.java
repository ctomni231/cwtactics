package org.wolftec.cwt.serialization;

import org.wolftec.cwt.serialization.localforage.LocalForageStorage;

/**
 * This provider allows access to the data storage of the active environment.
 */
public class StorageProvider
{
  private static final LocalForageStorage LOCAL_FORAGE_STORAGE;

  static
  {
    LOCAL_FORAGE_STORAGE = new LocalForageStorage();
  }

  public static Storage getStorage()
  {
    return LOCAL_FORAGE_STORAGE;
  }
}
