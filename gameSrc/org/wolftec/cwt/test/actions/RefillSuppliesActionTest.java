package org.wolftec.cwt.test.actions;

import org.wolftec.cwt.actions.GoToOptions;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.test.tools.AbstractCwtTest;

public class RefillSuppliesActionTest extends AbstractCwtTest {

  private GoToOptions action;

  public void test_neverAvailable() {
    JsUtil.throwError("test missing");
  }
}
