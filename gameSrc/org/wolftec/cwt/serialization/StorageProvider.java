package org.wolftec.cwt.serialization;

import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.util.NullUtil;

public class StorageProvider implements ManagedClass // TODO temp managed
{
  private static PersistenceManager static_pm;
  private PersistenceManager pm;

  @Override
  public void onConstruction()
  {
    static_pm = NullUtil.getOrThrow(pm);
  }

  public static PersistenceManager getStorageProvider()
  {
    return static_pm;
  }
}
