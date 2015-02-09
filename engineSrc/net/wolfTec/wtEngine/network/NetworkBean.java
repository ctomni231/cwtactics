package net.wolfTec.wtEngine.network;

import org.wolfTec.utility.Bean;
import org.wolfTec.utility.InjectedByFactory;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.statemachine.ActionData;

@Bean public class NetworkBean {

  @InjectedByFactory private static Logger log;

  /**
   * Id of the game in the connected network session.
   */
  private int gameId = Constants.INACTIVE_ID;

  /**
   * Id of the client in the connected network session.
   */
  private int clientId = Constants.INACTIVE_ID;

  public void connect(String server) {

  }

  public void disconnect() {

  }

  public boolean isConnected() {
    return gameId != Constants.INACTIVE_ID;
  }

  public boolean isGameHost() {
    return gameId == Constants.INACTIVE_ID || clientId != Constants.INACTIVE_ID;
  }

  /**
   * Parses a message and invokes commands if necessary.
   */
  public ActionData grabMessage() {
    log.error("NotImplementedYetException");
    return null;
  }

  /**
   * Sends a given action data object into data object and sends it to the game
   * server.
   */
  public void sendMessage(ActionData data) {
    log.error("NotImplementedYetException");
  }

  public boolean hasMessages() {
    log.error("NotImplementedYetException");
    return false;
  }
}
