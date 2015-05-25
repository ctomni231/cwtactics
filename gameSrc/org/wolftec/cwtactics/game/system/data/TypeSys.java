package org.wolftec.cwtactics.game.system.data;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolftec.cwtactics.engine.components.ConstructedClass;
import org.wolftec.cwtactics.game.components.IEntityComponent;
import org.wolftec.cwtactics.game.components.data.BuyableCmp;
import org.wolftec.cwtactics.game.components.data.DirectFighting;
import org.wolftec.cwtactics.game.components.data.FuelDrainerCmp;
import org.wolftec.cwtactics.game.components.data.HidableCmp;
import org.wolftec.cwtactics.game.components.data.IndirectFighting;
import org.wolftec.cwtactics.game.components.data.MainWeaponDamageMap;
import org.wolftec.cwtactics.game.components.data.MovingAbilityCmp;
import org.wolftec.cwtactics.game.components.data.MovingCostsCmp;
import org.wolftec.cwtactics.game.components.data.RepairerCmp;
import org.wolftec.cwtactics.game.components.data.SecondaryWeaponDamageMap;
import org.wolftec.cwtactics.game.components.data.SuicideCmp;
import org.wolftec.cwtactics.game.components.data.SupplierCmp;
import org.wolftec.cwtactics.game.components.data.TransportCmp;
import org.wolftec.cwtactics.game.components.data.VisionerCmp;
import org.wolftec.cwtactics.game.components.objects.CapturableCmp;
import org.wolftec.cwtactics.game.system.ISystem;

public class TypeSys implements ISystem, ConstructedClass {

  private Array<Class<? extends IEntityComponent>> requiredUnitComponents;
  private Array<Class<? extends IEntityComponent>> optionalUnitComponents;

  @Override
  public void onConstruction() {

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
    optionalUnitComponents.push(BuyableCmp.class);
    optionalUnitComponents.push(CapturableCmp.class);
    optionalUnitComponents.push(MainWeaponDamageMap.class);
    optionalUnitComponents.push(SecondaryWeaponDamageMap.class);
  }

  public void createUnitType(Map<String, Object> data) {
    String id = (String) data.$get("ID");
    entityManager().acquireEntityWithId(id);
    // parse components
  }

  private <T extends IEntityComponent> void parseTypeComponents(String entityId, Map<String, Object> data, Array<Class<T>> requiredComponents,
      Array<Class<T>> optionalComponents) {
    try {

    } catch (Error e) {
      events().ERROR_RAISED.publish("CouldNotReadType: " + JSGlobal.JSON.stringify(data));
    }
  }
}
