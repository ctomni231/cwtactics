package org.wolfTec.cwt.utility.gherkin;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;

public class Feature {

  public String name;
  public String description;
  public Array<Screnario> scenarios;

  public Feature() {
    scenarios = JSCollections.$array();
  }
}
