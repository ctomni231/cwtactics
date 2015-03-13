package org.wolftec.validation.validators;

import java.lang.annotation.Annotation;

import org.stjs.javascript.Map;
import org.wolftec.validation.AnnotatedValidator;
import org.wolftec.validation.annotation.FloatValue;

public class FloatValidator implements AnnotatedValidator {

  @Override
  public Class<? extends Annotation> getAnnoationClass() {
    return FloatValue.class;
  }

  @Override
  public boolean validate(Object value, String name, Map<String, Object> metaData) {
    // TODO Auto-generated method stub
    return false;
  }

}
