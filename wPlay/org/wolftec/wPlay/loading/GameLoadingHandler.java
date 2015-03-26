package org.wolftec.wPlay.loading;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public interface GameLoadingHandler {

  void loadStuff(Callback1<String> triggerElementLoading, Callback0 triggerDone);

  default int getLoadPriority() {
    return 1;
  }
}
