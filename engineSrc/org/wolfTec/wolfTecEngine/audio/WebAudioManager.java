package org.wolfTec.wolfTecEngine.audio;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.wolfTecEngine.components.ComponentManager;
import org.wolfTec.wolfTecEngine.components.Injected;
import org.wolfTec.wolfTecEngine.components.JsExec;
import org.wolfTec.wolfTecEngine.components.JsUtil;
import org.wolfTec.wolfTecEngine.components.ManagedComponent;
import org.wolfTec.wolfTecEngine.components.ManagedComponentInitialization;
import org.wolfTec.wolfTecEngine.components.ManagedConstruction;
import org.wolfTec.wolfTecEngine.logging.Logger;
import org.wolfTec.wolfTecEngine.vfs.VirtualFilesystemManager;
import org.wolfTec.wolfTecEngine.vfs.VfsEntity;

@ManagedComponent
public class WebAudioManager implements AudioManager, ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;
  
  @Injected
  private VirtualFilesystemManager vfs;

  private int apiStatus;

  /**
   * SFX audio node.
   */
  private Object sfxNode;

  /**
   * Music audio node.
   */
  private Object musicNode;

  /**
   * WebAudio context object.
   */
  private Object context;

  /**
   * Cache for audio buffers.
   */
  private Map<String, Object> buffer;

  private boolean musicInLoadProcess;
  private Object musicConnector;
  private String musicID;

  private Callback1<Object> musicPlayCallback;

  private Callback1<VfsEntity<Object>> p_musicLoadCallback;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    try {
      log.info("Initialize..");

      // grab context
      Object context = null;
      if (JsUtil.hasProperty(Global.window, "AudioContext")) {
        JsExec.injectJS("context = window.AudioContext;");

      } else if (JsUtil.hasProperty(Global.window, "webkitAudioContext")) {
        JsExec.injectJS("context = window.webkitAudioContext;");

      } else {
        JsUtil.raiseError("No usable WebAudio context found");
      }
      this.context = context;

      musicPlayCallback = (entry) -> {
        musicConnector = playSoundOnGainNode(musicNode, buffer, true);
        musicInLoadProcess = false;
      };

      p_musicLoadCallback = (entry) -> {
        // musicConnector = playSoundOnGainNode(musicNode,
        // Globals.Base64Helper.decodeBuffer(entry.value), true);
        Object buffer = JsExec
            .injectJS("this.context.decodeAudioData(data, this.p_musicPlayCallback, this.decodeAssetErrorCb)");
      };

      // create audio nodes
      sfxNode = createSoundNode(1);
      musicNode = createSoundNode(1);

      buffer = JSCollections.$map();

      log.info("..done");

    } catch (Exception e) {
      log.error("Could not create WebAudio audio manager => " + e);
    }
  }

  private Object createSoundNode(float volume) {
    Object node;
    if (JsUtil.hasProperty(this.context, "createGain")) {
      node = JsExec.injectJS("this.context.createGain()");
    } else {
      node = JsExec.injectJS("this.context.createGainNode()");
    }
    JsExec.injectJS("node.gain.value = volume");
    JsExec.injectJS("node.connect(this.context.destination)");
    return node;
  }

  @Override
  public int getVolume(AudioChannel channel) {
    if (this.context == null) return -1;

    if (channel == AudioChannel.CHANNEL_BG) {
      return JsExec.injectJS("this.musicNode.gain.value");

    } else if (channel == AudioChannel.CHANNEL_SFX) {
      return JsExec.injectJS("this.sfxNode.gain.value");

    } else {
      return -1;
    }
  }

  @Override
  public boolean isBuffered(String id) {
    return JSObjectAdapter.hasOwnProperty(buffer, id);
  }

  @Override
  public boolean isEnabled() {
    return context != null;
  }

  @Override
  public boolean isMusicSupported() {
    return this.context != null;
  }

  @Override
  public boolean isSfxSupported() {
    return this.context != null;
  }

  @Override
  public boolean playBG(String key) {
    if (this.context == null || musicInLoadProcess) {
      return false;
    }

    // already playing this music ?
    if (musicID == key) {
      return false;
    }

    // stop current music
    if (musicConnector != null) {
      stopBG();
    }

    // set meta data
    musicInLoadProcess = true;
    musicID = key;
    vfs.readFile("music/"+key, p_musicLoadCallback);

    return true;
  }

  @Override
  public void playNullSound() {
    if (this.context == null) {
      return;
    }

    playSoundOnGainNode(sfxNode, JsExec.injectJS("context.createBuffer(1, 1, 22050)"), false);
  }

  @Override
  public void playSFX(String key) {
    if (this.context == null) {
      return;
    }
    playSoundOnGainNode(sfxNode, buffer.$get(key), false);
  }

  private Object playSoundOnGainNode(Object gainNode, Object buffer, boolean loop) {
    Object source = JsExec.injectJS("this.context.createBufferSource()");
    JsExec.injectJS("source.loop = loop");
    JsExec.injectJS("source.buffer = buffer");
    JsExec.injectJS("source.connect(gainNode)");

    if (apiStatus == 0) {
      apiStatus = JsUtil.hasProperty(source, "start") ? 1 : 2;
    }

    // use correct start API
    if (apiStatus == 1) {
      JsExec.injectJS("source.start(0)");
    } else {
      JsExec.injectJS("source.noteOn(0)");
    }

    return source;
  }

  @Override
  public void setVolume(AudioChannel channel, int volume) {
    if (this.context == null) {
      return;
    }

    Object node = channel == AudioChannel.CHANNEL_BG ? musicNode : sfxNode;

    if (volume < 0) {
      volume = 0;
    } else if (volume > 1) {
      volume = 1;
    }

    JsExec.injectJS("node.gain.value = volume");
  }

  @Override
  public boolean stopBG() {
    if (this.context == null || musicInLoadProcess) {
      return false;
    }

    // disable current music
    if (musicConnector != null) {

      // api status will be available here, because playSoundOnGainNode is at
      // least called one time
      if (apiStatus == 1) {
        JsExec.injectJS("musicConnector.stop(0)");
      } else {
        JsExec.injectJS("musicConnector.noteOff(0)");
      }

      JsExec.injectJS("musicConnector.disconnect(0)");
    }

    // remove meta data
    musicID = null;
    musicConnector = null;
    musicInLoadProcess = false;

    return true;
  }

}
