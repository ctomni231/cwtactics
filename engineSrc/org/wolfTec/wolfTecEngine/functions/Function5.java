package org.wolfTec.wolfTecEngine.functions;

import org.stjs.javascript.annotation.JavascriptFunction;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.annotation.Template;
import org.stjs.javascript.functions.Function;

@JavascriptFunction
@STJSBridge
public interface Function5<P1, P2, P3, P4, P5, R> extends Function<R> {

  @Template("invoke")
  public R $invoke(P1 p1, P2 p2, P3 p3, P4 p4, P5 p5);
}
