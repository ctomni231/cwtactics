package org.wolfTec.wolfTecEngine.validation;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Function1;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolftec.core.ComponentManager;
import org.wolftec.core.Injected;
import org.wolftec.core.JsUtil;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.core.ManagerOptions;
import org.wolftec.core.ReflectionUtil;

@ManagedComponent
public class ValidationManager implements ManagedComponentInitialization {
  
  @ManagedConstruction
  private Logger log;
  
  private Map<String, Function1<Object, Boolean>> validationAnnotations;

  private Map<String, // class
              Map<String, // properties
                 Map<String, Object>>> classValidated;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    ManagerOptions options = manager.getComponentByClass(ManagerOptions.class);

    Array<Class<?>> dataClasses = ReflectionUtil.getAnnotatedClasses(options.namespace, DataObject.class);
    
    // TODO 1. get field annotations 
    // 2. save them as map

    validationAnnotations.$put(ReflectionUtil.getSimpleName(StringValue.class), (value) -> {
      if (!JsUtil.isString(value)) {
        return false;
      }
      return true;
    });

    validationAnnotations.$put(ReflectionUtil.getSimpleName(DataObjectValue.class), (value) -> {
      if (value == null || !hasValidData(value, ReflectionUtil.getClass(value))) {
        return false;
      }
      return true;
    });
  }

  /**
   * 
   * @param dataObject
   * @return true, when the data object contains valid data, else false
   */
  public boolean hasValidData(Object dataObject, Class<?> dataClass) {
    Class<?> clazz = ReflectionUtil.getClass(dataObject);
    String clazzName = ReflectionUtil.getSimpleName(clazz);

    if (!JsUtil.hasProperty(classValidated, clazzName)) {
      log.error("the class of the given object is not registered as data object");
      return false;
    }

    Map<String, Map<String, Object>> properties = classValidated.$get(clazzName);
    Array<String> propertyNames = ReflectionUtil.objectKeys(properties);
    
    for (int i = 0; i < propertyNames.$length(); i++) {
      
      String propertyName = propertyNames.$get(i);
      Object propertyValue = JsUtil.getPropertyValue(dataObject, propertyName);
      
      Map<String, Object> validationData = properties.$get(clazzName);
      Array<String> annoations = ReflectionUtil.objectKeys(validationData);
      
      for (int j = 0; j < annoations.$length(); j++) {
        
        String annotation = annoations.$get(j);
        
        if (JsUtil.hasProperty(validationAnnotations, annotation)) {
          validationAnnotations.$get(annotation).$invoke(propertyValue);
        }
      }
    }

    return true;
  }
}
