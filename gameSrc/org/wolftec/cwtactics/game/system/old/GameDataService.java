package org.wolftec.cwtactics.game.system.old;

import org.wolftec.cwtactics.game.core.ConstructedClass;

public class GameDataService implements ConstructedClass {
  //
  // private Map<String, ObjectType> typeMap;
  //
  // @Override
  // public void onConstruction() {
  // typeMap = JSCollections.$map();
  // }
  //
  // /**
  // * Registers a data type object. After that this object can be grabbed type
  // * safe by the get methods of this service.
  // *
  // * @param type
  // */
  // public void registerDataType(ObjectType type) {
  // type.validate((errors) -> {
  // if (errors.$length() > 0) {
  // throwError("InvalidDataType Errors:" + JSGlobal.JSON.stringify(errors));
  //
  // } else if (JSObjectAdapter.hasOwnProperty(typeMap, type.ID)) {
  // throwError("InvalidDataType Errors: ID " + type.ID +
  // " is alreday registered");
  //
  // } else {
  // info("registered " + ClassUtil.getClassName(type) + " object with id " +
  // type.ID);
  // typeMap.$put(type.ID, type);
  // }
  // });
  // }
  //
  // private <T extends ObjectType> T getDataType(String id, String
  // typeClassName) {
  // T type = (T) typeMap.$get(id);
  // if (ClassUtil.getClassName(type) != typeClassName) {
  // throwError("NoDataTypeExists (" + typeClassName + ":" + id + ")");
  // }
  // return type;
  // }
  //
  // public ArmyType getArmy(String armyId) {
  // return getDataType(armyId, ClassUtil.getClassName(ArmyType.class));
  // }
}
