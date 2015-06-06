package org.wolftec.cwtactics.game.system.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.engine.util.JsUtil;
import org.wolftec.cwtactics.game.IEntityComponent;
import org.wolftec.cwtactics.game.ISystem;
import org.wolftec.cwtactics.game.battle.DirectFighting;
import org.wolftec.cwtactics.game.battle.IndirectFighting;
import org.wolftec.cwtactics.game.battle.MainWeaponDamageMap;
import org.wolftec.cwtactics.game.battle.SecondaryWeaponDamageMap;
import org.wolftec.cwtactics.game.components.data.FuelDrainerCmp;
import org.wolftec.cwtactics.game.components.data.HidableCmp;
import org.wolftec.cwtactics.game.components.data.MovingAbilityCmp;
import org.wolftec.cwtactics.game.components.data.MovingCostsCmp;
import org.wolftec.cwtactics.game.components.data.RepairerCmp;
import org.wolftec.cwtactics.game.components.data.SuicideCmp;
import org.wolftec.cwtactics.game.components.data.SupplierCmp;
import org.wolftec.cwtactics.game.components.data.TransportCmp;
import org.wolftec.cwtactics.game.components.data.VisionerCmp;
import org.wolftec.cwtactics.game.components.objects.CapturableCmp;
import org.wolftec.cwtactics.game.factory.BuyableComponent;

public class TypeSys implements ISystem, ConstructedClass {

  private Array<Class<? extends IEntityComponent>> requiredUnitComponents;
  private Array<Class<? extends IEntityComponent>> optionalUnitComponents;

  @Override
  public void onConstruction() {

    events().ERROR_RAISED.subscribe((err) -> error(err));

    requiredUnitComponents = JSCollections.$array();
    requiredUnitComponents.push(MovingAbilityCmp.class);
    requiredUnitComponents.push(MovingCostsCmp.class);
    requiredUnitComponents.push(VisionerCmp.class);

    optionalUnitComponents = JSCollections.$array();
    optionalUnitComponents.push(FuelDrainerCmp.class);
    optionalUnitComponents.push(HidableCmp.class);
    optionalUnitComponents.push(SuicideCmp.class);
    optionalUnitComponents.push(SupplierCmp.class);
    optionalUnitComponents.push(RepairerCmp.class);
    optionalUnitComponents.push(TransportCmp.class);
    optionalUnitComponents.push(DirectFighting.class);
    optionalUnitComponents.push(IndirectFighting.class);
    optionalUnitComponents.push(BuyableComponent.class);
    optionalUnitComponents.push(CapturableCmp.class);
    optionalUnitComponents.push(MainWeaponDamageMap.class);
    optionalUnitComponents.push(SecondaryWeaponDamageMap.class);
  }

  public void createUnitType(Map<String, Object> data) {
    String id = (String) data.$get("ID");
    parseTypeComponents(entityManager().acquireEntityWithId(id), data, requiredUnitComponents, optionalUnitComponents);
  }

  private void parseTypeComponents(String entityId, Map<String, Object> data, Array<Class<? extends IEntityComponent>> requiredComponents,
      Array<Class<? extends IEntityComponent>> optionalComponents) {

    if (entityId == null) {
      events().ERROR_RAISED.publish("IllegalDatasheetID");
      return;
    }

    try {
      Array<Boolean> solvedRequired = JSCollections.$array();

      Array<String> dataKeys = JsUtil.objectKeys(data);
      for (int i = 0; i < dataKeys.$length(); i++) {
        String componentName = dataKeys.$get(i);

        if (componentName == "ID") {
          continue;
        }

        Class<? extends IEntityComponent> componentClass = (Class<? extends IEntityComponent>) JSObjectAdapter.$get(JSObjectAdapter.$get(Global.window, "cwt"),
            componentName);

        if (componentClass == JSGlobal.undefined) {
          events().ERROR_RAISED.publish("UnknownComponentType: " + componentName);
          return;
        }

        if (requiredComponents.indexOf(componentClass) == -1) {
          if (optionalComponents.indexOf(componentClass) == -1) {
            events().ERROR_RAISED.publish("UnsupportedComponentForEntity: " + componentName);
            return;
          }
        } else {
          solvedRequired.push(true);
        }

        Object componentRawData = data.$get(componentName);

        if (JSGlobal.typeof(componentRawData) == "string") {
          String componentEntityRef = (String) componentRawData;
          entityManager().attachEntityComponent(entityId, gec(componentEntityRef, componentClass));

        } else {
          IEntityComponent component = aec(entityId, componentClass);
          Map<String, Object> componentData = (Map<String, Object>) componentRawData;

          Array<String> componentDataKeys = JsUtil.objectKeys(componentData);
          for (int j = 0; j < componentDataKeys.$length(); j++) {
            JSObjectAdapter.$put(component, componentDataKeys.$get(j), componentData.$get(componentDataKeys.$get(j)));
          }
        }
      }

      if (requiredComponents.$length() != solvedRequired.$length()) {
        events().ERROR_RAISED.publish("NotAllRequiredComponentsFound");
      }

    } catch (Error e) {
      events().ERROR_RAISED.publish("CouldNotReadType: " + JSGlobal.JSON.stringify(data));
    }
  }
}
