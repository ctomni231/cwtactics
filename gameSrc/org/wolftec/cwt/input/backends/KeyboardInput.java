package org.wolftec.cwt.input.backends;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.Deactivatable;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.input.InputManager;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class KeyboardInput implements Injectable, Deactivatable {

  // @STJSBridge TODO readd when stjs 3.2.0 is fixed
  @SyntheticType
  static class KeyEvent {
    int keyCode;
  }

  private Log          log;
  private InputManager input;

  public void handleKeyDown(KeyEvent ev) {
    input.pressButton(codeToChar(ev.keyCode));
  }

  public void handleKeyUp(KeyEvent ev) {
    input.pressButton(codeToChar(ev.keyCode));
  }

  @Override
  public void enable() {
    log.info("activating keyboard input");
    JSObjectAdapter.$put(Global.window.document, "onkeydown", (Callback1<KeyEvent>) this::handleKeyDown);
    JSObjectAdapter.$put(Global.window.document, "onkeyup", (Callback1<KeyEvent>) this::handleKeyUp);
  }

  @Override
  public void disable() {
    log.info("deactivating keyboard input");
    JSObjectAdapter.$put(Global.window.document, "onkeydown", null);
    JSObjectAdapter.$put(Global.window.document, "onkeyup", null);
  }

  /**
   * 
   * @param characterCode
   * @return the character for the given character code.
   */
  private String codeToChar(int characterCode) {
    String value;

    switch (Nullable.getOrThrow(characterCode, "IllegalArgument: character code")) {
      case 6:
        value = "Mac";
        break;
      case 8:
        value = "Backspace";
        break;
      case 9:
        value = "Tab";
        break;
      case 13:
        value = "Enter";
        break;
      case 16:
        value = "Shift";
        break;
      case 17:
        value = "CTRL";
        break;
      case 18:
        value = "ALT";
        break;
      case 19:
        value = "Pause/Break";
        break;
      case 20:
        value = "Caps Lock";
        break;
      case 27:
        value = "ESC";
        break;
      case 32:
        value = "Space";
        break;
      case 33:
        value = "Page Up";
        break;
      case 34:
        value = "Page Down";
        break;
      case 35:
        value = "End";
        break;
      case 36:
        value = "Home";
        break;
      case 37:
        value = "Arrow Left";
        break;
      case 38:
        value = "Arrow Up";
        break;
      case 39:
        value = "Arrow Right";
        break;
      case 40:
        value = "Arrow Down";
        break;
      case 43:
        value = "Plus";
        break;
      case 45:
        value = "Insert";
        break;
      case 46:
        value = "Delete";
        break;
      case 91:
        value = "Left Window Key";
        break;
      case 92:
        value = "Right Window Key";
        break;
      case 93:
        value = "Select Key";
        break;
      case 96:
        value = "Numpad 0";
        break;
      case 97:
        value = "Numpad 1";
        break;
      case 98:
        value = "Numpad 2";
        break;
      case 99:
        value = "Numpad 3";
        break;
      case 100:
        value = "Numpad 4";
        break;
      case 101:
        value = "Numpad 5";
        break;
      case 102:
        value = "Numpad 6";
        break;
      case 103:
        value = "Numpad 7";
        break;
      case 104:
        value = "Numpad 8";
        break;
      case 105:
        value = "Numpad 9";
        break;
      case 106:
        value = "*";
        break;
      case 107:
        value = "+";
        break;
      case 109:
        value = "-";
        break;
      case 110:
        value = ";";
        break;
      case 111:
        value = "/";
        break;
      case 112:
        value = "F1";
        break;
      case 113:
        value = "F2";
        break;
      case 114:
        value = "F3";
        break;
      case 115:
        value = "F4";
        break;
      case 116:
        value = "F5";
        break;
      case 117:
        value = "F6";
        break;
      case 118:
        value = "F7";
        break;
      case 119:
        value = "F8";
        break;
      case 120:
        value = "F9";
        break;
      case 121:
        value = "F10";
        break;
      case 122:
        value = "F11";
        break;
      case 123:
        value = "F12";
        break;
      case 144:
        value = "Num Lock";
        break;
      case 145:
        value = "Scroll Lock";
        break;
      case 186:
        value = ";";
        break;
      case 187:
        value = "=";
        break;
      case 188:
        value = ",";
        break;
      case 189:
        value = "-";
        break;
      case 190:
        value = ".";
        break;
      case 191:
        value = "/";
        break;
      case 192:
        value = "`";
        break;
      case 219:
        value = "[";
        break;
      case 220:
        value = "\\";
        break;
      case 221:
        value = "]";
        break;
      case 222:
        value = "'";
        break;

      default:
        value = Nullable.getOrElse(JSObjectAdapter.$js("String.fromCharCode(charCode)"), "UNKNOWN");
    }

    return value.toUpperCase();
  }
}
