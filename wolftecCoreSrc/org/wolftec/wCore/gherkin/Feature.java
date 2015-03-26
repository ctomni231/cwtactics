package org.wolftec.wCore.gherkin;

import org.stjs.javascript.Array;
import org.wolftec.wCore.container.ContainerUtil;

public class Feature {

  public String name;
  public String description;
  public Array<Screnario> scenarios;

  public Feature() {
    scenarios = ContainerUtil.createArray();
  }
}
