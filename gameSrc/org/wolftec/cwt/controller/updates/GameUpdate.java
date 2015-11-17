package org.wolftec.cwt.controller.updates;

import org.stjs.javascript.functions.Callback0;

/**
 * An update does several actions when the game updates to a newer version.
 */
public interface GameUpdate {

  /**
   * 
   * @return short description of the update step
   */
  String getUpdateText();

  /**
   * 
   * @return the version of the game which needs this update
   */
  String getUpdateVersion();

  /**
   * Called when the game updates into this update from an older version. This
   * method will change the game storage and data into state which is usable in
   * the newer version.
   * 
   * @param doneCb
   *          must be called when the update is done
   */
  void doUpdate(Callback0 doneCb);
}
