package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.ischeck.Is;

public abstract class ObjectType {

  public String ID;

  protected void checkExpression(boolean expr, Array<String> errors, String msg) {
    if (!expr) {
      errors.push(msg);
    }
  }

  protected void checkType(ObjectType type, Array<String> errors) {
    type.validateData(errors);
  }

  /**
   * Validates the data type and returns all failures as a list as parameter
   * when calling the callback.
   * 
   * @param callback
   */
  public void validate(Callback1<Array<String>> callback) {
    Array<String> errors = JSCollections.$array();

    checkExpression(Is.is.string(ID) && Is.is.equal(ID.length(), 4), errors, "ID");
    // TODO unique check

    try {
      validateData(errors);
    } catch (Exception validationError) {
    }

    callback.$invoke(errors);
  }

  protected <T> T grabMapValue(Map<String, Object> data, String key, T defaultValue) {
    return JSObjectAdapter.hasOwnProperty(data, key) ? (T) data.$get(key) : defaultValue;
  }

  /**
   * Usable to extend the validation behavior (e.g. when sub type adds new
   * properties).
   * 
   * @param errors
   */
  protected abstract void validateData(Array<String> errors);

  public void grabDataFromMapGlobal(Map<String, Object> data) {
    ID = grabMapValue(data, "ID", null);
    grabDataFromMap(data);
  }

  public abstract void grabDataFromMap(Map<String, Object> data);
}
