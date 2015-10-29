package org.wolftec.cwt.core.ioc;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwt.core.collections.ListUtil;
import org.wolftec.cwt.core.collections.ObjectUtil;
import org.wolftec.cwt.core.log.Log;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.NullUtil;

public class IoCContainer {

  private static final String NON_IOC_CANDIDATE_CLASSNAMEPART = "Abstract";

  private Log log;

  private Map<String, Injectable> managedObjects;

  public <T extends Injectable> T getManagedObjectByType(Class<T> clazz) {
    String className = ClassUtil.getClassName(clazz);
    T managedObject = (T) managedObjects.$get(className);
    NullUtil.getOrThrow(managedObject, "unknown state " + className);
    return managedObject;
  }

  public void initByConfig(IoCConfiguration config) {
    if (config.namespaces.indexOf("wEng") == -1) {
      config.namespaces.push("wEng");
    }

    NullUtil.mayNotPresent(managedObjects, "already initialized");
    managedObjects = JSCollections.$map();

    /*
     * this class depends on initialized class names on all STJS classes ->
     * thats why we need to make sure that the given namespaces have classes
     * with injected class names... else our IoC container would not work
     */
    prepareNamespaces(config);

    log = new Log();
    log.onConstruction((Injectable) this);

    createManagedObjects(config);
    handleManagedDependencies();

    callConstructionEvent();

    callIocReadyEvent();
  }

  private void callConstructionEvent() {
    ObjectUtil.forEachMapValue(managedObjects, (instanceName, instance) -> {
      instance.onConstruction();
    });
  }

  private void callIocReadyEvent() {
    ObjectUtil.forEachMapValue(managedObjects, (instanceName, instance) -> {
      if (ClassUtil.classImplementsInterface(ClassUtil.getClass(instance), ObservesIocState.class)) {
        ((ObservesIocState) instance).onIocReady();
      }
    });
  }

  private void createManagedObjects(IoCConfiguration config) {
    ListUtil.forEachArrayValue(config.namespaces, (nsIndex, nsName) -> {
      Object namespace = JSObjectAdapter.$get(Global.window, nsName);

      ClassUtil.forEachClassOfNamespace(namespace, (className, classObject) -> {
        boolean isManaged = ClassUtil.classImplementsInterface(classObject, Injectable.class);
        boolean isAbstract = ClassUtil.getClassName(classObject).startsWith(NON_IOC_CANDIDATE_CLASSNAMEPART);

        if (isManaged && !isAbstract) {
          NullUtil.mayNotPresent(managedObjects.$get(className), "already managed " + className);

          /*
           * casting is okay here because isManaged proved that classObject is
           * an object of type Injectable
           */
          managedObjects.$put(className, (Injectable) ClassUtil.newInstance(classObject));
        }
      });
    });
  }

  private void handleManagedDependencies() {
    ObjectUtil.forEachMapValue(managedObjects, (instanceName, instance) -> {
      ClassUtil.forEachComplexPropertyOfInstance(instance, (prop, _ignored) -> {
        ClassUtil.searchClassPropertyType(ClassUtil.getClass(instance), prop, (propertyType) -> {

          if (propertyType == Array.class) {
            tryInjectArrayOfManagedObjects(instance, prop);
            return;

          }

          if (propertyType == Map.class) {
            tryInjectMapOfManagedObjects(instance, prop);
            return;
          }

          if (tryInjectManagedObject(instance, prop, propertyType)) {
            log.info("Injecting instance of " + ClassUtil.getClassName(propertyType) + " into " + instanceName + "." + prop);
            return;
          }

          if (tryInjectConstructedObject(instance, prop, propertyType)) {
            log.info("Injecting instance of " + ClassUtil.getClassName(propertyType) + " into " + instanceName + "." + prop);
            return;
          }

        } , () -> {
          /*
           * leave property as it is because it seems not to be managed or known
           */
        });
      });
    });
  }

  private void prepareNamespaces(IoCConfiguration config) {
    ListUtil.forEachArrayValue(config.namespaces, (nsIndex, nsName) -> {
      ClassUtil.initClassNames(JSObjectAdapter.$get(Global.window, nsName));
    });
  }

  private void tryInjectArrayOfManagedObjects(Injectable instance, String prop) {
    ClassUtil.searchClassPropertySubType(ClassUtil.getClass(instance), prop, 0, (propertyGenericType) -> {
      Array<Injectable> list = JSCollections.$array();
      ObjectUtil.forEachMapValue(managedObjects, (subInstanceName, subInstance) -> {
        if (ClassUtil.classImplementsInterface(ClassUtil.getClass(subInstance), propertyGenericType)) {
          log.info("Injecting instance of " + subInstanceName + " into the list " + ClassUtil.getClassName(instance) + "." + prop);
          list.push(subInstance);
        }
      });
      JSObjectAdapter.$put(instance, prop, list);
    } , () -> {

      /*
       * leave property as it is because it seems not to be managed or known
       */
    });
  }

  private boolean tryInjectConstructedObject(Injectable instance, String prop, Class<?> propertyType) {
    if (ClassUtil.classImplementsInterface(propertyType, Constructable.class)) {
      Constructable dependency = (Constructable) ClassUtil.newInstance(propertyType);
      dependency.onConstruction(instance);
      JSObjectAdapter.$put(instance, prop, dependency);
      return true;
    }
    return false;
  }

  private boolean tryInjectManagedObject(Injectable instance, String prop, Class<?> propertyType) {
    if (ClassUtil.classImplementsInterface(propertyType, Injectable.class)) {
      String propertyTypeName = ClassUtil.getClassName(propertyType);
      Injectable managedObject = managedObjects.$get(propertyTypeName);
      NullUtil.getOrThrow(managedObject, "missing injectable " + propertyTypeName);
      JSObjectAdapter.$put(instance, prop, managedObject);
      return true;
    }
    return false;
  }

  private void tryInjectMapOfManagedObjects(Injectable instance, String prop) {
    ClassUtil.searchClassPropertySubType(ClassUtil.getClass(instance), prop, 1, (propertyGenericType) -> {
      Map<String, Injectable> map = JSCollections.$map();
      ObjectUtil.forEachMapValue(managedObjects, (subInstanceName, subInstance) -> {
        if (ClassUtil.classImplementsInterface(ClassUtil.getClass(subInstance), propertyGenericType)) {
          log.info("Injecting instance of " + subInstanceName + " into the map " + ClassUtil.getClassName(instance) + "." + prop);
          map.$put(subInstanceName, subInstance);
        }
      });
      JSObjectAdapter.$put(instance, prop, map);
    } , () -> {

      /*
       * leave property as it is because it seems not to be managed or known
       */
    });
  }
}
