package org.wolfTec.wolfTecEngine.input;


public interface InputManager {

  /**
   * 
   * @param action
   * @return
   */
  boolean isActionPressed(String action);

  /**
   * 
   * @param action
   * @return
   */
  boolean isKeyPressed(String action);

  /**
   * 
   * @param key
   */
  void keyPressed(String key);

  /**
   * 
   * @param key
   */
  void keyReleased(String key);

  void connectActionMapping(String keyId, String action);

  void disconnectActionMapping(String keyId);
}
