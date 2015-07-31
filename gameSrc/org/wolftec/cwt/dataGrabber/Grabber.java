package org.wolftec.cwt.dataGrabber;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.PersistenceManager;
import org.wolftec.cwt.core.Injectable;

public interface Grabber extends Injectable {

  /**
   * Loads the given data key from the remote data location.
   * 
   * @param dataKey
   * @param dataCb
   *          callback after the content is loaded
   */
  void fromRemote(String dataKey, Callback1<Object> dataCb);

  /**
   * Loads the given data key from the local data location.
   * 
   * @param dataKey
   * @param dataCb
   *          callback after the content is loaded
   */
  void fromCache(PersistenceManager pm, String dataKey, Callback1<Object> dataCb);
}
