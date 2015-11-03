package org.wolftec.cwt.audio;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.loading.ResourceLoader;
import org.wolftec.cwt.serialization.FileDescriptor;

class MusicLoader implements ResourceLoader {

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
