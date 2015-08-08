package org.wolftec.cwt.dataGrabber;

import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwt.PersistenceManager;

public interface Grabber {

  String forPath();

  /**
   * Loads the given data key from the remote data location.
   * 
   * @param pm
   * @param file
   * @param completeCb
   */
  void grabData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb);

  /**
   * Loads the given data key from the local data location.
   * 
   * @param pm
   * @param file
   * @param completeCb
   */
  void loadData(PersistenceManager pm, FileDescriptor file, Callback0 completeCb);
}
