package net.wolfTec.wtEngine.base;

import net.wolfTec.wtEngine.WolfTecEngine;

import org.stjs.javascript.annotation.STJSBridge;

@STJSBridge public interface EngineInitializationListener {
  public void onEngineInit(EngineOptions options, WolfTecEngine engine);
}
