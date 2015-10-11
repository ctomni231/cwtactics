package org.wolftec.cwt.core.persistence;

import org.wolftec.cwt.core.ioc.Injectable;

public interface SaveAppdataHandler<T> extends Injectable {

  void onAppLoad(T data);

  void onAppSave(T data);
}
