package org.wolftec.wCore.validation.validators;

import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.validation.AnnotatedValidator;
import org.wolftec.wCore.validation.ValidationManager;

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
