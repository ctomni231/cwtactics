package org.wolfTec.cwt.game.utility;

import org.stjs.javascript.JSObjectAdapter;
import org.wolfTec.cwt.utility.beans.Bean;

/**
 * Utility class to male assertions for given statements.
 */
@Bean public class AssertUtilyBean {

  public void notNull(Object obj) {
    if (obj == null) throw new Error("NullPointerException");
  }

  public void greaterEquals(int actual, int min) {
    if (actual < min) throw new Error("AssertmentFailed");
  }

  public void greaterThen(int actual, int min) {
    if (actual <= min) throw new Error("AssertmentFailed");
  }

  public void lowerEquals(int actual, int min) {
    if (actual > min) throw new Error("AssertmentFailed");
  }

  public void lowerThen(int actual, int min) {
    if (actual >= min) throw new Error("AssertmentFailed");
  }

  public void isNot(Object actual, Object not) {
    if (actual == not) throw new Error("AssertmentFailed");
  }

  public void notEmpty(String actual) {
    if (actual == null || actual.isEmpty()) throw new Error("AssertmentFailed");
  }

  public void hasNoProperty(Object obj, String key) {
    if (JSObjectAdapter.hasOwnProperty(obj, key)) throw new Error("AssertmentFailed");
  }

  public void hasProperty(Object obj, String key) {
    if (!JSObjectAdapter.hasOwnProperty(obj, key)) throw new Error("AssertmentFailed");
  }
}
