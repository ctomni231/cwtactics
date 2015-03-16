package org.wolftec.cwtactics.system.audio;


public interface AudioManager {

  boolean isEnabled();

  /**
   * Plays an empty sound. Useful to enable the audio output on mobile devices
   * with strict requirements to enable audio (like iOS devices).
   */
  void playNullSound();

  void playSFX(String key);

  /**
   * Plays a audio as music object (looped). The audio will stop playing after
   * stopMusic is triggered or a new music audio will be started.
   * 
   * @param id
   */
  boolean playBG(String key);

  /**
   * Stops the currently played music.
   */
  boolean stopBG();

  boolean isBuffered(String id);

  void setVolume(AudioChannel channel, int volume);

  int getVolume(AudioChannel channel);

  boolean isMusicSupported();

  boolean isSfxSupported();
}
