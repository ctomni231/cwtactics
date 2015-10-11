package org.wolftec.cwt.core.persistence;

import org.wolftec.cwt.core.ioc.Injectable;

public interface SavegameHandler<T> extends Injectable {

  void onGameLoad(T data);

  void onGameSave(T data);
}
