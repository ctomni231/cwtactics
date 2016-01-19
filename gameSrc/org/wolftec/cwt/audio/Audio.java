package org.wolftec.cwt.audio;

import org.wolftec.cwt.audio.AudioService.AudioBufferSourceNode;

public interface Audio
{

  float getSfxVolume();

  float getMusicVolume();

  void setSfxVolume(float vol);

  void setMusicVolume(float vol);

  /**
   * Plays an empty sound buffer. Useful to initialize the audio system on
   * restricted system like iOS.
   */
  void playNullSound();

  AudioBufferSourceNode playSound(String id, boolean loop);

  boolean playMusic(String id);

  boolean stopMusic();

}