package org.wolftec.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.container.ContainerUtil;

/**
 * The bean factory is the central part of the WolfTecEngine. It controls the
 * construction components and solves their dependencies to other components.
 * Every bean class exists only as singleton in the bean map of the factory.
 */
public class ComponentManager {

  private Map<String, Object> components;
  private ManagerOptions options;
  public Callback1<ComponentManager> onPreInit;
  public Callback1<ComponentManager> onPostInit;

  public ComponentManager(ManagerOptions options) {
    components = ContainerUtil.createMap();
    this.options = options;
    this.onPreInit = null;
    this.onPostInit = null;
  }

  public void initialize() {
    if (onPreInit != null) {
      onPreInit.$invoke(this);
    }
    
    createComponents(options);
    solveDependencies(options);
    invokeConstructionEvent();
    
    if (onPostInit != null) {
      onPostInit.$invoke(this);
    }
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
  private void createComponents(ManagerOptions options) {

    // the engine options is a special managed object and will be a available
    // to be injected in other components
    components.$put("EngineOptions", options);

    createComponentsOfNamspace(options.namespace, options.noComponentCandidates);
    createComponentsOfNamspace(options.wolfTecNamespace, options.noComponentCandidates);
  }

  /**
   * Creates all components of a namespace.
   * 
   * @param namespace
   */
  private void createComponentsOfNamspace(String namespace, Array<Class<?>> preventManaging) {
    // TODO qualifier

    Array<Class<?>> clazzes = ReflectionUtil.getAnnotatedClasses(namespace, ManagedComponent.class);
    for (int i = 0; i < clazzes.$length(); i++) {
      Class<?> clazz = clazzes.$get(i);
      if (preventManaging.indexOf(clazz) == -1) {
        this.components.$put(ReflectionUtil.getSimpleName(clazz),
            ReflectionUtil.getClassInstance(clazz));
      }
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
  private void solveDependencies(ManagerOptions options) {
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
