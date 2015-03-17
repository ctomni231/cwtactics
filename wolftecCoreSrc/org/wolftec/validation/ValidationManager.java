package org.wolftec.validation;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.wolftec.container.ContainerUtil;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.core.ReflectionUtil;
import org.wolftec.log.Logger;

public class ValidationManager implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  private Map<String, AnnotatedValidator<?>> validators;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    validators = ContainerUtil.createMap();
    Array<AnnotatedValidator> validatorList = manager
        .getComponentsByClass(AnnotatedValidator.class);

    for (int i = 0; i < validatorList.$length(); i++) {
      AnnotatedValidator<?> validator = validatorList.$get(i);
      validators.$put(ReflectionUtil.getSimpleName(validator.getAnnoationClass()), validator);
    }
  }

  /**
   * 
   * @param dataObject
   * @return true, when the data object contains valid data, else false
   */
  public boolean validate(Object dataObject, Class<?> dataClass) {
    Array<String> propertyNames = ReflectionUtil.objectKeys(dataObject);
    for (int i = 0; i < propertyNames.$length(); i++) {

      String propertyName = propertyNames.$get(i);
      Object propertyValue = JsUtil.getPropertyValue(dataObject, propertyName);
      Array<?> annoations = ReflectionUtil.getPropertyAnnotations(dataClass, propertyName);

      for (int j = 0; j < annoations.$length(); j++) {
        Object annotation = annoations.$get(j);
        String annotationName = ReflectionUtil.getSimpleName(ReflectionUtil.getClass(annotation));

        if (JsUtil.hasProperty(validators, annotationName)) {
          validators.$get(annotationName).validateGeneric(this, propertyValue, propertyName,
              annotation);
        }
      }
    }

    return true;
  }
}
