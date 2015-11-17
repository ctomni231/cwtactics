package org.wolftec.cwt.controller.net;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.annotations.OptionalField;
import org.wolftec.cwt.core.javascript.JsUtil;

public class XmlHttpNetwork {

  /**
   * Id of the game in the connected network session.
   */
  @OptionalField private String gameId;

  /**
   * Id of the client in the connected network session.
   */
  private int clientId;

  public XmlHttpNetwork() {
    gameId = null;
    clientId = Constants.INACTIVE;
  }

  /**
   * @return {Boolean}
   */
  public boolean isActive() {
    return gameId != null;
  }

  /**
   * @return {Boolean}
   */
  public boolean isHost() {
    return gameId == null || clientId != Constants.INACTIVE;
  }

  /**
   * Parses a message and invokes commands if necessary.
   */
  public void parseMessage(String msg) {
    JsUtil.throwError("NotImplementedYetException");
  }

  /**
   * Sends a given action data object into data object and sends it to the game
   * server.
   */
  public void sendMessage(String actionData) {
    JsUtil.throwError("NotImplementedYetException");
  }
}
