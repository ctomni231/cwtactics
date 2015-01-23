package net.wolfTec.system;

import net.wolfTec.bridges.Globals;
import net.wolfTec.bridges.webAudio.AudioBuffer;
import net.wolfTec.cwt.CustomWarsTactics;
import net.wolfTec.system.StorageBean.StorageEntry;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback1;

@Namespace("cwt") public class AudioBean {



	

	



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
}
