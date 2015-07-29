package org.wolftec.cwt.dl;

public interface Loader {
  default int priority() {
    return 1;
  }

  void onLoad();
}
