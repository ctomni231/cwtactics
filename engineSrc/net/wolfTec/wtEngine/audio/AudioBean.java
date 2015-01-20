package net.wolfTec.wtEngine.audio;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.bridges.Globals;
import net.wolfTec.system.StorageBean;
import net.wolfTec.system.StorageBean.StorageEntry;
import net.wolfTec.wtEngine.base.PostEngineInitializationListener;
import net.wolfTec.wtEngine.log.Logger;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback1;

@Namespace("wtEngine") public class AudioBean implements PostEngineInitializationListener {

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

  private Callback1<StorageEntry> musicLoadCallback = new Callback1<StorageBean.StorageEntry>() {
                                                      @Override public void $invoke(StorageBean.StorageEntry entry) {

                                                        // this is a callback,
                                                        // so we need to grab
                                                        // the bean here because
                                                        // this points to a
                                                        // different object
                                                        // TODO: do we change
                                                        // this to automatically
                                                        // match $Audio ?
                                                        AudioBean audio = CustomWarsTactics.getBean("$Audio");

                                                        audio.musicConnector = playSoundOnGainNode(audio.musicNode,
                                                            Globals.Base64Helper.decodeBuffer(entry.value), true);
                                                        audio.musicInLoadProcess = false;
                                                      }
                                                    };

  @Override public void onPostEngineInit() {
    try {
      log.info("Initialize..");

      // grab context
      if (JSObjectAdapter.hasOwnProperty(Global.window, "AudioContext")) {
        JSObjectAdapter.$js("this.context = window.AudioContext;");
      } else if (JSObjectAdapter.hasOwnProperty(Global.window, "webkitAudioContext")) {
        JSObjectAdapter.$js("this.context = window.webkitAudioContext;");
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

    playSoundOnGainNode(sfxNode, JSObjectAdapter.$js("context.createBuffer(1, 1, 22050)"), false);
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

    JSObjectAdapter.$js("node.gain.value = volume");
  }

  public int getVolume(AudioChannel channel) {
    if (this.context == null) return -1;

    if (channel == AudioChannel.CHANNEL_BG) {
      return JSObjectAdapter.$js("this.musicNode.gain.value");

    } else if (channel == AudioChannel.CHANNEL_SFX) {
      return JSObjectAdapter.$js("this.sfxNode.gain.value");

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
    if (JSObjectAdapter.hasOwnProperty(this.context, "createGain")) {
      node = JSObjectAdapter.$js("this.context.createGain()");
    } else {
      node = JSObjectAdapter.$js("this.context.createGainNode()");
    }
    JSObjectAdapter.$js("node.gain.value = volume");
    JSObjectAdapter.$js("node.connect(this.context.destination)");
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
    Object source = JSObjectAdapter.$js("this.context.createBufferSource()");
    JSObjectAdapter.$js("source.loop = loop");
    JSObjectAdapter.$js("source.buffer = buffer");
    JSObjectAdapter.$js("source.connect(gainNode)");

    if (apiStatus == 0) {
      apiStatus = JSObjectAdapter.hasOwnProperty(source, "start") ? 1 : 2;
    }

    // use correct start API
    if (apiStatus == 1) {
      JSObjectAdapter.$js("source.start(0)");
    } else {
      JSObjectAdapter.$js("source.noteOn(0)");
    }

    return source;
  }
}
