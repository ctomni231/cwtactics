package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Callback3;
import org.wolftec.cwt.system.Nullable;

public class ListUtil {
  private static class WorkflowData {
    int       completed;
    Callback0 mainCb;
  }

  public static <T> void forEachArrayValueAsync(Array<T> array, Callback3<Integer, T, Callback0> callback, Callback0 doneCb) {
    Nullable.getOrThrow(callback, "MissingParameter: callback");

    if (array.$length() == 0) {
      doneCb.$invoke();
      return;
    }

    WorkflowData data = new WorkflowData();
    data.completed = 0;

    /**
     * Evaluates the current (completed acts as pointer) function in the
     * function list
     */
    Callback1<Callback0> iterate = (nextCallback) -> {
      callback.$invoke(data.completed, array.$get(data.completed), nextCallback);
    };

    data.mainCb = () -> {
      data.completed++;
      if (data.completed == array.$length()) {
        doneCb.$invoke();
      } else {
        iterate.$invoke(data.mainCb);
      }
    };

    iterate.$invoke(data.mainCb);
  }

  public static <T> void forEachArrayValue(Array<T> array, Callback2<Integer, T> callback) {
    for (int i = 0; i < array.$length(); i++) {
      callback.$invoke(i, array.$get(i));
    }
  }
}
