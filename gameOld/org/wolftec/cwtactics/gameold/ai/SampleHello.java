package org.wolftec.cwtactics.gameold.ai;

import org.wolftec.wCore.log.Logger;
import org.wolftec.wPlay.decision.Action;

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
