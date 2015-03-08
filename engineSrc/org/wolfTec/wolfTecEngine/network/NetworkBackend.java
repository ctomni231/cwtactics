package org.wolfTec.wolfTecEngine.network;

import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.statemachine.ActionQueueHandler;

/**
 * Network beans allows to communicate with other game instances over a server.
 * The kind of communication will be decided by the concrete implementation.
 */
public abstract class NetworkBackend {

  @Injected
  protected ActionQueueHandler<?> action;

  public abstract void connect(String server);

  public abstract void disconnect();

  public abstract boolean isConnected();

  public abstract boolean isGameHost();

  /**
   * Sends a given action data object into data object and sends it to the game
   * server.
   */
  public abstract void sendMessage(String data);

  /**
   * Reads a message and inserts it into the WolfTec system.
   * 
   * @param data
   */
  public void onIncomingMessage(String data) {
    action.queueRemoteAction(data);
  }
}
