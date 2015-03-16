package org.wolftec.cwtactics.system.decision;

import org.stjs.javascript.Array;

public class Selector implements Node {

  private Array<Node> nodes;

  public Selector(Array<Node> nodes) {
    this.nodes = nodes;
  }

  public boolean invoke() {
    for (int i = 0; i < nodes.$length(); i++) {
      if (this.nodes.$get(i).invoke()) {
        return true;
      }
    }
    return false;
  }
}
