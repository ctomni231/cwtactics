package org.wolftec.cwt.wotec.loading;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.wotec.ioc.Injectable;

public interface GameLoader extends Injectable {
  default int priority() {
    return 5;
  }

  /**
   * Invokes the loader mechanic. Calls done when done to invoke the next loader
   * in the loader queue.
   * 
   * @param done
   */
  void onLoad(Callback0 done);
}
