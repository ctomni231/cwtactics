package org.wolfTec.wolfTecEngine.renderer.gui;

public abstract class UiElementUtil {

  public UiElement createActionElement(String action) {
    UiElement element = new UiElement();
    
    element.actionKey = action;
    
    return element;
  }
}
