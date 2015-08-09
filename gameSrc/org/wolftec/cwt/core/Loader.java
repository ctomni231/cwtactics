package org.wolftec.cwt.core;

import org.stjs.javascript.functions.Callback0;

public interface Loader {
  default int priority() {
    return 1;
  }

  /**
   * Invokes the loader mechanic. Calls done when done to invoke the next loader
   * in the loader queue.
   * 
   * @param done
   */
  void onLoad(Callback0 done);
}
