package org.wolfTec.cwt.game.ai;

import org.wolfTec.wolfTecEngine.decision.model.Action;
import org.wolfTec.wolfTecEngine.logging.model.Logger;

public class SampleHello implements Action {
  
  private Logger log;
  
  public SampleHello(Logger log) {
    this.log = log;
  }
  
  @Override
  public boolean invoke() {
    log.info("Wohooo hello =)");
    return true;
  }

}
