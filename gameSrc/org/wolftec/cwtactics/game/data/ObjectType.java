package org.wolftec.cwtactics.game.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.ischeck.Is;

public abstract class ObjectType {

  public String ID;

  protected void checkExpression(boolean expr, Array<String> errors, String msg) {
    if (!expr) {
      errors.push(msg);
    }
  }

  protected void checkType(ObjectType tpye, Array<String> errors) {
    tpye.validate((objectErrors) -> objectErrors.$forEach(objectError -> {
      errors.push(objectError);
    }));
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

  /**
   * Usable to extend the validation behavior (e.g. when sub type adds new
   * properties).
   * 
   * @param errors
   */
  protected abstract void validateData(Array<String> errors);
}
