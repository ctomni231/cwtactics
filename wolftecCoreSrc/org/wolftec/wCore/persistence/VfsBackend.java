package org.wolftec.wCore.persistence;

import org.stjs.javascript.Array;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

/**
 * A virtual file system that will be used by WolfTec to store game data files.
 */
public interface VfsBackend {

  void readKey(String path, Callback2<String, VfsEntity<String>> cb);

  void readKeys(String pathRegEx, Callback2<String, Array<VfsEntity<String>>> cb);

  void writeKey(String path, String value, Callback1<String> cb);

  void hasKeys(String pathRegEx, Callback2<String, Boolean> cb);

  void purgeKey(String path, Callback1<String> cb);

  void purgeKeys(String pathRegEx, Callback1<String> cb);

  void keyList(String pathRegEx, Callback1<Array<String>> callback);
}
