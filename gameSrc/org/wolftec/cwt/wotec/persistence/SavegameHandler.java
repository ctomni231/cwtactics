package org.wolftec.cwt.wotec.persistence;

import org.wolftec.cwt.wotec.ioc.Injectable;

public interface SavegameHandler<T> extends Injectable {

  void onGameLoad(T data);

  void onGameSave(T data);
}
