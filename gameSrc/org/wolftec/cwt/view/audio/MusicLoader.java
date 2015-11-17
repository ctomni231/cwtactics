package org.wolftec.cwt.view.audio;

import org.wolftec.cwt.core.persistence.FolderStorage;

public class MusicLoader {

  private FolderStorage musicDir;

  public MusicLoader() {
    musicDir = new FolderStorage("audio/music/");
  }

}
