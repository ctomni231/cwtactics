package org.wolftec.cwtactics.game.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwt.system.ClassUtil;
import org.wolftec.cwtactics.game.core.syscomponent.SystemComponentsManager;
import org.wolftec.cwtactics.game.core.sysevent.SystemEventsManager;
import org.wolftec.cwtactics.game.core.sysobject.SystemObjectsManager;
import org.wolftec.cwtactics.game.core.systems.SystemInstancesManager;

public class Kernel {

  private SystemComponentsManager sysComponentManager;
  private SystemEventsManager     sysEventManager;
  private SystemObjectsManager    sysObjectManager;
  private SystemInstancesManager  sysInstanceManager;

  public void init(Array<Object> namespaces) {

    // this class depends on initialized class names on all stjs classes ->
    // thats why we def. need to inject the names at least here right before the
    // object creation phase
    initNamespaces(namespaces);

    initManagers();
    initSystems(namespaces);
    invokeSystemHandlers();
  }

  private void initNamespaces(Array<Object> namespaces) {
    namespaces.$forEach((namespace) -> ClassUtil.initClassNames(namespace));
  }

  private void initManagers() {
    sysInstanceManager = new SystemInstancesManager();
    sysComponentManager = new SystemComponentsManager();
    sysEventManager = new SystemEventsManager();
    sysObjectManager = new SystemObjectsManager();
  }

  private void initSystems(Array<Object> namespaces) {
    namespaces.$forEach((namespace) -> sysInstanceManager.manageNamespace(namespace));
  }

  private void invokeSystemHandlers() {
    sysInstanceManager.forEach((name, system) -> {
      ClassUtil.forEachClassInstanceProperty(system, (prop, value) -> {

        /* only handle objects that aren't present after creation */
        if (!CheckedValue.of(value).isPresent()) {

          try {
            Class<?> propertyType = ClassUtil.getClassPropertyType(ClassUtil.getClass(system), prop);

            value = sysInstanceManager.getSystemDepedency(system, prop, propertyType);
            if (!CheckedValue.of(value).isPresent()) value = sysComponentManager.getSystemDepedency(system, prop, propertyType);
            if (!CheckedValue.of(value).isPresent()) value = sysObjectManager.getSystemDepedency(system, prop, propertyType);
            if (!CheckedValue.of(value).isPresent()) value = sysEventManager.getSystemDepedency(system, prop, propertyType);

            JSObjectAdapter.$put(system, prop, value);

          } catch (Error e) {
          }
        }
      });

      sysEventManager.handleSystemInstance(system);
    });

    sysInstanceManager.forEach((name, system) -> system.onConstruction());
  }

  public SystemComponentsManager getSysComponentManager() {
    return sysComponentManager;
  }

  public SystemEventsManager getSysEventManager() {
    return sysEventManager;
  }

  public SystemObjectsManager getSysObjectManager() {
    return sysObjectManager;
  }

  public SystemInstancesManager getSysInstanceManager() {
    return sysInstanceManager;
  }
}
