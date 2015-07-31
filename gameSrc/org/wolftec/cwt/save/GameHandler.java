package org.wolftec.cwt.save;


public interface GameHandler<T> {

  void onGameLoad(T data);

  void onGameSave(T data);
}
