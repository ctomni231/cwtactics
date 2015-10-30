package org.wolftec.wTec.persistence;

import org.wolftec.wTec.ioc.Injectable;

public interface SaveAppdataHandler<T> extends Injectable {

  void onAppLoad(T data);

  void onAppSave(T data);
}
