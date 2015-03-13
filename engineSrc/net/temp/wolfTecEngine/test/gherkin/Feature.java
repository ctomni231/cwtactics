package net.temp.wolfTecEngine.test.gherkin;

import net.temp.wolfTecEngine.container.ContainerUtil;

import org.stjs.javascript.Array;

public class Feature {

  public String name;
  public String description;
  public Array<Screnario> scenarios;

  public Feature() {
    scenarios = ContainerUtil.createArray();
  }
}
