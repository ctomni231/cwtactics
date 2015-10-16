package org.wolftec.cwt.audio;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.audio.VolumeSaver.VolumeData;
import org.wolftec.cwt.core.audio.AudioManager;
import org.wolftec.cwt.core.persistence.SavegameHandler;

public class VolumeSaver implements SavegameHandler<VolumeData> {

  private AudioManager audio;

  @STJSBridge
  static class VolumeData {
    float sfx;
    float music;
  }

  @Override
  public void onGameLoad(VolumeData data) {
    // TODO optional ?
    audio.setSfxVolume(data.sfx);
    audio.setMusicVolume(data.music);
  }

  @Override
  public void onGameSave(VolumeData data) {
    data.sfx = audio.getSfxVolume();
    data.music = audio.getMusicVolume();
  }

}
