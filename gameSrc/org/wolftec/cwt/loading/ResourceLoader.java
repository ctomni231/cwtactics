package org.wolftec.cwt.loading;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.serialization.FileDescriptor;

/**
 * A class which implements this interface will be automatically a
 * {@link ManagedClass}. {@link ResourceLoader} classes will be a part of the
 * data loading system and will be invoked to grab resources from a remote
 * storage.
 */
public interface ResourceLoader extends ManagedClass
{

  /**
   * 
   * @return the path that will be loaded by the {@link ResourceLoader}
   */
  String forPath();

  /**
   * Loads the given data key from the remote data location.
   * 
   * @param entryDesc
   * @param doneCb
   *          (Data) should be called after the resource was loaded successfully
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
