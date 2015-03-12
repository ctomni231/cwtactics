package org.wolfTec.wolfTecEngine.decision;

import org.stjs.javascript.Array;
import org.wolftec.core.ConvertUtility;

public class Random implements Node {

  private Array<Node> nodes;

  public Random(Array<Node> nodes) {
    this.nodes = nodes;
  }

  public boolean invoke() {
    int index = ConvertUtility.floatToInt(Math.random() * nodes.$length());
    return this.nodes.$get(index).invoke();
  }
}
