package org.wolftec.cwt.audio;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.core.util.ClassUtil;
import org.wolftec.cwt.core.util.RequestUtil.ArrayBufferRespone;
import org.wolftec.cwt.environment.Features;
import org.wolftec.cwt.persistence.PersistenceManager;
import org.wolftec.cwt.system.Nullable;
import org.wolftec.cwt.system.Option;

public class AudioManager implements Injectable {

  /* ---------------- START OF WEB AUDIO API ---------------- */
  @GlobalScope
  @STJSBridge
  static class Window {
    static Class<AudioContext> AudioContext;
  }

  @STJSBridge
  static class AudioContext {

    native GainNode createGain();

    native AudioBufferSourceNode createBufferSource();

    native AudioBuffer createBuffer(int a, int b, int sampleRate);

    native void decodeAudioData(ArrayBufferRespone arrayBuffer, Callback1<AudioBuffer> successCb, Callback1<Object> errorCb);

    AudioDestinationNode destination;
  }

  @STJSBridge
  static class AudioNode {
    native void connect(AudioNode node);

    native void disconnect();
  }

  @STJSBridge
  static class GainNode extends AudioNode {
    AudioGain gain;

  }

  @STJSBridge
  static class AudioDestinationNode extends AudioNode {
  }

  @STJSBridge
  static class AudioGain {
    float value;
  }

  @STJSBridge
  static class AudioBufferSourceNode extends AudioNode {
    boolean     loop;
    double      loopStart;
    double      loopEnd;
    AudioBuffer buffer;

    native void start(int pos);

    native void stop(int pos);

    // older API
    native void noteOff();
  }

  @STJSBridge
  static class AudioBuffer {

  }

  /* ---------------- END OF WEB AUDIO API ---------------- */

  public static final String       MUSIC_KEY = "MUSIC_";

  private AudioContext             audioContext;
  private GainNode                 musicNode;
  private GainNode                 sfxNode;
  private GainNode                 nullNode;

  private Features                 features;
  private PersistenceManager       persistence;

  private Map<String, AudioBuffer> buffer;

  private boolean                  musicInLoad;
  private AudioBufferSourceNode    musicConnector;
  private String                   musicIdentifier;

  @Override
  public void onConstruction() {
    // ? static or object based ?
    if (features.audioSFX || features.audioMusic) {
      return;
    }

    buffer = JSCollections.$map();

    // construct new context
    if (Nullable.isPresent(Window.AudioContext)) {
      try {
        audioContext = ClassUtil.newInstance(Window.AudioContext);

      } catch (Exception e) {
        return;
      }
    } else {
      return;
    }

    sfxNode = audioContext.createGain();
    sfxNode.gain.value = 1f;
    sfxNode.connect(audioContext.destination);

    musicNode = audioContext.createGain();
    musicNode.gain.value = 0.5f;
    musicNode.connect(audioContext.destination);
  }

  private AudioBufferSourceNode playSoundOnGainNode(AudioNode gainNode, AudioBuffer buffer, boolean loop) {
    AudioBufferSourceNode source = audioContext.createBufferSource();
    source.loop = loop;
    source.buffer = buffer;
    source.connect(gainNode);
    source.start(0);
    return source;
  }

  public void decodeAudio(ArrayBufferRespone arrayBuffer, Callback1<AudioBuffer> successCb, Callback1<Object> errorCb) {
    audioContext.decodeAudioData(arrayBuffer, successCb, errorCb);
  }

  public float getSfxVolume() {
    return Option.ofNullable(sfxNode).orElse(nullNode).gain.value;
  }

  public float getMusicVolume() {
    return Option.ofNullable(musicNode).orElse(nullNode).gain.value;
  }

  // TODO use channel enumeration here

  public void setSfxVolume(float vol) {
    if (Nullable.isPresent(sfxNode)) {
      sfxNode.gain.value = Math.min(Math.max(vol, 0), 1);
    }
  }

  public void setMusicVolume(float vol) {
    if (Nullable.isPresent(musicNode)) {
      musicNode.gain.value = Math.min(Math.max(vol, 0), 1);
    }
  }

  /**
   * Registers an audio buffer object.
   * 
   * @param id
   * @param buff
   */
  public void registerAudioBuffer(String id, AudioBuffer buff) {
    // TODO error if already buffered
    buffer.$put(id, buff);
  }

  /**
   * Removes a buffer from the cache.
   * 
   * @param id
   */
  public void unloadBuffer(String id) {
    if (Nullable.isPresent(buffer.$get(id))) {
      buffer.$delete(id);
    }
  }

  public boolean isBuffered(String id) {
    return Nullable.isPresent(buffer.$get(id));
  }

  /**
   * Plays an empty sound buffer. Useful to initialize the audio system on
   * restricted system like iOS.
   */
  public void playNullSound() {
    if (Nullable.isPresent(audioContext)) {
      AudioBufferSourceNode source = audioContext.createBufferSource();
      source.buffer = audioContext.createBuffer(1, 1, 22050);
      source.connect(audioContext.destination);
      source.start(0);
    }
  }

  //
  // Plays a sound.
  //
  // @param {string} id id of the sound that will be played
  // @param {boolean=} loop (default:false)
  // @return {*}
  //
  public AudioBufferSourceNode playSound(String id, boolean loop) {
    if (!Nullable.isPresent(audioContext)) {
      return null;
    }

    // TODO error buffer does not exists
    return playSoundOnGainNode(sfxNode, buffer.$get(id), loop);
  }

  public boolean playMusic(String id) {
    if (!Nullable.isPresent(musicNode) || musicInLoad) {
      return false;
    }

    // break here if the wanted music is already the current played music
    if (musicIdentifier == id) {
      return false;
    }

    // stop old music
    if (Nullable.isPresent(musicConnector)) {
      if (!stopMusic()) {
        // TODO error
      }
    }

    setMusicLoadMetaData(id);
    return true;
  }

  private void setMusicLoadMetaData(String id) {
    musicInLoad = true;
    musicIdentifier = id;
    persistence.get(MUSIC_KEY + id, (err, data) -> {
      musicConnector = playSoundOnGainNode(musicNode, convertStringToBuffer((String) data), true);
      musicInLoad = false;
    });
  }

  public boolean stopMusic() {
    if (!Nullable.isPresent(musicNode) || musicInLoad) {
      return false;
    }

    musicConnector.noteOff();
    musicConnector.disconnect();

    resetMusicMetaData();
    return true;
  }

  private void resetMusicMetaData() {
    musicConnector = null;
    musicIdentifier = "";
    musicInLoad = false;
  }

  public static String convertBufferToString(AudioBuffer buffer) {
    return JSObjectAdapter.$js("Base64Helper.encodeBuffer(buffer)");

  }

  public static AudioBuffer convertStringToBuffer(String data) {
    return JSObjectAdapter.$js("Base64Helper.decodeBuffer(data)");
  }
}
