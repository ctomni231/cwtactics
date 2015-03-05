package org.wolfTec.wolfTecEngine.components;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolfTec.wolfTecEngine.EngineOptions;
import org.wolfTec.wolfTecEngine.container.ContainerUtil;
import org.wolfTec.wolfTecEngine.util.ReflectionUtil;
import org.wolfTec.wolfTecEngine.util.JsUtil;

/**
 * The bean factory is the central part of the WolfTecEngine. It controls the
 * construction components and solves their dependencies to other components.
 * Every bean class exists only as singleton in the bean map of the factory.
 */
public class ComponentManager {

  private Map<String, Object> components;

  public ComponentManager(EngineOptions options) {
    components = ContainerUtil.createMap();

    createComponents(options);
    solveDependencies(options);
    invokeConstructionEvent();
  }

  /**
   * 
   * @param clazz
   * @return
   */
  public <T> T getComponentByClass(Class<T> clazz) {
    return (T) ContainerUtil.filterFirstMapEntry(components, (key, component) -> {
      return ReflectionUtil.isInstanceOf(component, clazz);
    });
  }

  /**
   * 
   * @param intfc
   * @return
   */
  public <T> Array<T> getComponentsByClass(Class<T> intfc) {
    Array<T> interfaceComps = ContainerUtil.createArray();
    ContainerUtil.forEachElementInMap(components, (name, component) -> {
      if (ReflectionUtil.isInstanceOf(component, intfc)) {
        interfaceComps.push((T) component);
      }
    });
    
    return interfaceComps;
  }
  
  /**
   * @param bean
   *          name of the bean (usually the class name)
   * @return a bean with the given name
   */
  public <T> T getComponentByName(String beanName) {
    T bean = (T) this.components.$get(beanName);
    if (JSGlobal.undefined == bean) {
      JsUtil.raiseError("UnknownComponentIdentifier");
    }
    return bean;
  }

  /**
   * @param typeConstructor
   *          constructor function object of the wanted bean
   * @return a bean of a given type
   */
  @Deprecated
  public <T> T getComponentOfType(Object typeConstructor) {
    Object bean = null;
    Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.components)");
    for (String beanName : beanNames) {
      if ((boolean) JSObjectAdapter.$js("components[beanName] instanceof typeConstructor")) {
        return (T) components.$get(beanName);
      }
    }

    if (null == bean) {
      JSGlobal.stjs.exception("Unknown bean type");
    }

    return null;
  }

  /**
   * 
   * @param options
   */
  private void createComponents(EngineOptions options) {

    // the engine options is a special managed object and will be a available
    // to be injected in other components
    components.$put("EngineOptions", options);

    createComponentsOfNamspace(options.namespace, options.componentQualifiers);
    createComponentsOfNamspace(options.wolfTecNamespace, options.componentQualifiers);
  }

  /**
   * Creates all components of a namespace.
   * 
   * @param namespace
   */
  private void createComponentsOfNamspace(String namespace, Map<String, String> qualifiers) {
    // TODO qualifier
    
    Array<Class<?>> clazzes = ReflectionUtil.getClassesWithAnnoation(namespace, ManagedComponent.class);
    for (int i = 0; i < clazzes.$length(); i++) {
      Class<?> clazz = clazzes.$get(i);
      this.components.$put(ReflectionUtil.getSimpleName(clazz), ReflectionUtil.getClassInstance(clazz));
    }
  }

  private void invokeConstructionEvent() {
    Array<ManagedComponentInitialization> beans;
    
    beans = getComponentsByClass(ManagedComponentInitialization.class);
    for (int i = 0; i < beans.$length(); i++) {
      beans.$get(i).onComponentConstruction(this);
    }
  }

  /**
   * 
   * @param options
   */
  private void solveDependencies(EngineOptions options) {
    Array<String> beanNames = ReflectionUtil.objectKeys(components);
    for (int i = 0; i < beanNames.$length(); i++) {

      String beanName = beanNames.$get(i);
      Object bean = components.$get(beanName);
      Class<?> beanClass = ReflectionUtil.getClass(bean);

      Array<String> beanProperties = ReflectionUtil.objectKeys(bean);
      for (int j = 0; j < beanProperties.$length(); j++) {
        String beanProperty = beanProperties.$get(j);

        if (ReflectionUtil.hasPropertyAnnotations(beanClass, beanProperty, Injected.class)) {
          String dependencyClassName = ReflectionUtil.getPropertyTypeAsName(bean, beanProperty);
          ReflectionUtil.setProperty(bean, beanProperty, components.$get(dependencyClassName));
        }
      }
    }
  }
}
