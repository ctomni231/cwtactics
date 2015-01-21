package net.wolfTec.wtEngine.base;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;

import net.wolfTec.wtEngine.log.LoggerFactoryBeanInterface;

@Namespace("wtEngine") public class WolfTecEngine {
  
	private static Map<String, Object>	beans;
	
  public WolfTecEngine(EngineOptions options) {
    initBeans();
    solveBeanDependencies(options);
  }

  /**
   * @param bean name of the bean (usaly the class name)
   * @return a bean with the given name 
   */
  public <T> T getBean (String beanName) {
    T bean = (T) this.beans.$get(beanName);
    if (JSGlobal.undefined == bean) {
      throw new IllegalArgumentException("Unknown bean name");
    }
    return bean;
  }
  
  /**
   * @param typeConstructor constructor function object of the wanted bean
   * @return a bean of a given type
   */
  public <T> T getBeanOfType (Object typeConstructor) {
    Object bean = null;
    
    Array<String> beanNames = JSObjectAdapter.$js("Object.keys(this.beans)");
		for (String beanName : beanNames) {
  		if ((boolean) JSObjectAdapter.$js("beans.$get(beanName) instanceof typeConstructor")) {
  		  return (T) beans.$get(beanName);
  		}
		}
		
		if (null == bean) {
      throw new IllegalArgumentException("Unknown bean type");
    }
    
    return null;
  }
  
  public String getVersion () {
    return "0.38";
  }

  public String getShortName () {
    return "wtEngine";
  }

  public String getLongName () {
    return "WolfTecEngine © BlackCat and JSRulez";
  }
  
  /**
	 * <strong>Note: </strong> This function is low level and contains real JS
	 * code. Modify only if you know what you're doing here.
	 */
	private static void initBeans() {
		beans = JSCollections.$map();

		// search in all classes and convert every class with a name that ends with the string "Bean" 
		// into a bean by calling it's constructor with zero arguments.
		Array<String> possibleBeanNames = JSObjectAdapter.$js("Object.keys(cwt)");
		for (String name : possibleBeanNames) {
			if (name.endsWith("Bean")) {
				JSObjectAdapter.$js("this.beans[name] = new cwt[name]()");
			}
		}
	}

	/**
	 * <strong>Note: </strong> This function is low level and contains real JS
	 * code. Modify only if you know what you're doing here.
	 */
	private static void solveBeanDependencies(EngineOptions options) {
		boolean isDebugEnabled = options.debugMode;
		LoggerFactoryBeanInterface logFactory = (LoggerFactoryBeanInterface) beans.$get("LoggerFactoryBean");
		
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
						JSObjectAdapter.$js("bean[property] = logFactory.getLogger(beanName, isDebugEnabled)");

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
