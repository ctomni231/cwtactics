package com.cwt.io;

import com.cwt.system.jslix.tools.MusicLibrary;

/**
 * JukeBox.java
 *
 * The JukeBox class makes the music and sound files playable from anywhere
 * in the system.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.09.11
 */
public class JukeBox {

    /**
     * This holds the music player used for the JukeBox
     */
    private static MusicLibrary player;

    /**
     * This initializes the JukeBox music player ready for use
     */
    public static void init(){
        player = new MusicLibrary();
    }

    /**
     * This adds a music clip of sound effect to the jukebox
     * @param filename The file path of the music clip
     */
    public static boolean addClip(String filename){
        return player.addClip(filename);
    }

    /**
     * This plays a music clip from start to finish in the jukebox
     * @param filename The file path of the music clip
     */
    public static void playClip(String filename){
        player.play(filename);
    }

    /**
     * This repeats the music clip forever until the stop command
     * @param filename The file path of the music clip
     */
    public static void loopClip(String filename){
        player.loop(filename);
    }

    /**
     * This stop a music clip from playing
     */
    public static void stopClip(){
        player.stop();
    }

    /**
     * This function tells you if a music clip is currently playing
     * @return Whether a music clip is playing(T) or not(F)
     */
    public static boolean isReady(){
        return player.isReady();
    }
}
