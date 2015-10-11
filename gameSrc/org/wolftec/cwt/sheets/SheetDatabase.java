package org.wolftec.cwt.sheets;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;
import org.wolftec.cwt.core.util.JsUtil;

/**
 * A data object that holds a list of sheet objects with a given schema. Every
 * sheet that will be added to the data object will be validated first.
 */
public class SheetDatabase<T extends SheetType> {

  /**
   * Holds all type sheet objects.
   */
  private Map<String, T> sheets;

  /**
   * Holds all type names.
   */
  private Array<String>  types;

  public SheetDatabase() {
    types = JSCollections.$array();
    sheets = JSCollections.$map();
  }

  public void registerSheet(T sheet) {
    if (types.indexOf(sheet.ID) != -1) {
      JsUtil.throwError("AlreadyRegistered");
    }

    sheets.$put(sheet.ID, sheet);
    types.push(sheet.ID);
  }

  public void forEach(Callback2<String, T> iterator) {
    for (int i = 0; i < types.$length(); i++) {
      iterator.$invoke(types.$get(i), sheets.$get(types.$get(i)));
    }
  }

  public T filterFirst(Function2<String, T, Boolean> filter) {
    for (int i = 0; i < types.$length(); i++) {
      if (filter.$invoke(types.$get(i), sheets.$get(types.$get(i)))) {
        return sheets.$get(types.$get(i));
      }
    }
    return JsUtil.throwError("NoMatch");
  }

  public T random(T... arguments) {
    return null; // TODO
  }

  public T get(String key) {
    if (!JSObjectAdapter.hasOwnProperty(sheets, key)) {
      return JsUtil.throwError("UnknownSheetId: " + key);
    }
    return sheets.$get(key);
  }

}
