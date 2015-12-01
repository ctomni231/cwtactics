package org.wolftec.cwt.model.actions;

import org.wolftec.cwt.core.javascript.JsUtil;

public class MoveCodes {

  public static final int MOVE_CODES_UP = 0;
  public static final int MOVE_CODES_RIGHT = 1;
  public static final int MOVE_CODES_DOWN = 2;
  public static final int MOVE_CODES_LEFT = 3;

  public static int codeFromAtoB(int sx, int sy, int tx, int ty) {
    int code = 0;

    if (sx < tx) {
      code = MOVE_CODES_RIGHT;

    } else if (sx > tx) {
      code = MOVE_CODES_LEFT;

    } else if (sy < ty) {
      code = MOVE_CODES_DOWN;

    } else if (sy > ty) {
      code = MOVE_CODES_UP;

    } else {
      JsUtil.throwError("IllegalMoveCode");
    }

    return code;
  }

}
