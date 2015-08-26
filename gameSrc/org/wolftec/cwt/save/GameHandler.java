package org.wolftec.cwt.save;

import org.wolftec.cwt.core.ioc.Injectable;

public interface GameHandler<T> extends Injectable {

  void onGameLoad(T data);

  void onGameSave(T data);
}
