package org.wolftec.cwt.wotec.loading;

public interface LoadingWatcher {

  void onStartLoading(String what);

  void onFinishedLoading(String what);
}
