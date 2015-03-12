package org.wolfTec.wolfTecEngine.container;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.Math;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function2;
import org.wolfTec.wolfTecEngine.components.ReflectionUtil;
import org.wolfTec.wolfTecEngine.util.BrowserUtil;
import org.wolfTec.wolfTecEngine.vfs.VfsEntity;

public abstract class ContainerUtil {

  /**
   * Selects a random element from a given list and returns it. It's possible to
   * give a forbiddenElement that won't be selected from the list.
   *
   * @param list
   * @param forbiddenElement
   * @returns {*}
   */
  public static <T> T selectRandom(Array<T> list, T forbiddenElement) {
    int e = list.$length();
    if (e == 0 || (e == 1 && list.$get(0) == forbiddenElement)) {
      JSGlobal.stjs.exception("IllegalArguments");
    }

    int r = JSGlobal.parseInt(Math.random() * e, 10);
    T selected = list.$get(r);
    if (selected == forbiddenElement) {
      selected = list.$get(r < e - 1 ? r + 1 : r - 1);
    }

    return selected;
  }

  /**
   * 
   * @return
   */
  public static <T> Array<T> createArray() {
    return JSCollections.$array();
  }

  /**
   * 
   * @param array
   * @param value
   * @param amount
   */
  public static <T> void fillArray(Array<T> array, T value, int amount) {
    for (int i = 0; i < amount; i++) {
      array.$set(i, value);
    }
  }

  /**
   * 
   * @return
   */
  public static <T> Map<String, T> createMap() {
    return JSCollections.$map();
  }

  /**
   * 
   * @param map
   * @param cb
   */
  public static <T> void forEachElementInMap (Map<String, T> map, Callback2<String, T> cb) {
    Array<String> keys = ReflectionUtil.objectKeys(map);
    for (int i = 0; i < keys.$length(); i++) {
      String key = keys.$get(i);
      cb.$invoke(key, map.$get(key));
    }
  }
  
  /**
   * 
   * @param map
   * @param cb
   * @return
   */
  public static <T> T filterFirstMapEntry (Map<String, T> map, Function2<String, T, Boolean> cb) {
    Array<String> keys = ReflectionUtil.objectKeys(map);
    for (int i = 0; i < keys.$length(); i++) {
      String key = keys.$get(i);
      if (cb.$invoke(key, map.$get(key)) != null){
        return map.$get(key);
      }
    }
    return null;
  }

  /**
   * 
   * @param map
   * @param cb
   */
  public static <T> void forEachElementInList (Array<T> list, Callback1<T> cb) {
    for (int i = 0; i < list.$length(); i++) {
      cb.$invoke(list.$get(i));
    }
  }

  /**
   * 
   * @param map
   * @param cb
   */
  public static <T> void forEachElementInListAsync (Array<T> list, Callback2<T, Callback0> cb, Callback0 finalCb) {
    
    Array<Callback1<Callback0>> steps = ContainerUtil.createArray();
    
    Callback1<T> addStep = (value) -> {
      steps.push(next -> {
        cb.$invoke(value, next);
      });
    };
    
    for (int i = 0; i < list.$length(); i++) {
      addStep.$invoke(list.$get(i));
    }
    
    BrowserUtil.executeSeries(steps, finalCb);
  }
}
