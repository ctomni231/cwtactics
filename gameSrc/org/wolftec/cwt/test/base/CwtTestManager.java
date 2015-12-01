package org.wolftec.cwt.test.base;

import org.wolftec.cwt.controller.ui.UserInteractionData;
import org.wolftec.cwt.logic.LifecycleLogic;
import org.wolftec.cwt.logic.MoveLogic;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.model.gameround.Battlefield;
import org.wolftec.cwt.model.sheets.SheetDatabase;
import org.wolftec.cwt.model.tags.Tags;

public class CwtTestManager implements ManagedClass {

  SheetDatabase sheets;
  Battlefield model;
  UserInteractionData uiData;
  LifecycleLogic life;
  MoveLogic move;
  Tags cfg;

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
