package net.wolfTec.wtEngine.base;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public interface PostEngineInitializationListener {
  public void onPostEngineInit();
}
