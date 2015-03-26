package org.wolftec.wCore.validation.validators;

import org.stjs.javascript.Array;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.validation.AnnotatedValidator;
import org.wolftec.wCore.validation.ValidationManager;

public class StringKeyValidator implements AnnotatedValidator<StringKey> {

  private StringValueValidator sValidator;
  
  public StringKeyValidator() {
    sValidator = new StringValueValidator();
  }
  
  @Override
  public Class<StringKey> getAnnoationClass() {
    return StringKey.class;
  }

  @Override
  public boolean validate(ValidationManager manager, Object value, String name, StringKey metaData) {
    Array<String> keys = JsUtil.getObjectKeys(value);
    for (int i = 0; i < keys.$length(); i++) {
      if (!sValidator.validateSingleValue(keys.$get(i), (StringValue) metaData)) {
        return false;
      }
    }
    return true;
  }

}
