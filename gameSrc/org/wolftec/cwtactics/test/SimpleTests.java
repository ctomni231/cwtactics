package org.wolftec.cwtactics.test;

import org.wolftec.cwtactics.game.ITest;
import org.wolftec.cwtactics.game.core.Asserter;
import org.wolftec.cwtactics.game.core.ConstructedClass;

public class SimpleTests implements ITest, ConstructedClass {

  private Asserter asserter;

  public void testWhichSucceeds() {
    asserter.inspectValue("myInt", 10).isInt();
    asserter.inspectValue("myString", "MyString").isString();

    asserter.throwWhenFailureWasDetected();
  }

  public void testWhichFails() {
    asserter.inspectValue("myInt", 10).isString();

    asserter.throwWhenFailureWasDetected();
  }
}
