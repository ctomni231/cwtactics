package org.wolftec.cwt.system;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwtactics.game.core.CheckedValue;

public abstract class WorklfowUtil {

  private static class WorkflowData {
    int       completed;
    Callback0 mainCb;
  }

  /**
   * Calls functions in a sequence. The execution of the functions will be
   * stopped when one of the functions throws an error.
   *
   * @param functionList
   *          list of functions that will be called in a sequence
   * @param callback
   *          callback that will be called after every function in the list has
   *          been called
   */
  public static void sequence(Array<Callback1<Callback0>> functionList, Callback0 callback) {
    if (functionList.$length() == 0) {
      JsUtil.throwError("IllegalArgumentException: function list cannot be empty");
    }

    WorkflowData data = new WorkflowData();
    data.completed = 0;

    /**
     * Evaluates the current (completed acts as pointer) function in the
     * function list
     */
    Callback1<Callback0> iterate = (nextCallback) -> {
      functionList.$get(data.completed).$invoke(nextCallback);
    };

    data.mainCb = () -> {
      data.completed++;
      if (data.completed == functionList.$length()) {
        if (CheckedValue.of(callback).isPresent()) {
          callback.$invoke();
        }
      } else {
        iterate.$invoke(data.mainCb);
      }
    };

    iterate.$invoke(data.mainCb);
  }
}
