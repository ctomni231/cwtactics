package org.wolftec.cwt.managed;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.util.AssertUtil;
import org.wolftec.cwt.util.ClassUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.ObjectUtil;

public class IoCContainer
{

  private static final String NON_IOC_CANDIDATE_CLASSNAMEPART = "Abstract";

  private Log log;

  private Map<String, ManagedClass> managedObjects;

  public IoCContainer()
  {
    init();
  }

  public <T extends ManagedClass> T getManagedObjectByType(Class<T> clazz)
  {
    String className = ClassUtil.getClassName(clazz);
    T managedObject = (T) managedObjects.$get(className);
    return NullUtil.getOrThrow(managedObject);
  }

  public void init()
  {
    IoCConfiguration config = new IoCConfiguration();
    config.namespaces = JSCollections.$array(Constants.NAMESPACE);

    AssertUtil.assertThat(!NullUtil.isPresent(managedObjects));
    managedObjects = JSCollections.$map();

    /*
     * this class depends on initialized class names on all STJS classes ->
     * thats why we need to make sure that the given namespaces have classes
     * with injected class names... else our IoC container would not work
     */
    prepareNamespaces(config);

    log = new Log();
    log.onConstruction((ManagedClass) this);

    createManagedObjects(config);
    handleManagedDependencies();

    callConstructionEvent();

    callIocReadyEvent();
  }

  private void callConstructionEvent()
  {
    ObjectUtil.forEachMapValue(managedObjects, (instanceName, instance) ->
    {
      instance.onConstruction();
    });
  }

  private void callIocReadyEvent()
  {
    ObjectUtil.forEachMapValue(managedObjects, (instanceName, instance) ->
    {
      if (ClassUtil.classImplementsInterface(ClassUtil.getClass(instance), ObservesIocState.class))
      {
        ((ObservesIocState) instance).onIocReady();
      }
    });
  }

  private void createManagedObjects(IoCConfiguration config)
  {
    ListUtil.forEachArrayValue(config.namespaces, (nsIndex, nsName) ->
    {
      Object namespace = JSObjectAdapter.$get(Global.window, nsName);

      ClassUtil.forEachClassOfNamespace(namespace, (className, classObject) ->
      {
        boolean isManaged = ClassUtil.classImplementsInterface(classObject, ManagedClass.class);
        boolean isAbstract = ClassUtil.getClassName(classObject).startsWith(NON_IOC_CANDIDATE_CLASSNAMEPART);

        if (isManaged && !isAbstract)
        {
          AssertUtil.assertThat(!NullUtil.isPresent(managedObjects.$get(className)));

          /*
           * casting is okay here because isManaged proved that classObject is
           * an object of type Injectable
           */
          managedObjects.$put(className, (ManagedClass) ClassUtil.newInstance(classObject));
        }
      });
    });
  }

  private void handleManagedDependencies()
  {
    ObjectUtil.forEachMapValue(managedObjects, (instanceName, instance) ->
    {
      ClassUtil.forEachComplexPropertyOfInstance(instance, (prop, _ignored) ->
      {
        ClassUtil.searchClassPropertyType(ClassUtil.getClass(instance), prop, (propertyType) ->
        {

          if (propertyType == Array.class)
          {
            tryInjectArrayOfManagedObjects(instance, prop);
            return;

          }

          if (propertyType == Map.class)
          {
            tryInjectMapOfManagedObjects(instance, prop);
            return;
          }

          if (tryInjectManagedObject(instance, prop, propertyType))
          {
            log.info("Injecting instance of " + ClassUtil.getClassName(propertyType) + " into " + instanceName + "."
                + prop);
            return;
          }

          if (tryInjectConstructedObject(instance, prop, propertyType))
          {
            log.info("Injecting instance of " + ClassUtil.getClassName(propertyType) + " into " + instanceName + "."
                + prop);
            return;
          }

        } , () ->
        {
          /*
           * leave property as it is because it seems not to be managed or known
           */
        });
      });
    });
  }

  private void prepareNamespaces(IoCConfiguration config)
  {
    ListUtil.forEachArrayValue(config.namespaces, (nsIndex, nsName) ->
    {
      ClassUtil.initClassNames(JSObjectAdapter.$get(Global.window, nsName));
    });
  }

  private void tryInjectArrayOfManagedObjects(ManagedClass instance, String prop)
  {
    ClassUtil.searchClassPropertySubType(ClassUtil.getClass(instance), prop, 0, (propertyGenericType) ->
    {
      Array<ManagedClass> list = JSCollections.$array();
      ObjectUtil.forEachMapValue(managedObjects, (subInstanceName, subInstance) ->
      {
        if (ClassUtil.classImplementsInterface(ClassUtil.getClass(subInstance), propertyGenericType))
        {
          log.info("Injecting instance of " + subInstanceName + " into the list " + ClassUtil.getClassName(instance)
              + "." + prop);
          list.push(subInstance);
        }
      });
      JSObjectAdapter.$put(instance, prop, list);
    } , () ->
    {

      /*
       * leave property as it is because it seems not to be managed or known
       */
    });
  }

  private boolean tryInjectConstructedObject(ManagedClass instance, String prop, Class<?> propertyType)
  {
    if (ClassUtil.classImplementsInterface(propertyType, Constructable.class))
    {
      Constructable dependency = (Constructable) ClassUtil.newInstance(propertyType);
      dependency.onConstruction(instance);
      JSObjectAdapter.$put(instance, prop, dependency);
      return true;
    }
    return false;
  }

  private boolean tryInjectManagedObject(ManagedClass instance, String prop, Class<?> propertyType)
  {
    if (ClassUtil.classImplementsInterface(propertyType, ManagedClass.class))
    {
      String propertyTypeName = ClassUtil.getClassName(propertyType);
      ManagedClass managedObject = managedObjects.$get(propertyTypeName);
      JSObjectAdapter.$put(instance, prop, NullUtil.getOrThrow(managedObject));
      return true;
    }
    return false;
  }

  private void tryInjectMapOfManagedObjects(ManagedClass instance, String prop)
  {
    ClassUtil.searchClassPropertySubType(ClassUtil.getClass(instance), prop, 1, (propertyGenericType) ->
    {
      Map<String, ManagedClass> map = JSCollections.$map();
      ObjectUtil.forEachMapValue(managedObjects, (subInstanceName, subInstance) ->
      {
        if (ClassUtil.classImplementsInterface(ClassUtil.getClass(subInstance), propertyGenericType))
        {
          log.info("Injecting instance of " + subInstanceName + " into the map " + ClassUtil.getClassName(instance)
              + "." + prop);
          map.$put(subInstanceName, subInstance);
        }
      });
      JSObjectAdapter.$put(instance, prop, map);
    } , () ->
    {

      /*
       * leave property as it is because it seems not to be managed or known
       */
    });
  }
}
