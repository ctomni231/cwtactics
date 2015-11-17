package org.wolftec.cwt.view.audio;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwt.core.AssertUtil;
import org.wolftec.cwt.core.NullUtil;
import org.wolftec.cwt.core.annotations.OptionalReturn;
import org.wolftec.cwt.core.javascript.ClassUtil;
import org.wolftec.cwt.core.javascript.JsUtil;
import org.wolftec.cwt.core.javascript.RequestUtil.ArrayBufferRespone;
import org.wolftec.cwt.core.persistence.FolderStorage;

public class Audio {

  /* ---------------- start web audio API ---------------- */

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
    boolean loop;
    double loopStart;
    double loopEnd;
    AudioBuffer buffer;

    native void start(int pos);

    native void stop(int pos);

    // older API
    native void noteOff();
  }

  @STJSBridge
  static class AudioBuffer {

  }

  /* ---------------- end web audio API ---------------- */

  public static final String MUSIC_KEY = "MUSIC_";

  private AudioContext audioContext;
  private GainNode musicNode;
  private GainNode sfxNode;
  private GainNode nullNode;

  private Map<String, AudioBuffer> buffer;

  private boolean musicInLoad;
  private AudioBufferSourceNode musicConnector;
  private String musicIdentifier;

  private final FolderStorage musicFolder;

  public Audio() {

    musicFolder = new FolderStorage("music");

    // TODO API check

    buffer = JSCollections.$map();

    // construct new context
    if (NullUtil.isPresent(Window.AudioContext)) {
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
    return NullUtil.getOrElse(musicNode, nullNode).gain.value;
  }

  public float getMusicVolume() {
    return NullUtil.getOrElse(musicNode, nullNode).gain.value;
  }

  public void setSfxVolume(float vol) {
    if (NullUtil.isPresent(sfxNode)) {
      sfxNode.gain.value = Math.min(Math.max(vol, 0), 1);
    }
  }

  public void setMusicVolume(float vol) {
    if (NullUtil.isPresent(musicNode)) {
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
    AssertUtil.assertThatNot(isBuffered(id));
    buffer.$put(id, buff);
  }

  /**
   * Removes a buffer from the cache.
   * 
   * @param id
   */
  public void unloadBuffer(String id) {
    if (NullUtil.isPresent(buffer.$get(id))) {
      buffer.$delete(id);
    }
  }

  public boolean isBuffered(String id) {
    return NullUtil.isPresent(buffer.$get(id));
  }

  /**
   * Plays an empty sound buffer. Useful to initialize the audio system on
   * restricted system like iOS.
   */
  public void playNullSound() {
    if (NullUtil.isPresent(audioContext)) {
      AudioBufferSourceNode source = audioContext.createBufferSource();
      source.buffer = audioContext.createBuffer(1, 1, 22050);
      source.connect(audioContext.destination);
      source.start(0);
    }
  }

  @OptionalReturn
  public AudioBufferSourceNode playSound(String id, boolean loop) {
    if (NullUtil.isPresent(audioContext)) {
      return playSoundOnGainNode(sfxNode, NullUtil.getOrThrow(buffer.$get(id)), loop);
    }
    return null;
  }

  public boolean playMusic(String id) {
    if (!NullUtil.isPresent(musicNode) || musicInLoad) {
      return false;
    }

    /*
     * break here if the wanted music is already the current played music else
     * we would stop and re-play the music
     */
    if (musicIdentifier == id) {
      return false;
    }

    if (NullUtil.isPresent(musicConnector)) {
      AssertUtil.assertThat(stopMusic(), "failed to stop music");
    }

    setMusicLoadMetaData(id);
    return true;
  }

  private void setMusicLoadMetaData(String id) {
    musicInLoad = true;
    musicIdentifier = id;
    musicFolder.readFile(MUSIC_KEY + id, (musicData -> {
      musicConnector = playSoundOnGainNode(musicNode, convertStringToBuffer((String) musicData), true);
      musicInLoad = false;
    }), JsUtil.throwErrorCallback());
  }

  public boolean stopMusic() {
    if (!NullUtil.isPresent(musicNode) || musicInLoad) {
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
