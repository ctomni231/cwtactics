package com.cwt.system.jslix.tools;

import java.util.logging.Level;
import java.util.logging.Logger;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.Clip;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import javax.sound.sampled.LineUnavailableException;
import javax.sound.sampled.UnsupportedAudioFileException;
import javazoom.jl.decoder.JavaLayerException;
import javazoom.jl.player.advanced.AdvancedPlayer;
import static com.yasl.logging.Logging.*;

/**
 * MusicLibrary.java
 *
 * A remix of SFX in the original CW. MusicLibrary helps with the organizing,
 * sectioning, and playback of music files. It performs music playback and
 * stop options, and it supports (JLayer)mp3 and (AudioClip)wav files.
 *
 * @author <ul><li>Carr, Crecen</li>
 *          <li>Nolan, Clinton</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 02.03.11
 */
public class MusicLibrary implements Runnable{

    private MusicHolder[] sortedClip;
    private FileFind finder;
    private HashMap<String, Integer> hashClip;
    private MusicHolder current;

    private AdvancedPlayer player;
    private MusicListener listener;
    private FileInputStream musicFile;
    private AudioInputStream soundFile;
    private Clip clip;

    private Thread looper;
    private boolean loop;
    private boolean ready;//Holds whether all the outside data is loaded

    public MusicLibrary(){
        sortedClip = new MusicHolder[0];
        hashClip = new HashMap<String, Integer>();
        current = new MusicHolder();
        finder = new FileFind();
        listener = new MusicListener();
        loop = false;
        ready = true;
    }

    public boolean addClip(String filename){
        return addClip(-1, filename, -1, -1);
    }

    public boolean addClip(int index, String filename){
        return addClip(index, filename, -1, -1);
    }

    public boolean addClip(String filename, int start, int end){
        return addClip(-1, filename, start, end);
    }

    public boolean addClip(int index, String filename, int start, int end){
        if(!finder.exists(filename))
            return false;

        if(hashClip.containsKey(filename))
            index = hashClip.get(filename);
        current = new MusicHolder();
        current.clip = finder.getFile(filename);
        current.setType(filename);
        current.start = start;
        current.end = end;

        //Does not store if clip isn't correct format
        if(current.type < 0)
            return false;

        //Helps get the clip by filename
        if(!filename.equals(""))
            hashClip.put(filename, (index == -1) ? sortedClip.length: index);

        if(index >= 0 && index < sortedClip.length)
            sortedClip[index] = current;
        else
            sortedClip = addData(sortedClip, current);
        return true;
    }

    public void play(int index){
        if(index >= 0 && index < sortedClip.length){
            switch(sortedClip[index].type){
                case 0:
                    current = sortedClip[index];
                    playMp3(false);
                    break;
                case 1:
                    playSound(index);
                    break;
            }
        }
        
    }

    public void loop(int index){
        current = sortedClip[index];
        playMp3(true);
    }

    public void stop(){
        if(isPlaying()){
            loop = false;
            player.close();
            ready = true;
        }
    }

    public boolean isPlaying(){
        ready = !listener.isPlaying();
        return !ready;
    }
        
    /**
     * This function runs the playback for mp3 in a separate thread
     */
    public void run() {
        try{
            do{
                playMusic();
            }while(loop);
        }catch(Exception e){
            warn(e.toString());
        }
    }

    private void playMusic() throws FileNotFoundException, 
            JavaLayerException, IOException{
        musicFile = new FileInputStream(current.clip);
        player = new AdvancedPlayer(musicFile);
        player.setPlayBackListener(listener);
        player.play();
        musicFile.close();
    }

    private void playMp3(boolean repeat){
        ready = false;
        loop = repeat;
        looper = new Thread(this);
        looper.start();
    }

    private void playSound(int index){
        AudioInputStream stream;
        try {
            stream = AudioSystem.getAudioInputStream(sortedClip[index].clip);
            clip = AudioSystem.getClip();
            clip.open(stream);

            if(clip.isRunning())
                clip.stop();

            clip.setFramePosition(0);
            clip.start();
        } catch (LineUnavailableException ex) {
            warn("Line Unavailable! "+ex.toString());
        } catch (UnsupportedAudioFileException ex) {
            warn("File Unsupported! "+ex.toString());
        } catch (IOException ex) {
            warn("File Not Found! "+ex.toString());
        }
    }

    /**
     * This function is used to cause a primitive array to act like an
     * ArrayList. This acts like a push function.
     * @param fillData The data to add to a primitive array
     * @param data The data to add to the array
     * @return An array with the data attached
     */
    private MusicHolder[] addData(MusicHolder[] fillData, MusicHolder data){
        if(fillData == null)
            fillData = new MusicHolder[0];

        MusicHolder[] temp = fillData;
        fillData = new MusicHolder[temp.length+1];
        System.arraycopy(temp, 0, fillData, 0, temp.length);
        fillData[fillData.length-1] = data;

        return fillData;
    }
}
/*

 * try {
            player = new FileInputStream("Kat.mp3");
            play = new Player(player);
            play.play();
        } catch (JavaLayerException ex) {
            System.out.println("Layer exception! "+ex.toString());
        } catch (FileNotFoundException ex) {
            System.out.println("Not found! "+ex.toString());
        }
 *
 * //prepares the clip for playback, used internally
    private static Clip openClip(String filename) {
        Clip clip;
        try {
            // From file
            AudioInputStream stream = AudioSystem.getAudioInputStream(new File(filename));
            clip = AudioSystem.getClip();
            // Open audio clip and load samples from the audio input stream.
            clip.open(stream);

        } catch (IOException e) {
            System.err.println("Error: Could not read file " + filename);
            return null;
        } catch (LineUnavailableException e) {
            System.err.println("Error: Line unavailable");
            return null;
        } catch (UnsupportedAudioFileException e) {
            System.err.println("Error: " + filename + " not an audio file");
            return null;
        }

        return clip;
    }
 *
 * //Play a short clip from a file
    public static void playClip(String fullPath) {
        if (!Options.isSFXOn()) {
            Clip c = openClip(fullPath);
            if (c != null) {
                if (c.isRunning()) {
                    c.stop();   // Stop the player if it is still running
                }
                c.setFramePosition(0); // rewind to the beginning
                c.start();     // Start playing

            }
        }
    }


 */