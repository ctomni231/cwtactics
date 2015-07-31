package org.wolftec.cwt.save;


public interface AppHandler<T> {

  void onAppLoad(T data);

  void onAppSave(T data);
}
