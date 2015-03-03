package org.wolfTec.cwt.game.ai;

import org.wolfTec.wolfTecEngine.decision.Action;
import org.wolfTec.wolfTecEngine.logging.Logger;

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
