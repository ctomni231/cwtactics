package org.wolftec.cwt.loop;

import org.wolftec.cwt.managed.ManagedClass;

/**
 * A {@link ManagedClass} class which implements this interface can do something
 * in every frame of the application.
 */
public interface GameloopWatcher {

  /**
   * Called when a new frame is called. Usually this will be called before the
   * state machine invokes it's update logic.
   * 
   * @param delta
   *          time since the last frame (should be 16 in a perfect environment)
   */
  void onFrameTick(int delta);
}
