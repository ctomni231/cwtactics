package org.wolftec.cwt.save;

import org.wolftec.cwt.core.ioc.Injectable;

public interface AppHandler<T> extends Injectable {

  void onAppLoad(T data);

  void onAppSave(T data);
}
