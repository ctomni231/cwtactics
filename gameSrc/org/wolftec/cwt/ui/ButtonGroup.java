package org.wolftec.cwt.ui;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.RegExp;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.system.Nullable;

public class ButtonGroup {

  Array<Field> elements;
  int          selected;

  public ButtonGroup() {
    elements = JSCollections.$array();
    selected = Constants.INACTIVE;
  }

  public void addElement(Field el) {
    elements.push(el);
    if (selected == Constants.INACTIVE && Nullable.isPresent(el.action)) {
      int last = elements.$length() - 1;
      elements.$get(last).inFocus = true;
      selected = last;
    }
  }

  /**
   * 
   * @return the current active button.
   */
  public Field activeButton() {
    return elements.$get(selected);
  }

  /**
   * 
   * @param key
   * @return a button by it's key.
   */
  public Field getButtonByKey(String key) {
    for (int i = 0, e = elements.$length(); i < e; i++) {
      Field element = elements.$get(i);
      if (element.key == key) {
        return element;
      }
    }
    // TODO null avoid ?
    return null;
  }

  public Array<Field> getButtonsByReg(RegExp reg) {
    Array<Field> arr = JSCollections.$array();

    for (int i = 0, e = elements.$length(); i < e; i++) {
      Field element = elements.$get(i);
      if (reg.test(element.key)) {
        arr.push(element);
      }
    }

    return arr;
  }

  /**
   * Updates the index of the selected button in interconnection to a given
   * position.
   * 
   * @param x
   * @param y
   * @return true, if the index was updated, else false
   */
  public boolean updateIndex(int x, int y) {
    for (int i = 0, e = elements.$length(); i < e; i++) {

      Field element = elements.$get(i);

      // inactive element
      if (!Nullable.isPresent(element.action) || element.inactive) {
        continue;
      }

      if (element.positionInButton(x, y)) {
        if (i == selected) {
          return false;
        }

        // TODO code doublet
        elements.$get(selected).inFocus = false;
        selected = i;
        elements.$get(selected).inFocus = true;

        return true;
      }
    }
    return false;
  }

  public void setIndex(int index) {
    if (index < 0 && index >= elements.$length()) {
      JsUtil.throwError("illegal index");
    }

    // TODO code doublet
    elements.$get(selected).inFocus = false;
    selected = index;
    elements.$get(selected).inFocus = true;
  }

  /**
   * 
   * @param inputData
   * @return true, if the index was updated, else false
   */
  public boolean handleInput(int inputData) {
    boolean res = true;

    // TODO more or less also a code doublet
    elements.$get(selected).inFocus = false;

    switch (inputData) {
      case InputManager.TYPE_UP:
      case InputManager.TYPE_LEFT:
        do {
          selected--;
          if (selected < 0) {
            selected = elements.$length() - 1;
          }
        } while (!Nullable.isPresent(elements.$get(selected).action) || elements.$get(selected).inactive);
        break;

      case InputManager.TYPE_RIGHT:
      case InputManager.TYPE_DOWN:
        do {
          selected++;
          if (selected >= elements.$length()) {
            selected = 0;
          }
        } while (!Nullable.isPresent(elements.$get(selected).action) || elements.$get(selected).inactive);
        break;

      default:
        res = false;
    }

    elements.$get(selected).inFocus = true;

    return res;
  }

  /**
   * Draws the screen layout into a given context of a canvas object.
   * 
   * @param ctx
   */
  public void draw(CanvasRenderingContext2D ctx) {
    for (int i = 0, e = elements.$length(); i < e; i++) {
      Field el = elements.$get(i);

      if (!el.inactive) {
        el.draw(ctx);
      }
    }
  }
}
