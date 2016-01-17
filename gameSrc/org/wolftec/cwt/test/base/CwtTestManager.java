package org.wolftec.cwt.test.base;

import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.ModelManager;
import org.wolftec.cwt.model.sheets.SheetManager;
import org.wolftec.cwt.tags.ConfigurationManager;
import org.wolftec.cwt.ui.UserInteractionData;

public class CwtTestManager implements ManagedClass
{

  SheetManager sheets;
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
  public void onConstruction()
  {
    expectThat = new TestExpectation(this);
    assertThat = new TestAssertion(this);
    modify = new TestAction(this);
    grab = new TestValueGrabber(this);
  }
}
