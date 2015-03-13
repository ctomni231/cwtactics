package org.wolftec.validation.validators;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.core.JsExec;
import org.wolftec.core.JsUtil;
import org.wolftec.validation.AnnotatedValidator;
import org.wolftec.validation.ValidationManager;

public class StringValueValidator implements AnnotatedValidator<StringValue> {

  @Override
  public Class<StringValue> getAnnoationClass() {
    return StringValue.class;
  }

  @Override
  public boolean validate(ValidationManager manager, Object value, String name, StringValue metaData) {
    Map<String, Object> typedValue = (Map<String, Object>) value;

    Array<String> keys = JsUtil.getObjectKeys(value);
    for (int i = 0; i < keys.$length(); i++) {
      if (!validateSingleValue(typedValue.$get(keys.$get(i)), metaData)) {
        return false;
      }
    }

    return true;
  }

  public boolean validateSingleValue(Object value, StringValue metaData) {
    if ((boolean) JsExec.injectJS("typeof value !== 'string'")) {
      return false;
    }

    String sValue = (String) value;

    if (JsUtil.notUndef(metaData.minLength()) && sValue.length() < metaData.minLength()) {
      return false;
    }
    
    if (JsUtil.notUndef(metaData.maxLength()) && sValue.length() > metaData.maxLength()) {
      return false;
    }

    if (JsUtil.notUndef(metaData.not()) && sValue == metaData.not()) {
      return false;
    }

    if (JsUtil.notUndef(metaData.canBeEmpty()) && ((sValue.length() > 0) || metaData.canBeEmpty())) {
      return false;
    }

    return true;
  }

}
