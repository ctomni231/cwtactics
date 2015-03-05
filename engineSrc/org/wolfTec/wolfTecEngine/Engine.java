package org.wolfTec.wolfTecEngine;

import org.wolfTec.wolfTecEngine.components.ComponentManager;

public class Engine {

  public static final String VERSION = "0.5.0";

  public final ComponentManager componentManager;
  
  public final EngineOptions options;

  public Engine(EngineOptions options) {
    this.options = options;
    this.componentManager = new ComponentManager(null);
  }
  
  public static EngineOptions createOptionsObject () {
    EngineOptions options = new EngineOptions();
    return options;
  }
}
