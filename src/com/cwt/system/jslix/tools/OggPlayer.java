package com.cwt.system.jslix.tools;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import org.newdawn.easyogg.OggClip;

/**
 * OggPlayer.java
 *
 * This class was created specifically for dealing with playing .ogg files.
 * The plan is to be able to achieve most of the methods available within
 * the (JLayer)mp3 version.
 *
 * @author Carr, Crecen
 * @license Look into "LICENSE" file for further information
 * @version 02.03.11
 */
public class OggPlayer{

    private OggClip oggClip;

    public void playOGG(File file) throws FileNotFoundException, IOException{
        FileInputStream musicFile = new FileInputStream(file);
        oggClip = new OggClip(musicFile);
        oggClip.play();
    }


}
