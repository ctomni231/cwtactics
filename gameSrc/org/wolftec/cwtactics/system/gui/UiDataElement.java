package org.wolftec.cwtactics.system.gui;

import org.stjs.javascript.functions.Callback2;

public class UiDataElement<T> extends UiElement {

  public UiDataElement(UiElement parent) {
    super(parent);
  }

  public T value;
  public Callback2<Object, Integer> onInput;
}
