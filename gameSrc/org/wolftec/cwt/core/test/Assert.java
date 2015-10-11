package org.wolftec.cwt.core.test;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.core.util.JsUtil;

public class Assert {

  protected Object value;

  public Assert(Object lValue) {
    value = lValue;
  }

  public Assert notExists() {
    if (value != JSGlobal.undefined && value != null) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be nothing");
    }
    return this;
  }

  public Assert exists() {
    if (value == JSGlobal.undefined || value == null) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be something");
    }
    return this;
  }

  public Assert is(Object o) {
    if (value != o) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be the same as " + o);
    }
    return this;
  }

  public Assert isNot(Object o) {
    if (value == o) {
      JsUtil.throwError("AssertionFailed: expected " + value + " not to be the same as " + o);
    }
    return this;
  }

  public Assert oneOf(Array<Object> list) {
    if (list.indexOf(value) == -1) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be in " + JSGlobal.JSON.stringify(list));
    }
    return this;
  }

  public Assert noneOf(Array<Object> list) {
    if (list.indexOf(value) != -1) {
      JsUtil.throwError("AssertionFailed: expected " + value + " not to be in " + JSGlobal.JSON.stringify(list));
    }
    return this;
  }

  public Assert lowerThen(Integer num) {
    if (JSGlobal.typeof(value) == "number" && (int) value >= num) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number lower then " + num);
    }
    return this;
  }

  public Assert lowerEquals(Integer num) {
    if (JSGlobal.typeof(value) == "number" && (int) value > num) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number lower equals " + num);
    }
    return this;
  }

  public Assert greaterThen(Integer num) {
    if (JSGlobal.typeof(value) == "number" && (int) value <= num) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number greater then " + num);
    }
    return this;
  }

  public Assert greaterEquals(Integer num) {
    if (JSGlobal.typeof(value) == "number" && (int) value < num) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number greater equals " + num);
    }
    return this;
  }

  public Assert empty() {
    if (JSGlobal.typeof(value) != "string" && !(value instanceof Array) || (int) JSObjectAdapter.$get(value, "length") > 0) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be empty");
    }
    return this;
  }

  public Assert notEmpty() {
    if (JSGlobal.typeof(value) != "string" && !(value instanceof Array) || (int) JSObjectAdapter.$get(value, "length") == 0) {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be not empty");
    }
    return this;
  }

  public Assert contains(Object entry) {
    if (!(value instanceof Array) || ((Array) value).indexOf(entry) == -1) {
      JsUtil.throwError("AssertionFailed: expected " + value + " contains " + entry);
    }
    return this;
  }

  public Assert notContains(Object entry) {
    if (!(value instanceof Array) || ((Array) value).indexOf(entry) != -1) {
      JsUtil.throwError("AssertionFailed: expected " + value + " not contains " + entry);
    }
    return this;
  }

  public Assert property(String property) {
    exists();
    return new Assert(JSObjectAdapter.$get(value, property));
  }
}
