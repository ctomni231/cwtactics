package org.wolftec.cwt.serialization;

import org.wolftec.cwt.managed.ManagedClass;

public interface SaveAppdataHandler<T> extends ManagedClass {

  void onAppLoad(T data);

  void onAppSave(T data);
}
