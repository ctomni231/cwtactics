package net.temp.wolfTecEngine.decision;

public class Inverter implements Node {
  
  private Node node;

  public Inverter(Node node) {
    this.node = node;
  }
  
  @Override
  public boolean invoke() {
    return !node.invoke();
  }
}
