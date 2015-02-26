package net.wolfTec.cwtactics;

import org.wolfTec.wolfTecEngine.beans.annotations.Bean;
import org.wolfTec.wolfTecEngine.usertest.beans.TestRunner;
import org.wolfTec.wolfTecEngine.usertest.model.FactsBase;
import org.wolfTec.wolfTecEngine.usertest.model.Parser;

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
