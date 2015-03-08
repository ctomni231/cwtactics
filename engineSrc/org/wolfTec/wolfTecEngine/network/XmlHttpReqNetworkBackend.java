package org.wolfTec.wolfTecEngine.network;

import org.stjs.javascript.functions.Callback2;
import org.wolfTec.vfs.JsonFileSerializer;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.logging.LogManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;

/**
 * Simple HTTP backend with allows networking over a simple polling algorithm.
 */
@ManagedComponent(whenQualifier="network=WOLFTEC_XMLHTTP")
public class XmlHttpReqNetworkBackend extends NetworkBackend implements
    ManagedComponentInitialization {

  private Logger log;
  private JsonFileSerializer jsonSerializer;
  private Callback2<Object, String> p_serverResponseCb;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    log = manager.getComponentByClass(LogManager.class).createByClass(getClass());
    jsonSerializer = new JsonFileSerializer();

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
