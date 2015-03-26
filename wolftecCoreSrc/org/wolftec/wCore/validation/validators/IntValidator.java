package org.wolftec.wCore.validation.validators;

import org.wolftec.wCore.core.JsExec;
import org.wolftec.wCore.core.JsUtil;
import org.wolftec.wCore.validation.AnnotatedValidator;
import org.wolftec.wCore.validation.ValidationManager;

public class IntValidator implements AnnotatedValidator<IntValue> {

  @Override
  public Class<IntValue> getAnnoationClass() {
    return IntValue.class;
  }

  @Override
  public boolean validate(ValidationManager manager, Object value, String name, IntValue metaData) {
    if ((boolean) JsExec.injectJS("typeof value !== 'number'")) return false;
    if ((boolean) JsExec.injectJS("value % 0 !== 0")) return false;

    int iValue = (int) value;
    if (JsUtil.notUndef(metaData.min()) && iValue < metaData.min()) return false;
    if (JsUtil.notUndef(metaData.max()) && iValue > metaData.max()) return false;
    if (JsUtil.notUndef(metaData.not()) && iValue == metaData.not()) return false;

    return true;
  }

}
