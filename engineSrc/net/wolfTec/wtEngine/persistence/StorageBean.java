package net.wolfTec.wtEngine.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

@Namespace("wtEngine") public class StorageBean {

  public void setItem(String key, Object value, Callback0 callback) {

  }

  public void getItem(String key, Callback1<StorageEntry> callback) {

  }

  public void removeItem(String key, Callback0 callback) {

  }

  public void keys(Callback1<Array<String>> callback /* , regex? */) {

  }

  public void clear(Callback0 callback) {

  }
}
