package org.wolfTec.utility;

import net.wolfTec.cwt.Constants;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;

public class BeanFactory {

  private Map<String, Object> beans;
  private String namespace;

  public BeanFactory(String namespace) {
    this.namespace = namespace;
    initBeans();
    solveDependencies();
  }

  /**
   * @param bean
   *          name of the bean (usaly the class name)
   * @return a bean with the given name
   */
  public <T> T getBean(String beanName) {
    T bean = (T) this.beans.$get(beanName);
    if (JSGlobal.undefined == bean) {
      throw new IllegalArgumentException("Unknown bean name");
    }
    return bean;
  }

  /**
   * @param typeConstructor
   *          constructor function object of the wanted bean
   * @return a bean of a given type
   */
  public <T> T getBeanOfType(Object typeConstructor) {
    Object bean = null;
    Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
    for (String beanName : beanNames) {
      if ((boolean) JSObjectAdapter.$js("beans[beanName] instanceof typeConstructor")) {
        return (T) beans.$get(beanName);
      }
    }

    if (null == bean) {
      throw new IllegalArgumentException("Unknown bean type");
    }

    return null;
  }

  /**
   * 
   * @param intfc
   * @return
   */
  public <T> Array<T> getBeansOfInterface(Class<T> intfc) {

    // TODO: search constructor in namespaces
    String intfcName;

    Array<T> list = JSCollections.$array();
    Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
    for (String beanName : beanNames) {
      if ((boolean) JSObjectAdapter.$js("beans[beanName].constructor.$inherit.indexOf(intfcName) !== -1")) {
        list.push(JSObjectAdapter.$js("beans[beanName]"));
      }
    }
    return list;
  }

  /**
   * <strong>Note: </strong> This function is low level and contains real JS
   * code. Modify only if you know what you're doing here.
   */
  private void initBeans() {
    beans = JSCollections.$map();

    // TODO allow overwrite of engine beans from specific namespace

    // search in all classes and convert every class with a name that ends with
    // the string "Bean" into a bean by calling it's constructor with zero
    // arguments.
    Array<String> possibleBeanNames = JSObjectAdapter.$js("Object.keys(cwt)");
    for (String name : possibleBeanNames) {
      if (name.endsWith("Bean")) {
        JSObjectAdapter.$js("this.beans[name] = new window[this.namespace][name]()");
      }
    }
  }

  /**
   * <strong>Note: </strong> This function is low level and contains real JS
   * code. Modify only if you know what you're doing here.
   */
  private void solveDependencies() {
    boolean isDebugEnabled = Constants.DEBUG;

    // search in all beans for properties with a leading '$' character. This
    // properties are references to beans. Place the right bean into this
    // property by searching the correct bean type together with the type
    // description of the class.
    Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
    for (String beanName : beanNames) {

      Object bean = beans.$get(beanName);
      Array<String> beanProperties = JSObjectAdapter.$js("Object.keys(bean)");
      for (String property : beanProperties) {

        boolean hasTypeDescription = JSObjectAdapter.$js("bean.constructor.$typeDescription.hasOwnProperty(property)");
        if (hasTypeDescription) {

          // extract full class name (including namespace) from type description
          String propertyClass = JSObjectAdapter.$js("bean.constructor.$typeDescription[property]");

          if (propertyClass == "Logger") {
            JSObjectAdapter.$js("bean[property] = LogJS.get({name: beanName, enabled: isDebugEnabled})");

          } else if (propertyClass.endsWith("Bean")) {
            // remove namespace from propertyClass
            propertyClass = propertyClass.substring(propertyClass.lastIndexOf(".") + 1);
            JSObjectAdapter.$js("bean[property] = new this.beans[propertyClass]()");

          } else {
            // property with type, but no reference to a bean
          }
        }
      }
    }
  }
}
