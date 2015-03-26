package org.wolftec.wPlay.decision;

import org.stjs.javascript.Array;

public class Sequence implements Node {

  private Array<Node> nodes;

  public Sequence(Array<Node> nodes) {
    this.nodes = nodes;
  }

  public boolean invoke() {
    for (int i = 0; i < nodes.$length(); i++) {
      if (!this.nodes.$get(i).invoke()) {
        return false;
      }
    }
    return true;
  }
}
