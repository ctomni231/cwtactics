package org.wolftec.validation.validators;

import org.wolftec.core.JsExec;
import org.wolftec.validation.AnnotatedValidator;
import org.wolftec.validation.ValidationManager;

public class BooleanValidator implements AnnotatedValidator<BooleanValue> {

  @Override
  public Class<BooleanValue> getAnnoationClass() {
    return BooleanValue.class;
  }

  @Override
  public boolean validate(ValidationManager manager, Object value, String name, BooleanValue metaData) {
    return JsExec.injectJS("typeof value === 'boolean'");
  }

}
