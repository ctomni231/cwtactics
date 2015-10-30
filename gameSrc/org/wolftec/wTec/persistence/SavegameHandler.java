package org.wolftec.wTec.persistence;

import org.wolftec.wTec.ioc.Injectable;

public interface SavegameHandler<T> extends Injectable {

  void onGameLoad(T data);

  void onGameSave(T data);
}
