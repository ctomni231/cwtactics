package org.wolftec.cwt.core.loading;

public interface LoadingWatcher {

  void onStartLoading(String what);

  void onFinishedLoading(String what);
}
