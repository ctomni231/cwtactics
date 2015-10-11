package org.wolftec.cwt.audio;

import org.stjs.javascript.annotation.STJSBridge;
import org.wolftec.cwt.audio.VolumeSaver.VolumeData;
import org.wolftec.cwt.core.audio.AudioManager;
import org.wolftec.cwt.save.GameHandler;
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
