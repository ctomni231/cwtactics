package org.wolftec.validation.validators;

import org.wolftec.core.ReflectionUtil;
import org.wolftec.validation.AnnotatedValidator;
import org.wolftec.validation.ValidationManager;

public class DataObjectValidator implements AnnotatedValidator<DataObjectValue> {

  @Override
  public Class<DataObjectValue> getAnnoationClass() {
    return DataObjectValue.class;
  }

  @Override
  public boolean validate(ValidationManager manager, Object value, String name, DataObjectValue metaData) {
    return manager.validate(value, ReflectionUtil.getClass(value));
  }

}
