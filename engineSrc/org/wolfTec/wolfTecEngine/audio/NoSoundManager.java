package org.wolfTec.wolfTecEngine.audio;

import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.components.ComponentScore;
import org.wolfTec.wolfTecEngine.logging.Logger;

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
