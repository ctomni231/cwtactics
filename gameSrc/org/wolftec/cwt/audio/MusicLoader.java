package org.wolftec.cwt.audio;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.DataLoader;
import org.wolftec.cwt.core.FileDescriptor;
import org.wolftec.cwt.system.Maybe;

public class MusicLoader implements DataLoader {

  @Override
  public String forPath() {
    return "audio/music";
  }

  @Override
  public void downloadRemoteFolder(FileDescriptor entryDesc, Callback1<Maybe<Object>> doneCb) {
    // TODO Auto-generated method stub

  }

  @Override
  public void handleFolderEntry(FileDescriptor entryDesc, Object entry, Callback0 doneCb) {
    // TODO Auto-generated method stub

  }

}
