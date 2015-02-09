package net.wolfTec.wtEngine.input;

import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.log.Logger;

import org.stjs.javascript.JSStringAdapter;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.CircularBuffer;
import org.wolfTec.utility.InjectedByFactory;

@Bean public class InputBean {

  @InjectedByFactory private Logger log;

  private final CircularBuffer<InputData> stack;
  private final CircularBuffer<InputData> pool;

  /**
   * If true, then every user input will be blocked.
   */
  public boolean blocked;

  /**
   * Returns true when the input system wants a generic input (raw codes) from
   * input backends like keyboards and game pads.
   */
  public boolean genericInput;

  public InputBean() {
    stack = new CircularBuffer<InputData>(Constants.INPUT_STACK_BUFFER_SIZE);
    pool = new CircularBuffer<InputData>(Constants.INPUT_STACK_BUFFER_SIZE);
  }

  /**
   * Pushes an input **key** into the input stack. The parameters **d1** and
   * **d2** has to be integers.
   *
   * @param key
   * @param d1
   * @param d2
   */
  public void pushAction(InputTypeKey key, int d1, int d2) {
    if (blocked || pool.isEmpty()) return;

    log.info("adding input data " + key + ", " + d1 + ", " + d2);

    InputData cmd = pool.popFirst();
    cmd.d1 = d1;
    cmd.d2 = d2;
    cmd.key = key;

    stack.push(cmd);
  }

  public boolean hasCommands() {
    return !stack.isEmpty();
  }

  /**
   * Grabs and returns an **input data object** from the input stack, **null**
   * if the stack is empty.
   *
   * @return
   */
  public InputData grabCommand() {
    if (stack.isEmpty()) {
      return null;
    }
    return stack.popFirst();
  }

  public void dropBufferedCommands() {
    while (!stack.isEmpty()) {
      releaseAction(stack.popLast());
    }
  }

  /**
   * Returns the character for a key code.
   */
  public String codeToChar(int charCode) {
    if (charCode == Constants.INACTIVE_ID) {
      return "";
    }

    String value = JSStringAdapter.fromCharCode(String.class, charCode);
    switch (charCode) {
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
    }

    return value;
  }

  public void releaseAction(InputData inp) {
    pool.push(inp);
  }
}
