package org.wolftec.cwt.system;

public interface ResourceRequestWatcher extends ManagedClass {

  /**
   * Called when the loading system started to grab a resource.
   * 
   * @param what
   */
  void onStartLoading(String what);

  /**
   * Called when the loading system successfully loaded a resource.
   * 
   * @param what
   */
  void onFinishedLoading(String what);
}
