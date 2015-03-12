package org.wolfTec.wolfTecEngine.network;

import org.stjs.javascript.functions.Callback2;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolftec.core.BrowserUtil;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;

/**
 * Simple HTTP backend with allows networking over a simple polling algorithm.
 */
@ManagedComponent
public class XmlHttpReqNetworkBackend extends NetworkBackend implements
    ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;
 
  @Injected
  private JsonFileSerializer jsonSerializer;
  
  private Callback2<Object, String> p_serverResponseCb;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    p_serverResponseCb = (Object resp, String err) -> {
      if (err != null) {
        log.error("Could not send game message => " + err);
        return;
      }

      onIncomingMessage(resp.toString());
    };
  }

  private String server;

  @Override
  public void connect(String server) {
    BrowserUtil.doXmlHttpRequest(server + "?cmd=CONNECT", null, (resp, err) -> {
      if (err != null) {
        log.error("Cannot connect to server");
        return;
      }
      this.server = server;
    });
  }

  @Override
  public void disconnect() {
    BrowserUtil.doXmlHttpRequest(server + "?cmd=DISCONNECT", null, (resp, err) -> {
      if (err != null) {
        log.error("Cannot connect to server");
        return;
      }
    });
    this.server = null;
  }

  @Override
  public boolean isConnected() {
    return server != null;
  }

  @Override
  public boolean isGameHost() {
    return false;
  }

  @Override
  public void sendMessage(String data) {
    BrowserUtil.doXmlHttpRequest(server, null, p_serverResponseCb);
  }

}
