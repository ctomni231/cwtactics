package net.wolfTec.wtEngine.base;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public interface EngineInitializationListener {
  public void onEngineInit(EngineOptions options);
}
