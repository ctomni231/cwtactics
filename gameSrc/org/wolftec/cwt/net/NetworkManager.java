package org.wolftec.cwt.net;

import org.wolftec.cwt.Constants;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.util.JsUtil;

public class NetworkManager implements ManagedClass
{

  /**
   * Id of the game in the connected network session.
   */
  private String gameId;

  /**
   * Id of the client in the connected network session.
   */
  private int clientId;

  @Override
  public void onConstruction()
  {
    gameId = null;
    clientId = Constants.INACTIVE;
  }

  /**
   * @return {Boolean}
   */
  public boolean isActive()
  {
    return gameId != null;
  }

  /**
   * @return {Boolean}
   */
  public boolean isHost()
  {
    return gameId == null || clientId != Constants.INACTIVE;
  }

  /**
   * Parses a message and invokes commands if necessary.
   */
  public void parseMessage(String msg)
  {
    JsUtil.throwError("NotImplementedYetException");
  }

  /**
   * Sends a given action data object into data object and sends it to the game
   * server.
   */
  public void sendMessage(String actionData)
  {
    JsUtil.throwError("NotImplementedYetException");
  }
}
