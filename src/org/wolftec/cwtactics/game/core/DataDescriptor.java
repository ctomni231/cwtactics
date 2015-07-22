package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class DataDescriptor {

  static interface DataAssertion {
    void checkObject(Object object, String propertyName, Object propertyValue);
  }

  static final class IntegerType implements DataAssertion {
    @Override
    public void checkObject(Object object, String propertyName, Object propertyValue) {
      boolean isInteger = (JSGlobal.parseInt(object) % 2) == 0;
    }
  }

  static class PropertyDataDescriptor {
    PropertyDataDescriptor() {
      assertions = JSCollections.$map();
    }

    public Map<String, Array<?>> assertions;
  }

  private Map<String, PropertyDataDescriptor> properties;
  private PropertyDataDescriptor              currentProperty;

  public DataDescriptor() {
    properties = JSCollections.$map();
  }

  // TODO

  public DataDescriptor desc(String name) {
    PropertyDataDescriptor pDescriptor = new PropertyDataDescriptor();
    if (JSObjectAdapter.hasOwnProperty(properties, name)) {
      return JsUtil.throwError("PropertyAlreadyDescribed");
    }
    properties.$put(name, pDescriptor);
    return this;
  }

  public native DataDescriptor isString();

  public DataDescriptor integer() {
    // TODO
    return this;
  }

  public native DataDescriptor le(int max);

  public native DataDescriptor lt(int max);

  public native DataDescriptor ge(int min);

  public native DataDescriptor gt(int min);

  public native DataDescriptor bool();

  public native DataDescriptor map();

  public native DataDescriptor list();

  public native DataDescriptor keys(Callback1<DataDescriptor> keyDesc);

  public native DataDescriptor values(Callback1<DataDescriptor> valueDesc);

  public native DataDescriptor pattern(String pattern);

  public native DataDescriptor componentEntity(Class<? extends Component> clazz);

  public native DataDescriptor oneOf(Object... arguments);

  public native DataDescriptor noneOf(Object... arguments);

  public native DataDescriptor def(Object value);
}
