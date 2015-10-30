package org.wolftec.wTec.loading;

public interface LoadingWatcher {

  void onStartLoading(String what);

  void onFinishedLoading(String what);
}
