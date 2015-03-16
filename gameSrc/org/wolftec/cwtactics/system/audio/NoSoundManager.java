package org.wolftec.cwtactics.system.audio;

import org.wolftec.core.ComponentManager;
import org.wolftec.core.ComponentScore;
import org.wolftec.core.ManagedComponent;
import org.wolftec.core.ManagedComponentInitialization;
import org.wolftec.core.ManagedConstruction;
import org.wolftec.log.Logger;

/**
 * Fallback manager to prevent breaking components that using the audio
 * interface while having no usable audio backend available.
 */
@ManagedComponent
@ComponentScore(1)
public class NoSoundManager implements AudioManager, ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;
  
  @Override
  public void onComponentConstruction(ComponentManager manager) {
    log.info("Initializing No-Sound-Manager");
  }
  
  @Override
  public boolean isEnabled() {
    return true;
  }

  @Override
  public void playNullSound() {
  }

  @Override
  public void playSFX(String key) {
  }

  @Override
  public boolean playBG(String key) {
    return true;
  }

  @Override
  public boolean stopBG() {
    return true;
  }

  @Override
  public boolean isBuffered(String id) {
    return true;
  }

  @Override
  public void setVolume(AudioChannel channel, int volume) {
  }

  @Override
  public int getVolume(AudioChannel channel) {
    return 0;
  }

  @Override
  public boolean isMusicSupported() {
    return true;
  }

  @Override
  public boolean isSfxSupported() {
    return true;
  }

}
