package org.wolfTec.cwt.game.network;

import org.wolfTec.cwt.game.EngineGlobals;
import org.wolfTec.cwt.utility.Logger;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;
import org.wolfTec.cwt.utility.container.CircularBuffer;

@Bean
public class NetworkBean {

  @InjectedByFactory
  private static Logger log;

  @InjectedByFactory
  private CircularBuffer<NetworkMessage> buffer;

  /**
   * Id of the game in the connected network session.
   */
  private int gameId = EngineGlobals.INACTIVE_ID;

  /**
   * Id of the client in the connected network session.
   */
  private int clientId = EngineGlobals.INACTIVE_ID;

  public void connect(String server) {
    log.error("NotImplementedYetException");
  }

  public void disconnect() {
    log.error("NotImplementedYetException");
  }

  public boolean isConnected() {
    return gameId != EngineGlobals.INACTIVE_ID;
  }

  public boolean isGameHost() {
    return gameId == EngineGlobals.INACTIVE_ID || clientId != EngineGlobals.INACTIVE_ID;
  }

  /**
   * Parses a message and invokes commands if necessary.
   */
  public NetworkMessage grabMessage() {
    log.error("NotImplementedYetException");
    return null;
  }

  /**
   * Sends a given action data object into data object and sends it to the game
   * server.
   */
  public void sendMessage(NetworkMessage data) {
    log.error("NotImplementedYetException");
  }

  public boolean hasMessages() {
    log.error("NotImplementedYetException");
    return false;
  }
}
