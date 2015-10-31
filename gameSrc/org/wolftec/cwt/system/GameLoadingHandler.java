package org.wolftec.cwt.system;

import org.stjs.javascript.functions.Callback0;

/**
 * A class which implements this interface will be automatically a
 * {@link ManagedClass}. Implement this to hook into the loading system.
 */
public interface GameLoadingHandler extends ManagedClass {

  /**
   * The priority of the {@link GameLoadingHandler}. A higher priority
   * results into a sooner execution of the handler.
   * 
   * @return
   */
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
