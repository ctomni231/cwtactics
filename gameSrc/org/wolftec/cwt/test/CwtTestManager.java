package org.wolftec.cwt.test;

import org.wolftec.cwt.logic.features.LifecycleLogic;
import org.wolftec.cwt.logic.features.MoveLogic;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.gameround.ModelResetter;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.states.UserInteractionData;
import org.wolftec.cwt.system.ConfigurationManager;
import org.wolftec.cwt.system.ManagedClass;

public class CwtTestManager implements ManagedClass {

  SheetManager sheets;
  ModelResetter modelReset;
  ModelManager model;
  UserInteractionData uiData;
  LifecycleLogic life;
  MoveLogic move;
  ConfigurationManager cfg;

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
