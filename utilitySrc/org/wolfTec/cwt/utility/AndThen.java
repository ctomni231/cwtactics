package org.wolfTec.cwt.utility;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.*;

public interface AndThen extends TestRule {

  public AndThen then(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);
  public AndThen andThen(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);
}
