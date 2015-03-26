package org.wolftec.wPlay.decision;

public class LoopUntilFail implements Node {
  
  private Node node;

  public LoopUntilFail(Node node) {
    this.node = node;
  }
  
  @Override
  public boolean invoke() {
    while (!node.invoke()) {
      // nothing...
    }
    return true;
  }
}
