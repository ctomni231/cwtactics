package net.wolfTec.wtEngine.audio;

import net.wolfTec.cwt.Game;
import net.wolfTec.wtEngine.assets.AssetItem;
import net.wolfTec.wtEngine.assets.AssetLoader;
import net.wolfTec.wtEngine.assets.AssetType;
import net.wolfTec.wtEngine.base.PostEngineInitializationListener;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.persistence.StorageEntry;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.JSObjectAdapter;

import static org.stjs.javascript.JSObjectAdapter.*;

@Namespace("wtEngine") public class AudioBean implements PostEngineInitializationListener, AssetLoader {

  public static final String      MUSIC_KEY         = "MUSIC_";

  public static final float       DEFAULT_SFX_VOL   = 1;
  public static final float       DEFAULT_MUSIC_VOL = 0.5f;

  public Logger                   log;

  private int                     apiStatus;

  /**
   * SFX audio node.
   */
  private Object                  sfxNode;

  /**
   * Music audio node.
   */
  private Object                  musicNode;

  /**
   * WebAudio context object.
   */
  private Object                  context;

  /**
   * Cache for audio buffers.
   */
  private Map<String, Object>     buffer;

  private boolean                 musicInLoadProcess;
  private Object                  musicConnector;
  private String                  musicID;

  private Callback1<StorageEntry> musicLoadCallback = new Callback1<StorageEntry>() {
                                                      @Override public void $invoke(StorageEntry entry) {

                                                        // this is a callback,
                                                        // so we need to grab
                                                        // the bean here because
                                                        // this points to a
                                                        // different object
                                                        // TODO: do we change
                                                        // this to automatically
                                                        // match $Audio ?
                                                        AudioBean audio = Game.getBean("$Audio");

                                                        audio.musicConnector = playSoundOnGainNode(audio.musicNode,
                                                            Globals.Base64Helper.decodeBuffer(entry.value), true);
                                                        audio.musicInLoadProcess = false;
                                                      }
                                                    };

  @Override public void onPostEngineInit() {
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

  }

  public void playBG(String key) {

  }

  public void stopBG() {

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

  @Override public void cacheAsset(AssetItem item, Object data, Callback0 callback) {
    // storage.setItem(item.key("path"), this.response, callback);
  }

  @Override public void loadAsset(AssetItem item, Object data, Callback0 callback) {
    // TODO: bind this
    if (item.type != AssetType.MUSIC) {
      $js("this.context.decodeAudioData(data, callback, this.decodeAssetErrorCb)");
    }
  }

  @Override public void grabAsset(AssetItem item, Callback1<Object> callback) {
    $js("var req = new XMLHttpRequest()");
    $js("req.open(\"GET\",item.key(\"path\"),true)");
    $js("req.responseType = \"arraybuffer\"");
    $js("req.onload = callback");
    $js("req.send()");
  }
}
