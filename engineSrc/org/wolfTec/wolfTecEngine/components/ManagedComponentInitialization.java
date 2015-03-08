package org.wolfTec.wolfTecEngine.components;

public interface ManagedComponentInitialization {

  /**
   * Called after the component is created and it's properties got injected by
   * the {@link ComponentManager}.
   * 
   * @param manager
   */
  @Internal
  void onComponentConstruction(ComponentManager manager);
}
