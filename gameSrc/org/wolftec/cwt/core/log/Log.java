package org.wolftec.cwt.core.log;

import org.stjs.javascript.annotation.Native;
import org.wolftec.cwt.core.annotations.OptionalParameter;

public interface Log {

  void info(String msg);

  void warn(String msg);

  @Native
  default void error(String msg) {
    error(msg, null);
  }

  void error(String msg, @OptionalParameter Exception e);
}
