package net.wolfTec.wtEngine.base;

import net.wolfTec.wtEngine.WolfTecEngine;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public interface EngineInitializationListener {
  public default void onEngineInit(WolfTecEngine engine) {}
  public default void onPostEngineInit(WolfTecEngine engine) {}
}
