package org.wolftec.cwt.ai;

public interface AiAction {

  public void evaluate(Object model);

  public int rating(Object model);
}
