package org.wolftec.cwt.system;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

public class SoundLoader implements ResourceLoader {

  @Override
  public String forPath() {
    return "audio/sfx";
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Object> doneCb) {

  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {

  }

}
