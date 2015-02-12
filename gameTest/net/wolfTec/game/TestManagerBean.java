package net.wolfTec.game;

import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.gherkin.FactsBase;
import org.wolfTec.cwt.utility.gherkin.Parser;
import org.wolfTec.cwt.utility.gherkin.TestRunner;

@Bean public class TestManagerBean {

  private FactsBase facts;
  private TestRunner runner;
  private Parser parser;
  
  public TestManagerBean () {
    facts = new FactsBase();
    runner = new TestRunner();
    parser = new Parser();
  }
}
