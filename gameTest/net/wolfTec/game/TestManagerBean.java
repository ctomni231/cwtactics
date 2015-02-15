package net.wolfTec.game;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.gherkin.FactsBase;
import org.wolfTec.wolfTecEngine.gherkin.Parser;
import org.wolfTec.wolfTecEngine.gherkin.TestRunner;

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
