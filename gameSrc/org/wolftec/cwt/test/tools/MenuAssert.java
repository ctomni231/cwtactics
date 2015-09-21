package org.wolftec.cwt.test.tools;

import org.wolftec.cwt.core.JsUtil;
import org.wolftec.cwt.core.test.Assert;
import org.wolftec.cwt.states.UserInteractionData;

public class MenuAssert extends Assert {

  public MenuAssert(Object lValue) {
    super(lValue);
    if (!(lValue instanceof UserInteractionData)) {
      JsUtil.throwError("Unexpected");
    }
  }

  @Override
  public Assert empty() {
    UserInteractionData data = (UserInteractionData) value;
    if (data.getNumberOfInfos() > 0) {
      JsUtil.throwError("AssertionFailed: expected user menu to be empty");
    }
    return this;
  }

  @Override
  public Assert notEmpty() {
    UserInteractionData data = (UserInteractionData) value;
    if (data.getNumberOfInfos() == 0) {
      JsUtil.throwError("AssertionFailed: expected user menu not to be empty");
    }
    return this;
  }

  @Override
  public Assert contains(Object entry) {
    UserInteractionData data = (UserInteractionData) value;
    for (int i = 0; i < data.getNumberOfInfos(); i++) {
      if (data.getInfoAtIndex(i) == entry) {
        return this;
      }
    }
    return JsUtil.throwError("AssertionFailed: expected " + entry + " to be in user menu");
  }

  @Override
  public Assert notContains(Object entry) {
    UserInteractionData data = (UserInteractionData) value;
    for (int i = 0; i < data.getNumberOfInfos(); i++) {
      if (data.getInfoAtIndex(i) == entry) {
        JsUtil.throwError("AssertionFailed: expected " + entry + " not to be in user menu");
      }
    }
    return this;
  }

}