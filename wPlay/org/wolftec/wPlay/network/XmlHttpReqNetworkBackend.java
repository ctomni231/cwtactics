package org.wolftec.wPlay.network;

import org.stjs.javascript.functions.Callback2;
import org.wolftec.wCore.core.BrowserUtil;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wCore.persistence.JsonConverter;

/**
 * Simple HTTP backend with allows networking over a simple polling algorithm.
 */
@ManagedComponent
public class XmlHttpReqNetworkBackend extends NetworkBackend implements
    ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;
 
  @Injected
  private JsonConverter converter;
  
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
