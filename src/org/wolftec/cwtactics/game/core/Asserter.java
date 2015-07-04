package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.Constants;
import org.wolftec.cwtactics.engine.util.JsUtil;

public class Asserter extends Log implements ConstructedObject {

  private Object value;
  private String valueName;
  private boolean anAssertionFailed;

  /**
   * Grabs the focus of a given value. All assertions will be checked against on
   * the inspected value.
   * 
   * @param pName
   * @param pValue
   */
  public Asserter inspectValue(String pName, Object pValue) {
    value = pValue;
    valueName = pName;
    return this;
  }

  public <T extends IEntityComponent> Asserter whenNotNull(Callback0 validationFn) {
    if (value != null) {
      validationFn.$invoke();
    }
    return this;
  }

  public Asserter forEachArrayValue(Callback1<Object> valueCb) {
    isArray();

    if (value != null) {
      String oldName = valueName;
      Array<Object> oldValue = (Array<Object>) value;

      for (int i = 0; i < oldValue.$length(); i++) {
        inspectValue(oldName + " - array item #" + i + " - ", oldValue.$get(i));
        valueCb.$invoke(oldValue.$get(i));
      }

      inspectValue(oldName, oldValue);
    }
    return this;
  }

  public Asserter forEachMapKey(Callback1<String> valueCb) {
    isNotNull();

    if (value != null) {
      String oldName = valueName;
      Object oldValue = value;

      Array<String> valueArr = JsUtil.objectKeys(value);
      for (int i = 0; i < valueArr.$length(); i++) {

        String entryKey = valueArr.$get(i);

        inspectValue(oldName + " - object item key #" + i + " - ", entryKey);
        valueCb.$invoke(entryKey);
      }

      inspectValue(oldName, oldValue);
    }
    return this;
  }

  public Asserter forEachMapValue(Callback1<Object> valueCb) {
    isNotNull();

    if (value != null) {
      String oldName = valueName;
      Object oldValue = value;

      Array<String> valueArr = JsUtil.objectKeys(value);
      for (int i = 0; i < valueArr.$length(); i++) {

        String entryKey = valueArr.$get(i);
        Object entryValue = JSObjectAdapter.$get(oldValue, entryKey);

        inspectValue(oldName + " - object item value for key " + entryKey + " - ", entryValue);
        valueCb.$invoke(entryValue);
      }

      inspectValue(oldName, oldValue);
    }
    return this;
  }

  public Asserter isEntityId() {
    isString();
    if (value == null || value.toString().length() != Constants.IDENTIFIER_LENGTH) {
      assertionFailed("to be a string which matches the entity id format");
    }
    return this;
  }

  public Asserter isString() {
    if (value == null || JSGlobal.typeof(value) != "string") {
      assertionFailed("to be a string");
    }
    return this;
  }

  public Asserter isArray() {

    // make value local here to prevent breaking $js statement when the instance
    // variable name changes
    Object value = this.value;

    if (value == null || !(boolean) JSObjectAdapter.$js("Array.isArray(value)")) {
      assertionFailed("to be an array");
    }
    return this;
  }

  public Asserter isInt() {
    if (value == null || JSGlobal.typeof(value) != "number" || Math.floor((int) value) != (int) value) {
      assertionFailed("to be an int");
    }
    return this;
  }

  public Asserter isIntWithinRange(int from, int to) {
    isInt();
    if (value == null || (int) value < from || (int) value > to) {
      assertionFailed("between " + from + " and " + to + " (includign bounds)");
    }
    return this;
  }

  public Asserter isBoolean() {
    if (JSGlobal.typeof(value) != "boolean") {
      assertionFailed("to be boolean");
    }
    return this;
  }

  public Asserter isNotNull() {
    if (value == null) {
      assertionFailed("to be not null");
    }
    return this;
  }

  public Asserter isTrue() {
    if ((boolean) value != true) {
      assertionFailed("to be true");
    }
    return this;
  }

  public Asserter isGreaterEquals(int checkValue) {
    if ((int) value < checkValue) {
      assertionFailed("to be greater equals " + checkValue);
    }
    return this;
  }

  public Asserter isLowerEquals(int checkValue) {
    if ((int) value > checkValue) {
      assertionFailed("to be lower equals " + checkValue);
    }
    return this;
  }

  public Asserter isFalse() {
    if ((boolean) value == true) {
      assertionFailed("to be false");
    }
    return this;
  }

  public Asserter euqals(Object checkObject) {
    if (value != checkObject) {
      assertionFailed("to be equal " + JSGlobal.JSON.stringify(checkObject));
    }
    return this;
  }

  public Asserter resetFailureDetection() {
    anAssertionFailed = false;
    return this;
  }

  public Asserter throwErrorWhenFailureDetected() {
    if (anAssertionFailed) {
      JSObjectAdapter.$js("throw new Error('AssertionFailures')");
    }
    return this;
  }

  private void assertionFailed(String msg) {
    error("expected " + valueName + " " + msg + " [actual value is: " + value + "]");
    anAssertionFailed = true;
  }
}
