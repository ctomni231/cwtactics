package org.wolftec.cwt.save;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.audio.AudioManager;
import org.wolftec.cwt.save.VolumeSaver.VolumeData;
import org.wolftec.cwt.system.Nullable;

public class VolumeSaver implements GameHandler<VolumeData> {

  private AudioManager audio;

  @STJSBridge
  static class VolumeData {
    float sfx;
    float music;
  }

  @Override
  public void onGameLoad(VolumeData data) {
    Nullable.ifPresent(data.sfx, (v) -> audio.setSfxVolume(v));
    Nullable.ifPresent(data.music, (v) -> audio.setMusicVolume(v));
  }

  @Override
  public void onGameSave(VolumeData data) {
    data.sfx = audio.getSfxVolume();
    data.music = audio.getMusicVolume();
  }

}
