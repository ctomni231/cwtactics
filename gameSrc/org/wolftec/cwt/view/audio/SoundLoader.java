package org.wolftec.cwt.view.audio;

import org.wolftec.cwt.core.persistence.FolderStorage;

public class SoundLoader {

  private FolderStorage sfxDir;

  public SoundLoader() {
    sfxDir = new FolderStorage("audio/sfx/");
  }

}
