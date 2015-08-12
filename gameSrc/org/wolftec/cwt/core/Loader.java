package org.wolftec.cwt.core;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.core.ioc.Injectable;

public interface Loader extends Injectable {
  default int priority() {
    return 10;
  }

  /**
   * Invokes the loader mechanic. Calls done when done to invoke the next loader
   * in the loader queue.
   * 
   * @param done
   */
  void onLoad(Callback0 done);
}
