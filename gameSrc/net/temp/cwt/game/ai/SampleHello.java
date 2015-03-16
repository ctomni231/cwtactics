package net.temp.cwt.game.ai;

import org.wolftec.log.Logger;

import net.temp.wolfTecEngine.decision.Action;

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
