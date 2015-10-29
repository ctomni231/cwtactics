package org.wolftec.cwt.model.sheets;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;
import org.wolftec.cwt.core.util.JsUtil;
import org.wolftec.cwt.core.util.NullUtil;
import org.wolftec.cwt.core.util.NumberUtil;
import org.wolftec.cwt.model.sheets.types.SheetType;

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
  private Array<String> types;

  public SheetDatabase() {
    types = JSCollections.$array();
    sheets = JSCollections.$map();
  }

  public void registerSheet(T sheet) {
    NullUtil.mayNotPresent(sheets.$get(sheet.ID), "already registered");

    sheets.$put(sheet.ID, sheet);
    types.push(sheet.ID);
  }

  public T get(String key) {
    T sheet = sheets.$get(key);

    NullUtil.getOrThrow(sheet, "unknown id " + key);
    return sheet;
  }

  /**
   * 
   * @param iterator
   *          called with (sheet.id, sheet) for each sheet in the database
   */
  public void forEach(Callback2<String, T> iterator) {
    for (int i = 0; i < types.$length(); i++) {
      iterator.$invoke(types.$get(i), sheets.$get(types.$get(i)));
    }
  }

  /**
   * 
   * @param filter
   * @return the first entry where filter function returns true
   */
  public T filterFirst(Function2<String, T, Boolean> filter) {
    for (int i = 0; i < types.$length(); i++) {
      if (filter.$invoke(types.$get(i), sheets.$get(types.$get(i)))) {
        return sheets.$get(types.$get(i));
      }
    }
    return JsUtil.throwError("NoMatch");
  }

  /**
   * Picks a random sheet from the database while ignoring the given sheets from
   * the arguments list.
   * 
   * @param arguments
   * @return
   */
  public T random(T... arguments) {
    int numberOfSheets = types.$length();
    int randIndex = NumberUtil.getRandomInt(numberOfSheets);
    int firstIndex = randIndex;

    do {
      T sheet = sheets.$get(types.$get(randIndex));
      boolean inArgs = false;

      for (int i = 0; i < arguments.length; i++) {
        if (arguments[i] == sheet) {
          inArgs = true;

          randIndex++;
          if (randIndex == numberOfSheets) {
            randIndex = 0;
          }

          if (randIndex == firstIndex) {
            JsUtil.throwError("no random item selectable");
          }

          break;
        }
      }

      if (!inArgs) {
        return sheet;
      }
    } while (true);
  }

  public void dropAll() {
    forEach((id, sheet) -> sheets.$delete(id));
    types.splice(0, types.$length());
  }
}
