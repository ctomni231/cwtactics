package org.wolftec.cwt.serialization;

import org.wolftec.cwt.managed.ManagedClass;

public interface SavegameHandler<T> extends ManagedClass
{

  void onGameLoad(T data);

  void onGameSave(T data);
}
