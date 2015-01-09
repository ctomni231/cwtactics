package net.wolfTec.system;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.bridges.Globals;
import net.wolfTec.bridges.webAudio.AudioBuffer;
import net.wolfTec.system.StorageBean.StorageEntry;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback1;

@Namespace("cwt") public class AudioBean {

	public Logger										log;

	public static final String			MUSIC_KEY					= "MUSIC_";
	public static final float				DEFAULT_SFX_VOL		= 1;
	public static final float				DEFAULT_MUSIC_VOL	= 0.5f;

	private int											apiStatus;

	/**
	 * SFX audio node.
	 */
	private Object									sfxNode;

	/**
	 * Music audio node.
	 */
	private Object									musicNode;

	/**
	 * WebAudio context object.
	 */
	private Object									context;

	/**
	 * Cache for audio buffers.
	 */
	private Map<String, Object>			buffer;

	private boolean									musicInLoadProcess;
	private Object									musicConnector;
	private String									musicID;

	private Callback1<StorageEntry>	musicLoadCallback	= new Callback1<StorageBean.StorageEntry>() {
																											@Override public void $invoke(StorageBean.StorageEntry entry) {
																												
																												// this is a callback, so we need to grab the bean here because this points to a different object
																												// TODO: do we change this to automatically match $Audio ?
																												AudioBean audio = CustomWarsTactics.getBean("$Audio");
																												
																												audio.musicConnector = playSoundOnGainNode(audio.musicNode, Globals.Base64Helper.decodeBuffer(entry.value), true);
																												audio.musicInLoadProcess = false;
																											}
																										};

	public void init() {
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
	 * @param node
	 * @param volume
	 */
	private void setVolume(Object node, float volume) {
		if (this.context == null) {
			return;
		}

		if (volume < 0) {
			volume = 0;
		} else if (volume > 1) {
			volume = 1;
		}

		JSObjectAdapter.$js("node.gain.value = volume");
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

	/**
	 * 
	 * @param id
	 * @param loop
	 * @return
	 */
	private Object playSound(String id, boolean loop) {
		return playSoundOnGainNode(sfxNode, buffer.$get(id), loop);
	}

	/**
	 * 
	 * @param arrayBuffer
	 * @param successCb
	 * @param errorCb
	 */
	public void decodeAudio(Object arrayBuffer, Callback1<AudioBuffer> successCb, Callback1<Object> errorCb) {
		if ((boolean) JSObjectAdapter.$js("arrayBuffer instanceof ArrayBuffer")) {
			log.error("IllegalArguments");
		}

		JSObjectAdapter.$js("this.context.decodeAudioData(arrayBuffer, successCb, errorCb)");
	}

	/**
	 * 
	 * @param id
	 * @param audioBuffer
	 */
	public void registerAudioBuffer(String id, Object audioBuffer) {
		if ((boolean) JSObjectAdapter.$js("audioBuffer instanceof AudioBuffer")) {
			log.error("IllegalArguments");
		}

		buffer.$put(id, audioBuffer);
	}

	/**
	 * 
	 * @param id
	 */
	public void unloadBuffer(String id) {
		buffer.$delete(id);
	}

	/**
	 * 
	 * @param id
	 * @return
	 */
	public boolean isBuffered(String id) {
		return JSObjectAdapter.hasOwnProperty(buffer, id);
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

	public void playSfx(String id) {
		if (this.context == null) {
			return;
		}
		playSound(id, false);
	}

	/**
	 * Plays a audio as music object (looped). The audio will stop playing after
	 * stopMusic is triggered or a new music audio will be started.
	 * 
	 * @param id
	 */
	public boolean playMusic(String id) {
		if (this.context == null || musicInLoadProcess) {
			return false;
		}

		// already playing this music ?
		if (musicID == id) {
			return false;
		}

		// stop current music
		if (musicConnector != null) {
			stopMusic();
		}

		// set meta data
		musicInLoadProcess = true;
		musicID = id;
		StorageBean.get(MUSIC_KEY + id, musicLoadCallback);

		return true;
	}

	/**
	 * Stops the currently played music.
	 */
	public boolean stopMusic() {
		if (this.context == null || musicInLoadProcess) {
			return false;
		}

		// disable current music
		if (musicConnector != null) {

			// api status will be available here, because playSoundOnGainNode is at
			// least called one time
			if (apiStatus == 1) {
				JSObjectAdapter.$js("musicConnector.stop(0)");
			} else {
				JSObjectAdapter.$js("musicConnector.noteOff(0)");
			}

			JSObjectAdapter.$js("musicConnector.disconnect(0)");
		}

		// remove meta data
		musicID = null;
		musicConnector = null;
		musicInLoadProcess = false;

		return true;
	}

	public void setMusicVolume(int volume) {
		setVolume(sfxNode, volume);
	}

	public void setSfxVolume(int volume) {
		setVolume(musicNode, volume);
	}

	public float getSfxVolume() {
		return this.context == null ? -1 : JSObjectAdapter.$js("this.sfxNode.gain.value");
	}

	public float getMusicVolume() {
		return this.context == null ? -1 : JSObjectAdapter.$js("this.musicNode.gain.value");
	}
	
	public boolean isMusicSupported () {
		return this.context != null;
	}
	
	public boolean isSfxSupported () {
		return this.context != null;
	}
}
