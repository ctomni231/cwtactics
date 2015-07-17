package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.game.core.syscomponent.Component;

public class DataDescriptor {
  // TODO

  public native DataDescriptor desc(String name);

  public native DataDescriptor isString();

  public native DataDescriptor integer();

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
