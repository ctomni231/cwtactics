package org.wolfTec.wolfTecEngine;

import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagerOptions;

public class Engine {

  public static final String VERSION = "0.5.0";

  public final ComponentManager componentManager;
  
  public final ManagerOptions options;

  public Engine(ManagerOptions options) {
    this.options = options;
    this.componentManager = new ComponentManager(null);
  }
  
  public static ManagerOptions createOptionsObject () {
    ManagerOptions options = new ManagerOptions();
    return options;
  }
}
