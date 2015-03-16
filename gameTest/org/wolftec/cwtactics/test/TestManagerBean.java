package org.wolftec.cwtactics.test;

import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.gherkin.GherkinTestManager;

@ManagedComponent
public class TestManagerBean implements ManagedComponentInitialization{

  @Injected
  private GherkinTestManager runner;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    // TODO add facts
    
  }

}
