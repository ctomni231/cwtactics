package net.wolfTec.cwtactics;

import org.wolfTec.wolfTecEngine.beans.Bean;
import org.wolfTec.wolfTecEngine.test.FactsBase;
import org.wolfTec.wolfTecEngine.test.Parser;
import org.wolfTec.wolfTecEngine.test.TestRunner;

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
