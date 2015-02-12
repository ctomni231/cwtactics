package org.wolfTec.cwt.utility.gherkin;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.*;

public interface AndGiven extends TestRule {

  public AndGiven given(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);

  public AndGiven andGiven(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);

  public AndThen then(String pattern, Callback3<Array<Object>, Callback0, Callback0> handler);
}
