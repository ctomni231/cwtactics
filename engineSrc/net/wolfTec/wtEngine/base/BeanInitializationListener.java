package net.wolfTec.wtEngine.base;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public interface BeanInitializationListener {
  public default void onEngineInit(BeanFactory engine) {}
  public default void onPostEngineInit(BeanFactory engine) {}
}
