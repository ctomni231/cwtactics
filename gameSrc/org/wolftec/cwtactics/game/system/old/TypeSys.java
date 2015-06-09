package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.core.ConstructedClass;

public class TypeSys implements ISystem, ConstructedClass {
  //
  // private Array<Class<? extends IEntityComponent>> requiredUnitComponents;
  // private Array<Class<? extends IEntityComponent>> optionalUnitComponents;
  //
  // @Override
  // public void onConstruction() {
  //
  // events().ERROR_RAISED.subscribe((err) -> error(err));
  //
  // requiredUnitComponents = JSCollections.$array();
  // requiredUnitComponents.push(MovingAbilityCmp.class);
  // requiredUnitComponents.push(MovingCostsCmp.class);
  // requiredUnitComponents.push(VisionerCmp.class);
  //
  // optionalUnitComponents = JSCollections.$array();
  // optionalUnitComponents.push(FuelDrainerCmp.class);
  // optionalUnitComponents.push(HidableCmp.class);
  // optionalUnitComponents.push(SuicideCmp.class);
  // optionalUnitComponents.push(SupplierCmp.class);
  // optionalUnitComponents.push(RepairerCmp.class);
  // optionalUnitComponents.push(TransportCmp.class);
  // optionalUnitComponents.push(DirectFighting.class);
  // optionalUnitComponents.push(IndirectFighting.class);
  // optionalUnitComponents.push(Buyable.class);
  // optionalUnitComponents.push(CapturableCmp.class);
  // optionalUnitComponents.push(MainWeaponDamageMap.class);
  // optionalUnitComponents.push(SecondaryWeaponDamageMap.class);
  // }
  //
  // public void createUnitType(Map<String, Object> data) {
  // String id = (String) data.$get("ID");
  // parseTypeComponents(entityManager().acquireEntityWithId(id), data,
  // requiredUnitComponents, optionalUnitComponents);
  // }
  //
  // private void parseTypeComponents(String entityId, Map<String, Object> data,
  // Array<Class<? extends IEntityComponent>> requiredComponents,
  // Array<Class<? extends IEntityComponent>> optionalComponents) {
  //
  // if (entityId == null) {
  // events().ERROR_RAISED.publish("IllegalDatasheetID");
  // return;
  // }
  //
  // try {
  // Array<Boolean> solvedRequired = JSCollections.$array();
  //
  // Array<String> dataKeys = JsUtil.objectKeys(data);
  // for (int i = 0; i < dataKeys.$length(); i++) {
  // String componentName = dataKeys.$get(i);
  //
  // if (componentName == "ID") {
  // continue;
  // }
  //
  // Class<? extends IEntityComponent> componentClass = (Class<? extends
  // IEntityComponent>) JSObjectAdapter.$get(JSObjectAdapter.$get(Global.window,
  // "cwt"),
  // componentName);
  //
  // if (componentClass == JSGlobal.undefined) {
  // events().ERROR_RAISED.publish("UnknownComponentType: " + componentName);
  // return;
  // }
  //
  // if (requiredComponents.indexOf(componentClass) == -1) {
  // if (optionalComponents.indexOf(componentClass) == -1) {
  // events().ERROR_RAISED.publish("UnsupportedComponentForEntity: " +
  // componentName);
  // return;
  // }
  // } else {
  // solvedRequired.push(true);
  // }
  //
  // Object componentRawData = data.$get(componentName);
  //
  // if (JSGlobal.typeof(componentRawData) == "string") {
  // String componentEntityRef = (String) componentRawData;
  // entityManager().attachEntityComponent(entityId, gec(componentEntityRef,
  // componentClass));
  //
  // } else {
  // IEntityComponent component = aec(entityId, componentClass);
  // Map<String, Object> componentData = (Map<String, Object>) componentRawData;
  //
  // Array<String> componentDataKeys = JsUtil.objectKeys(componentData);
  // for (int j = 0; j < componentDataKeys.$length(); j++) {
  // JSObjectAdapter.$put(component, componentDataKeys.$get(j),
  // componentData.$get(componentDataKeys.$get(j)));
  // }
  // }
  // }
  //
  // if (requiredComponents.$length() != solvedRequired.$length()) {
  // events().ERROR_RAISED.publish("NotAllRequiredComponentsFound");
  // }
  //
  // } catch (Error e) {
  // events().ERROR_RAISED.publish("CouldNotReadType: " +
  // JSGlobal.JSON.stringify(data));
  // }
  // }
}
