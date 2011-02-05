package com.cwt.system.jslix.tools;

import java.io.File;

/**
 * MusicHolder.java
 *
 * The MusicHolder helps store music files in a MusicLibrary.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.03.11
 */
public class MusicHolder {

    public final byte MP3 = 0;//The index of an MP3 file
    public final byte WAV = 1;//The index of a WAV file
    public final byte OGG = 2;//The index of an OGG file
    public final byte MID = 3;//The index of a MIDI file

    public String clip;//The path to the music file
    public int type;//The type of audio file
    public int start;//Where the music starts its playback
    public int end;//Where the music ends its playback

    /**
     * This class is simply for storing information regarding music files.
     */
    public MusicHolder(){
        clip = "";
        start = -1;
        end = -1;
        type = -1;
    }

    /**
     * This function uses the filename to set the type of song file this
     * is. Each type of file is treated differently.
     * @param filename The path to the song file
     */
    public void setType(String filename){
        clip = filename;
        if(filename.toLowerCase().matches(".*[.]mp3"))
            type = MP3;
        else if(filename.toLowerCase().matches(".*[.]wav"))
            type = WAV;
        else if(filename.toLowerCase().matches(".*[.]ogg"))
            type = OGG;
        else if(filename.toLowerCase().matches(".*[.]mid"))
            type = MID;
    }
}
