package org.wolftec.validation.validators;

import java.lang.annotation.Annotation;

import org.stjs.javascript.Map;
import org.wolftec.core.JsExec;
import org.wolftec.validation.AnnotatedValidator;

public class BooleanValidator implements AnnotatedValidator {

  @Override
  public Class<? extends Annotation> getAnnoationClass() {
    return BooleanValue.class;
  }

  @Override
  public boolean validate(Object value, String name, Map<String, Object> metaData) {
    return JsExec.injectJS("typeof value === 'boolean'");
  }

}
