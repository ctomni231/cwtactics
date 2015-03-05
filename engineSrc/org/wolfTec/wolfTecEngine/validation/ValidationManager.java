package org.wolfTec.wolfTecEngine.validation;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Function1;
import org.wolfTec.wolfTecEngine.EngineOptions;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.logging.LogManager;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.util.ReflectionUtil;
import org.wolfTec.wolfTecEngine.util.JsUtil;

@ManagedComponent(whenQualifier="validation=WOLFTEC")
public class ValidationManager implements ManagedComponentInitialization {
  
  private Logger log;
  
  private Map<String, Function1<Object, Boolean>> validationAnnotations;

  @Injected(isClassAnnotation = true)
  private Map<String, // class
              Map<String, // properties
                 Map<String, Object>>> classValidated;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    log = manager.getComponentByClass(LogManager.class).createByClass(getClass());
    EngineOptions options = manager.getComponentByClass(EngineOptions.class);

    Array<Class<?>> dataClasses = ReflectionUtil.getClassesWithAnnoation(options.namespace, DataObject.class);
    
    // TODO 1. get field annotations 
    // 2. save them as map

    validationAnnotations.$put(ReflectionUtil.getSimpleName(StringValue.class), (value) -> {
      if (!JsUtil.isString(value)) {
        return false;
      }
      return true;
    });

    validationAnnotations.$put(ReflectionUtil.getSimpleName(DataObjectValue.class), (value) -> {
      if (value == null || !hasValidData(value)) {
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
  public boolean hasValidData(Object dataObject) {
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
