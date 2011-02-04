package com.cwt.system.jslix.tools;

import javazoom.jl.player.advanced.PlaybackEvent;
import javazoom.jl.player.advanced.PlaybackListener;

/**
 * MusicListener.java
 *
 * This works with the Music Library to tell when a file is performing
 * a playback.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.03.11
 */
public class MusicListener extends PlaybackListener {

    private boolean playing;//Holds whether a song is playing in the system

    /**
     * This function tells you when the playback started
     * @param pe The playback event
     */
    @Override
    public void playbackStarted(PlaybackEvent pe) {
        playing = true;
        super.playbackStarted(pe);
    }

    /**
     * This function tells you when the playback ended
     * @param pe The playback event
     */
    @Override
    public void playbackFinished(PlaybackEvent pe) {
        playing = false;
        super.playbackFinished(pe);
    }

    /**
     * This function informs you when a playback is playing
     * @return Whether the song is playing(T) or not(F)
     */
    public boolean isPlaying(){
        return playing;
    }
}
