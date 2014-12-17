package net.wolfTec.utility;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.bridges.Globals;
import net.wolfTec.bridges.webAudio.*;
import net.wolfTec.utility.Storage.StorageEntry;

import org.stjs.javascript.*;
import org.stjs.javascript.functions.Callback1;

public class Audio {

	public static final String LOG_HEADER = "AUDIO";

	public static final String MUSIC_KEY = "MUSIC_";

	public static final float DEFAULT_SFX_VOL = 1;
	public static final float DEFAULT_MUSIC_VOL = 0.5f;

	private int apiStatus;

	/**
	 * SFX audio node.
	 */
	private AudioGainNode _sfxNode;

	/**
	 * Music audio node.
	 */
	private AudioGainNode _musicNode;

	/**
	 * WebAudio context object.
	 */
	private AudioContext _context;

	/**
	 * Cache for audio buffers.
	 */
	private Map<String, AudioBuffer> _buffer;

	// current music
	private boolean musicInLoadProcess = false;
	private AudioBufferSource musicConnector = null;
	private String musicID = null;

	/**
     *
     */
	private Callback1<StorageEntry> _musicLoadCallback = new Callback1<Storage.StorageEntry>() {
		@Override public void $invoke(Storage.StorageEntry entry) {
			musicConnector = _playSoundOnGainNode(_musicNode, Globals.Base64Helper.decodeBuffer(entry.value), true);
			musicInLoadProcess = false;
		}
	};

	public void init() {
		try {

			// context
			if (JSObjectAdapter.hasOwnProperty(Global.window, "AudioContext")) {
				_context = new AudioContext();
			} else if (JSObjectAdapter.hasOwnProperty(Global.window, "webkitAudioContext")) {
				_context = new webkitAudioContext();
			} else
				JSGlobal.stjs.exception("noWebKitFound");

			// audio nodes
			_sfxNode = JSObjectAdapter.hasOwnProperty(_context, "createGain") ? _context.createGain() : _context.createGainNode();
			_sfxNode.gain.value = DEFAULT_SFX_VOL;
			_sfxNode.connect(_context.destination);

			_musicNode = JSObjectAdapter.hasOwnProperty(_context, "createGain") ? _context.createGain() : _context.createGainNode();
			_musicNode.gain.value = DEFAULT_MUSIC_VOL;
			_musicNode.connect(_context.destination);

			_buffer = JSCollections.$map();

			Debug.logInfo(LOG_HEADER, "Initialized");

		} catch (Exception e) {
			Debug.logInfo(LOG_HEADER, "Disabled => No usable webAudio API found");
			Features features = CustomWarsTactics.getBean("features");
			features.audioSFX = false;
			features.audioMusic = false;
		}
	}

	private AudioBufferSource _playSoundOnGainNode(AudioGainNode gainNode, AudioBuffer buffer, boolean loop) {
		AudioBufferSource source = _context.createBufferSource();
		source.loop = loop;
		source.buffer = buffer;
		source.connect(gainNode);
		if (apiStatus == 0)
			apiStatus = JSObjectAdapter.hasOwnProperty(source, "start") ? 1 : 2;
		if (apiStatus == 1)
			source.start(0);
		else
			source.noteOn(0);
		return source;
	}

	/** */
	public void decodeAudio(Object arrayBuffer, Callback1<AudioBuffer> successCb, Callback1<Object> errorCb) {
		_context.decodeAudioData(arrayBuffer, successCb, errorCb);
	}

	/**
	 * Returns the value of the sfx audio node.
	 */
	public float getSfxVolume() {
		return (_context == null) ? -1 : _sfxNode.gain.value;
	}

	/**
	 * Returns the value of the music audio node.
	 */
	public float getMusicVolume() {
		return (_context == null) ? -1 : _musicNode.gain.value;
	}

	/**
	 *
	 * @param node
	 * @param volume
	 */
	private void _setVolume(AudioGainNode node, float volume) {
		if (_context == null)
			return;

		if (volume < 0)
			volume = 0;
		else if (volume > 1)
			volume = 1;

		node.gain.value = volume;
	}

	/**
	 * Sets the value of the sfx audio node.
	 *
	 * @param vol
	 */
	public void setSfxVolume(float vol) {
		_setVolume(_sfxNode, vol);
	}

	/**
	 * Sets the value of the music audio node.
	 *
	 * @param vol
	 */
	public void setMusicVolume(float vol) {
		_setVolume(_musicNode, vol);
	}

	/**
	 * Registers an audio buffer object.
	 */
	public void registerAudioBuffer(String id, AudioBuffer buffer) {
		if (isBuffered(id))
			Debug.logCritical(LOG_HEADER, "AlreadyRegistered");
		_buffer.$put(id, buffer);
	}

	/**
	 * Removes a buffer from the cache.
	 */
	public void unloadBuffer(String id) {
		if (isBuffered(id))
			Debug.logCritical(LOG_HEADER, "NotRegistered");
		_buffer.$delete(id);
	}

	/** */
	public boolean isBuffered(String id) {
		return JSObjectAdapter.hasOwnProperty(_buffer, id);
	}

	/**
	 * Plays an empty sound buffer. Useful to initialize the audio system.
	 */
	public void playNullSound() {
		if (_context == null)
			return;
		_playSoundOnGainNode(_sfxNode, _context.createBuffer(1, 1, 22050), false);
	}

	/**
	 * Plays a sound and returns the signal.
	 */
	public AudioBufferSource playSound(String id, boolean loop) {
		if (_context == null)
			return null;
		return _playSoundOnGainNode(_sfxNode, _buffer.$get(id), loop);
	}

	/**
	 * Plays a background music.
	 */
	public boolean playMusic(String id) {
		if (_context == null || musicInLoadProcess)
			return false;

		// already playing this music ?
		if (musicID == id)
			return false;

		if (musicConnector != null)
			stopMusic();

		// set meta data
		musicInLoadProcess = true;
		musicID = id;
		Storage.get(MUSIC_KEY + id, _musicLoadCallback);

		return true;
	}

	/**
	 * Stop existing background music.
	 */
	public boolean stopMusic() {
		if (_context == null || musicInLoadProcess)
			return false;

		// disable current music
		if (musicConnector != null) {
			// api status will be available here
			if (apiStatus == 1)
				musicConnector.stop(0);
			else
				musicConnector.noteOff(0);
			musicConnector.disconnect(0);
		}

		// remove meta data
		musicConnector = null;
		musicID = null;
		musicInLoadProcess = false;

		return true;
	}

}
