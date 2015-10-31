package org.wolftec.cwt.system;

public interface SavegameHandler<T> extends ManagedClass {

  void onGameLoad(T data);

  void onGameSave(T data);
}
