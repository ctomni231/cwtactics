package org.wolftec.cwt.core;

public interface LoadingWatcher {

  void onStartLoading(String what);

  void onFinishedLoading(String what);
}
