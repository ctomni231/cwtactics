package org.wolftec.cwt.wotec.persistence;

import org.wolftec.cwt.wotec.ioc.Injectable;

public interface SaveAppdataHandler<T> extends Injectable {

  void onAppLoad(T data);

  void onAppSave(T data);
}
