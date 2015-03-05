package org.wolfTec.wolfTecEngine.components;

import org.wolfTec.wolfTecEngine.EngineInternal;

public interface ManagedComponentInitialization {

  /**
   * Called after the component is created and it's properties got injected by
   * the {@link ComponentManager}.
   * 
   * @param manager
   */
  @EngineInternal
  void onComponentConstruction(ComponentManager manager);
}
