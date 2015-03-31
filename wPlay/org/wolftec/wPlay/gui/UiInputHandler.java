package org.wolftec.wPlay.gui;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.wPlay.input.LiveInputManager;

public class UiInputHandler {

  private static class UiInputElement {
    private UiElement element;
    private Map<String, Callback0> elementHandlers;
  }

  private Map<String, Callback0> handlers;
  private Array<UiInputElement> elements;
  private int selectedIndex;

  public UiInputHandler() {
    selectedIndex = 0;
  }

  public UiElement getSelectedElement() {
    return null; // TODO
  }

  public void onElementAction(UiElement element, String action, Callback0 cb) {

  }

  public void onAction(String action, Callback0 cb) {

  }

  public void registerElements(UiElement... arguments) {

  }

  public void update(LiveInputManager input) {

  }
}
