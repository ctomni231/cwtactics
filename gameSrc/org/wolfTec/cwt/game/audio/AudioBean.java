package org.wolfTec.cwt.game.audio;

import static org.stjs.javascript.JSObjectAdapter.$js;
import static org.stjs.javascript.JSObjectAdapter.hasOwnProperty;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolfTec.cwt.game.assets.AssetItem;
import org.wolfTec.cwt.game.assets.AssetLoader;
import org.wolfTec.cwt.game.assets.AssetType;
import org.wolfTec.cwt.game.log.Logger;
import org.wolfTec.cwt.game.persistence.StorageBean;
import org.wolfTec.cwt.game.persistence.StorageEntry;
import org.wolfTec.cwt.game.utility.BrowserHelperBean;
import org.wolfTec.cwt.game.utility.ExternalRequestOptions;
import org.wolfTec.cwt.utility.beans.Bean;
import org.wolfTec.cwt.utility.beans.BeanFactory;
import org.wolfTec.cwt.utility.beans.Injected;
import org.wolfTec.cwt.utility.beans.InjectedByFactory;
import org.wolfTec.cwt.utility.beans.PostInitialization;

@Bean public class AudioBean implements AssetLoader {

  public static final String MUSIC_KEY = "MUSIC_";

  public static final float DEFAULT_SFX_VOL = 1;
  public static final float DEFAULT_MUSIC_VOL = 0.5f;

  @InjectedByFactory private Logger log;

  @Injected private StorageBean storage;

  @Injected private BrowserHelperBean browser;

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

  private Callback1<Object> musicPlayCallback = (entry) -> {
    musicConnector = playSoundOnGainNode(musicNode, buffer, true);
    musicInLoadProcess = false;
  };

  private Callback1<StorageEntry<Object>> musicLoadCallback = (entry) -> {
    // musicConnector = playSoundOnGainNode(musicNode,
    // Globals.Base64Helper.decodeBuffer(entry.value), true);
    Object buffer = $js("this.context.decodeAudioData(data, this.musicPlayCallback, this.decodeAssetErrorCb)");
  };

  @PostInitialization public void init() {
    try {
      log.info("Initialize..");

      // grab context
      if (hasOwnProperty(Global.window, "AudioContext")) {
        $js("this.context = window.AudioContext;");
      } else if (hasOwnProperty(Global.window, "webkitAudioContext")) {
        $js("this.context = window.webkitAudioContext;");
      } else {
        JSGlobal.stjs.exception("noWebKitFound");
      }

      // create audio nodes
      sfxNode = createSoundNode(DEFAULT_SFX_VOL);
      musicNode = createSoundNode(DEFAULT_MUSIC_VOL);

      buffer = JSCollections.$map();

      log.info("..done");

    } catch (Exception e) {
      log.error("..failed due => " + e);

      // TODO
      // Features features = CustomWarsTactics.getBean("features");
      // features.audioSFX = false;
      // features.audioMusic = false;
    }
  }

  /**
   * Plays an empty sound. Useful to enable the audio output on mobile devices
   * with strict requirements to enable audio (like iOS devices).
   */
  public void playNullSound() {
    if (this.context == null) {
      return;
    }

    playSoundOnGainNode(sfxNode, $js("context.createBuffer(1, 1, 22050)"), false);
  }

  public void playSFX(String key) {
    if (this.context == null) {
      return;
    }
    playSoundOnGainNode(sfxNode, buffer.$get(key), false);
  }

  /**
   * Plays a audio as music object (looped). The audio will stop playing after
   * stopMusic is triggered or a new music audio will be started.
   * 
   * @param id
   */
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
    storage.get(MUSIC_KEY + key, musicLoadCallback);

    return true;
  }

  /**
   * Stops the currently played music.
   */
  public boolean stopBG() {
    if (this.context == null || musicInLoadProcess) {
      return false;
    }

    // disable current music
    if (musicConnector != null) {

      // api status will be available here, because playSoundOnGainNode is at
      // least called one time
      if (apiStatus == 1) {
        $js("musicConnector.stop(0)");
      } else {
        $js("musicConnector.noteOff(0)");
      }

      $js("musicConnector.disconnect(0)");
    }

    // remove meta data
    musicID = null;
    musicConnector = null;
    musicInLoadProcess = false;

    return true;
  }

  /**
   * 
   * @param id
   * @return
   */
  public boolean isBuffered(String id) {
    return JSObjectAdapter.hasOwnProperty(buffer, id);
  }

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

    $js("node.gain.value = volume");
  }

  public int getVolume(AudioChannel channel) {
    if (this.context == null) return -1;

    if (channel == AudioChannel.CHANNEL_BG) {
      return $js("this.musicNode.gain.value");

    } else if (channel == AudioChannel.CHANNEL_SFX) {
      return $js("this.sfxNode.gain.value");

    } else {
      return -1;
    }
  }

  public boolean isMusicSupported() {
    return this.context != null;
  }

  public boolean isSfxSupported() {
    return this.context != null;
  }

  /**
   * 
   * @param volume
   * @return Sound node
   */
  private Object createSoundNode(float volume) {
    Object node;
    if (hasOwnProperty(this.context, "createGain")) {
      node = $js("this.context.createGain()");
    } else {
      node = $js("this.context.createGainNode()");
    }
    $js("node.gain.value = volume");
    $js("node.connect(this.context.destination)");
    return node;
  }

  /**
   * 
   * @param gainNode
   * @param buffer
   * @param loop
   * @return
   */
  private Object playSoundOnGainNode(Object gainNode, Object buffer, boolean loop) {
    Object source = $js("this.context.createBufferSource()");
    $js("source.loop = loop");
    $js("source.buffer = buffer");
    $js("source.connect(gainNode)");

    if (apiStatus == 0) {
      apiStatus = hasOwnProperty(source, "start") ? 1 : 2;
    }

    // use correct start API
    if (apiStatus == 1) {
      $js("source.start(0)");
    } else {
      $js("source.noteOn(0)");
    }

    return source;
  }

  private Callback1<String> decodeAssetErrorCb = (e) -> log.error(e);

  @Override public void loadAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    // TODO Globals.Base64Helper.decodeBuffer(entry.value)
    // TODO realkey
    if (item.type != AssetType.MUSIC) {
      Callback1<Object> loadCb = (data) -> {
        buffer.$put(item.name, data);
        callback.$invoke();
      };
      storage.get(item.path, (entry) -> {
        $js("this.context.decodeAudioData(entry.value, loadCb, this.decodeAssetErrorCb)");
      });
    }
  }

  @Override public void grabAsset(StorageBean storage, AssetItem item, Callback0 callback) {
    ExternalRequestOptions options = new ExternalRequestOptions();
    options.path = item.path;
    options.type = "arraybuffer";
    // TODO realkey
    // TODO Base64Helper.encodeBuffer(request.response),
    // TODO static callbacks?
    options.success = (response) -> {
      // TODO save it
    };
    options.error = (err) -> {
      log.error("CannotLoadAssetException");
    };

    browser.doHttpRequest(options);
  }
}
