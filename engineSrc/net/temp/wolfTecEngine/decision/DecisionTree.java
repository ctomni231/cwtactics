package net.temp.wolfTecEngine.decision;

public class DecisionTree {
  
  private Node node;

  public DecisionTree(Node node) {
    this.node = node;
  }
  
  public void iterate() {
    node.invoke();
  }
}
