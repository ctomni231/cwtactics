package net.temp.cwt.game.ai;

import org.wolftec.cwtactics.system.decision.Action;
import org.wolftec.log.Logger;

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
