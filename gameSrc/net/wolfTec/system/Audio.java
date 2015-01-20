package net.wolfTec.system;

import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public class Audio {
	public static boolean	$BEAN	= true;

	private int						musicVolume;
	private int						sfxVolume;
	private Object			  playedMusic = null;

	public void playSfx() {
		JSObjectAdapter.$js("createjs.Sound.play(id, \"none\",0, 0, 0, this.sfxVolume)");
	}

	/**
	 * Plays a audio as music object (looped). The audio will stop playing after stopMusic is triggered or a new music audio 
	 * will be started.
	 *  
	 * @param id
	 */
	public void playMusic(String id) {
		stopMusic();
		playedMusic = JSObjectAdapter.$js("createjs.Sound.play(id, \"none\",0, 0, 1, this.musicVolume)");
	}

	/**
	 * Stops the currently played music.
	 */
	public void stopMusic() {
		if (playedMusic != null) {
			JSObjectAdapter.$js("this.playedMusic.stop()");
		}
	}

	public void setMusicVolume(int volume) {
		musicVolume = volume;
	}

	public void setSfxVolume(int volume) {
		sfxVolume = volume;
	}

	public int getSfxVolume() {
		return sfxVolume;
	}

	public int getMusicVolume() {
		return musicVolume;
	}
}
