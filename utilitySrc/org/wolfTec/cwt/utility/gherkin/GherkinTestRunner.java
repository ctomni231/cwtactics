package org.wolfTec.cwt.utility.gherkin;

import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.Injected;

@Bean public class GherkinTestRunner {
  
  @Injected private Logger log;
  
  public void runAll () {
    
  }
  
  public void runTest () {
    log.info("STARTED");

    log.info("PASSED");
    log.error("FAILED");
    
  }
}
