package org.wolftec.wTec.audio;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.wTec.loading.DataLoader;
import org.wolftec.wTec.persistence.FileDescriptor;

public class MusicLoader implements DataLoader {

  @Override
  public String forPath() {
    return "audio/music";
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Object> doneCb) {

  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {

  }

}
