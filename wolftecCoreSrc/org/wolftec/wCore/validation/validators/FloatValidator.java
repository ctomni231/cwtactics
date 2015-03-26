package org.wolftec.wCore.validation.validators;

import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.validation.AnnotatedValidator;
import org.wolftec.wCore.validation.ValidationManager;

public class FloatValidator implements AnnotatedValidator<FloatValue> {

  @Override
  public Class<FloatValue> getAnnoationClass() {
    return FloatValue.class;
  }

  @Override
  public boolean validate(ValidationManager manager, Object value, String name, FloatValue metaData) {
    if ((boolean) JsExec.injectJS("typeof value !== 'number'")) return false;

    float fValue = (float) value;
    if (JsUtil.notUndef(metaData.min()) && fValue < metaData.min()) return false;
    if (JsUtil.notUndef(metaData.max()) && fValue > metaData.max()) return false;
    if (JsUtil.notUndef(metaData.not()) && fValue == metaData.not()) return false;

    return true;
  }

}
