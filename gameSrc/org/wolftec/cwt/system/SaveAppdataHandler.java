package org.wolftec.cwt.system;

public interface SaveAppdataHandler<T> extends ManagedClass {

  void onAppLoad(T data);

  void onAppSave(T data);
}
