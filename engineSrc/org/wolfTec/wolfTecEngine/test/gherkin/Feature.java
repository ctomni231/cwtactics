package org.wolfTec.wolfTecEngine.test.gherkin;

import org.stjs.javascript.Array;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;

public class Feature {

  public String name;
  public String description;
  public Array<Screnario> scenarios;

  public Feature() {
    scenarios = ContainerUtil.createArray();
  }
}
