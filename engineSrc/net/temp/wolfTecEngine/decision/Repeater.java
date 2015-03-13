package net.temp.wolfTecEngine.decision;

public class Repeater implements Node {

  private Node node;
  private int times;

  public Repeater(Node node, int times) {
    this.node = node;
    this.times = times;
  }

  @Override
  public boolean invoke() {
    int times = this.times;
    while (times > 0) {
      this.node.invoke();
      times--;
    }
    return true;
  }
}
