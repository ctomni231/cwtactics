package org.wolftec.cwt.test;

import org.wolftec.cwt.core.config.ConfigurableValueManager;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.logic.features.LifecycleLogic;
import org.wolftec.cwt.logic.features.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.ModelResetter;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.states.UserInteractionData;

public class CwtTestManager implements Injectable {

  SheetManager sheets;
  ModelResetter modelReset;
  ModelManager model;
  UserInteractionData uiData;
  LifecycleLogic life;
  MoveLogic move;
  ConfigurableValueManager cfg;

  public TestExpectation expectThat;
  public TestAssertion assertThat;
  public TestAction modify;
  public TestValueGrabber grab;

  @Override
  public void onConstruction() {
    expectThat = new TestExpectation(this);
    assertThat = new TestAssertion(this);
    modify = new TestAction(this);
    grab = new TestValueGrabber(this);
  }
}
