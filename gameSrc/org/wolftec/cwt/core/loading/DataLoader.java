package org.wolftec.cwt.core.loading;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.persistence.FileDescriptor;

public interface DataLoader extends Injectable {

  String forPath();

  /**
   * Loads the given data key from the remote data location.
   * 
   * @param entryDesc
   * @param doneCb
   */
  void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Object> doneCb);

  /**
   * Loads the given data key from the local data location.
   * 
   * @param entryDesc
   * @param entry
   * @param doneCb
   */
  void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb);
}
