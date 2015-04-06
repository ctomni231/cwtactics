package org.wolftec.cwtactics.test;

import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.test.gherkin.GherkinTestManager;

@ManagedComponent
public class TestManagerBean implements ManagedComponentInitialization{

  @Injected
  private GherkinTestManager runner;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    // TODO add facts
    
  }

}
