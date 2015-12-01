package org.wolftec.cwt.model;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Native;
import org.stjs.javascript.functions.Function0;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.javascript.ObjectUtil;

public class GenericDataObject {

  private Map<String, Object> data;

  @Native
  public GenericDataObject() {
  }

  public GenericDataObject(Object data) {
    this.data = ObjectUtil.asObjectMap(NullUtil.getOrElse(data, JSCollections.$map()));
  }

  public <M> M read(String property) {
    return NullUtil.getOrThrow((M) data.$get(property));
  }

  public <M> M readNullable(String property, M defaultValue) {
    return NullUtil.getOrElse((M) data.$get(property), defaultValue);
  }

  public <M> M readNullableByProvider(String property, Function0<M> defaultValueFactory) {
    M value = (M) data.$get(property);
    return NullUtil.isPresent(value) ? value : defaultValueFactory.$invoke();
  }

  public GenericDataObject readComplex(String property) {
    return new GenericDataObject(NullUtil.getOrThrow(data.$get(property)));
  }

  public GenericDataObject readComplexNullable(String property, Map<String, Object> defaultValue) {
    return new GenericDataObject(NullUtil.getOrElse(data.$get(property), defaultValue));
  }

  public GenericDataObject readComplexNullableByProvider(String property, Function0<Map<String, Object>> defaultValueFactory) {
    Object value = data.$get(property);
    return new GenericDataObject(NullUtil.isPresent(value) ? value : defaultValueFactory.$invoke());
  }

  public <M> void write(String property, M value) {
    data.$put(property, value);
  }

  public GenericDataObject writeComplex(String property) {
    Map<String, Object> subdata = JSCollections.$map();
    data.$put(property, subdata);
    return new GenericDataObject(subdata);
  }

  public String toJSON() {
    return JSGlobal.JSON.stringify(data);
  }

  public static GenericDataObject fromJSON(String json) {
    Map<String, Object> data = (Map<String, Object>) JSGlobal.JSON.parse(json);
    return new GenericDataObject(data);
  }
}
