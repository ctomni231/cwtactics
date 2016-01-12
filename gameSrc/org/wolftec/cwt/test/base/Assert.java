package org.wolftec.cwt.test.base;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Function1;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;

public class Assert<T>
{

  protected T value;

  public Assert(T lValue)
  {
    value = lValue;
  }

  public Assert notExists()
  {
    if (value != JSGlobal.undefined && value != null)
    {
      JsUtil.throwError("AssertionFailed: expected nothing, but got " + value);
    }
    return this;
  }

  public Assert exists()
  {
    if (value == JSGlobal.undefined || value == null)
    {
      JsUtil.throwError("AssertionFailed: expected something, but got nothing");
    }
    return this;
  }

  public Assert isTrue()
  {
    return is(true);
  }

  public Assert isFalse()
  {
    return is(false);
  }

  public Assert is(Object o)
  {
    if (value != o)
    {
      JsUtil.throwError("AssertionFailed: expected " + o + ", but got " + value);
    }
    return this;
  }

  public Assert isNot(Object o)
  {
    if (value == o)
    {
      JsUtil.throwError("AssertionFailed: expected not " + o + ", but got it");
    }
    return this;
  }

  public Assert oneOf(Array<Object> list)
  {
    if (list.indexOf(value) == -1)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be in " + JSGlobal.JSON.stringify(list));
    }
    return this;
  }

  public Assert noneOf(Array<Object> list)
  {
    if (list.indexOf(value) != -1)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " not to be in " + JSGlobal.JSON.stringify(list));
    }
    return this;
  }

  public Assert lowerThen(Integer num)
  {
    if (JSGlobal.typeof(value) == "number" && (Integer) value >= num)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number lower then " + num);
    }
    return this;
  }

  public Assert lowerEquals(Integer num)
  {
    if (JSGlobal.typeof(value) == "number" && (Integer) value > num)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number lower equals " + num);
    }
    return this;
  }

  public Assert greaterThen(Integer num)
  {
    if (JSGlobal.typeof(value) == "number" && (Integer) value <= num)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number greater then " + num);
    }
    return this;
  }

  public Assert greaterEquals(Integer num)
  {
    if (JSGlobal.typeof(value) == "number" && (Integer) value < num)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be a number greater equals " + num);
    }
    return this;
  }

  public Assert empty()
  {
    if (!NullUtil.isPresent(JSObjectAdapter.$get(value, "length")))
    {
      JsUtil.throwError("AssertionFailed: not able to be empty");
    }

    if ((int) JSObjectAdapter.$get(value, "length") > 0)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be empty");
    }
    return this;
  }

  public Assert notEmpty()
  {
    if (!NullUtil.isPresent(JSObjectAdapter.$get(value, "length")))
    {
      JsUtil.throwError("AssertionFailed: not able to be empty");
    }

    if ((int) JSObjectAdapter.$get(value, "length") == 0)
    {
      JsUtil.throwError("AssertionFailed: expected " + value + " to be not empty");
    }
    return this;
  }

  public Assert contains(Object... arguments)
  {
    if (!NullUtil.isPresent(JSObjectAdapter.$get(value, "indexOf")))
    {
      JsUtil.throwError("AssertionFailed: not able to hold entries");
    }

    for (int i = 0; i < arguments.length; i++)
    {
      Object entry = arguments[i];
      if (((Array) value).indexOf(entry) == -1)
      {
        JsUtil.throwError("AssertionFailed: expected " + entry + " to be in [" + value + "]");
      }
    }
    return this;
  }

  public Assert notContains(Object... arguments)
  {
    if (!NullUtil.isPresent(JSObjectAdapter.$get(value, "indexOf")))
    {
      JsUtil.throwError("AssertionFailed: not able to hold entries");
    }

    for (int i = 0; i < arguments.length; i++)
    {
      Object entry = arguments[i];
      if (((Array) value).indexOf(entry) != -1)
      {
        JsUtil.throwError("AssertionFailed: expected " + entry + " not to be in [" + value + "]");
      }
    }
    return this;
  }

  public Assert property(String property)
  {
    exists();
    return new Assert(JSObjectAdapter.$get(value, property));
  }

  public <X> Assert<X> propertyByFn(Function1<T, X> fn)
  {
    exists();
    return new Assert(fn.$invoke(value));
  }

  public Assert mustFail(Callback0 failingBlock)
  {
    try
    {
      failingBlock.$invoke();
    }
    catch (Exception expected)
    {
      return this;
    }
    return JsUtil.throwError("AssertionFailed: expected failure but nothing was thrown");
  }
}
