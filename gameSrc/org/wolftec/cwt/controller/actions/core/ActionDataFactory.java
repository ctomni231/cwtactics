package org.wolftec.cwt.controller.actions.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;

public class ActionDataFactory {

  public static ActionData createObjectFromArray(Array<Integer> data) {
    ActionData dataObject = new ActionData();
    dataObject.id = data.$get(0);
    dataObject.p1 = data.$get(1);
    dataObject.p2 = data.$get(2);
    dataObject.p3 = data.$get(3);
    dataObject.p4 = data.$get(4);
    dataObject.p5 = data.$get(5);
    return dataObject;
  }

  public static Array<Integer> convertDataToArray(ActionData data) {
    return JSCollections.$array(data.id, data.p1, data.p2, data.p3, data.p4, data.p5);
  }

  public static String convertDataToString(ActionData data) {
    return JSGlobal.JSON.stringify(convertDataToArray(data));
  }

  public static void copyData(ActionData source, ActionData target) {
    target.id = source.id;
    target.p1 = source.p1;
    target.p2 = source.p2;
    target.p3 = source.p3;
    target.p4 = source.p4;
    target.p5 = source.p5;
  }
}
