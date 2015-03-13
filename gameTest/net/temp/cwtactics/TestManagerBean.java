package net.temp.cwtactics;

import net.temp.wolfTecEngine.test.TestManager;
import net.temp.wolfTecEngine.test.gherkin.FactsBase;
import net.temp.wolfTecEngine.test.gherkin.GherkinTestManager;
import net.temp.wolfTecEngine.test.gherkin.Parser;

import org.wolftec.core.ManagedComponent;

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
