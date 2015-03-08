package net.wolfTec.cwtactics;

import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.test.TestManager;
import org.wolfTec.wolfTecEngine.test.gherkin.FactsBase;
import org.wolfTec.wolfTecEngine.test.gherkin.GherkinTestManager;
import org.wolfTec.wolfTecEngine.test.gherkin.Parser;

@ManagedComponent
public class TestManagerBean {

  private FactsBase facts;
  private TestManager runner;
  private Parser parser;

  public TestManagerBean() {
    facts = new FactsBase();
    runner = new GherkinTestManager();
    parser = new Parser();
  }
}
