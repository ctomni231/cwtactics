package org.wolfTec.utility;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.*;

public interface AndWhen extends TestRule {

  public AndWhen when(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);
  public AndWhen andWhen(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);
  public AndThen then(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);
}
