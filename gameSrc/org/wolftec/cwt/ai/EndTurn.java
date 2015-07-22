package org.wolftec.cwt.ai;

public class EndTurn implements AiAction {

  @Override
  public void evaluate(Object model) {
  }

  @Override
  public int rating(Object model) {
    // use lowest possible rating here to make sure, that endTurn will be
    // invoked at last
    return 1;
  }

}
