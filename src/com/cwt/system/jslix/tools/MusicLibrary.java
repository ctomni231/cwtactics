package com.cwt.system.jslix.tools;

import org.newdawn.easyogg.OggClip;
import javax.sound.midi.Sequencer;
import javax.sound.midi.MidiUnavailableException;
import javax.sound.midi.InvalidMidiDataException;
import javax.sound.midi.MidiSystem;
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

/**
 * MusicLibrary.java
 *
 * A remix of SFX in the original CW. MusicLibrary helps with the organizing,
 * sectioning, and playback of music files. It performs music playback and
 * stop options, and it supports (JLayer)mp3, (OggVorbis)ogg,
 * (MidiSequencer)midi, and (AudioClip)wav files.
 *
 * @author <ul><li>Carr, Crecen</li>
 *          <li>Nolan, Clinton</li></ul>
 * @license Look into "LICENSE" file for further information
 * @version 02.09.11
 */
public class MusicLibrary implements Runnable{

    private MusicHolder[] sortedClip;//Holds an array of music file data
    private FileFind finder;//Holds the file locator for this class
    private HashMap<String, Integer> hashClip;//Holds string references
    private MusicHolder current;//Holds the current song for playing

    private AdvancedPlayer player;//The MP3 music player
    private MusicListener listener;//The playback listener for MP3 music
    private FileInputStream musicFile;//The inputStream for music files
    private Clip clip;//Holds the sound effect player
    private OggClip oggClip;//Holds the OGG player
    private Sequencer midiPlayer;//Holds the MIDI player

    private Thread looper;//This creates a separate thread for music
    private boolean loop;//This holds whether a song loops or not
    private boolean ready;//Holds whether all the outside data is loaded

    /**
     * This class supports playback, loop, and stop for MP3, WAV, OGG, and
     * MID music files. This class also organizes the files so they only
     * need to be loaded into memory once.
     */
    public MusicLibrary(){
        sortedClip = new MusicHolder[0];
        hashClip = new HashMap<String, Integer>();
        current = new MusicHolder();
        finder = new FileFind();
        listener = new MusicListener();
        loop = false;
        ready = true;
    }

    /**
     * This adds a music clip through a file path
     * @param filename The path to the music clip
     * @return Whether the clip was added(T) or not(F)
     */
    public boolean addClip(String filename){
        return addClip(-1, filename, -1, -1);
    }

    /**
     * This adds a music clip through a file path and overwrites the indexed
     * clip if it exists.
     * @param index The index where to place this song
     * @param filename The path to the music clip
     * @return Whether the clip was added(T) or not(F)
     */
    public boolean addClip(int index, String filename){
        return addClip(index, filename, -1, -1);
    }

    /**
     * This adds a music clip through a file path
     * @param filename The path to the music clip
     * @param start Where to start playback in the clip
     * @param end Where to end playback in the clip
     * @return Whether the clip was added(T) or not(F)
     */
    private boolean addClip(String filename, int start, int end){
        return addClip(-1, filename, start, end);
    }

    /**
     * This adds a music clip through a file path and overwrites the indexed
     * clip if it exists.
     * @param index The index where to place this song
     * @param filename The path to the music clip
     * @param start Where to start playback in the clip
     * @param end Where to end playback in the clip
     * @return Whether the clip was added(T) or not(F)
     */
    private boolean addClip(int index, String filename, int start, int end){
        if(!finder.exists(filename))
            return false;

        if(hashClip.containsKey(filename))
            index = hashClip.get(filename);
        current = new MusicHolder();
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

    /**
     * This function tells you when all music has finished playing using
     * the stop() command.
     * @return Whether all music has completed(T) or not(F)
     */
    public boolean isReady(){
        return ready;
    }

    /**
     * This gets the current index of a String reference to a music clip
     * @param ref The reference String
     * @return The index representing the reference String
     */
    public int getIndex(String ref){
        return (hashClip.containsKey(ref)) ? hashClip.get(ref) : -1;
    }

    /**
     * This function plays a music clip once from start to finish
     * @param ref The string reference to the music clip
     */
    public void play(String ref){
        play(getIndex(ref));
    }

    /**
     * This function plays a music clip once from start to finish
     * @param index The numeral index to the music clip
     */
    public void play(int index){
        if(index >= 0 && index < sortedClip.length){
            switch(sortedClip[index].type){
                case 1:
                    playSound(index);
                    break;
                default:
                    current = sortedClip[index];
                    playMusic(false);
                    break;
            }
        }       
    }

    /**
     * This function causes a music clip to loop repetitively
     * @param ref The String reference to the music clip
     */
    public void loop(String ref){
        loop(getIndex(ref));
    }

    /**
     * This function causes a music clip to loop repetitively
     * @param index The numeral index to the music clip
     */
    public void loop(int index){
        if(index >= 0 && index < sortedClip.length){
            switch(sortedClip[index].type){
                case 1:
                    break;
                default:
                    current = sortedClip[index];
                    playMusic(true);
                    break;
            }
        }
    }

    /**
     * This function forces all music to halt playback. It is a little
     * delayed for OGG music
     */
    public void stop(){
        if(listener.isPlaying()){
            loop = false;
            player.close();
        }
        if(oggClip != null){
            oggClip.stop();
            oggClip.close();
        }
        if(midiPlayer != null){
            if(midiPlayer.isOpen()){
                midiPlayer.stop();
                midiPlayer.close();
            }
        }
        ready = true;
    }
        
    /**
     * This function runs the playback for mp3 in a separate thread
     */
    public void run() {
        try{
            if(current.type == current.OGG)
                playOGG();
            else if(current.type == current.MID)
                playMidi();
            else if (current.type == current.MP3)
                playMP3();
        }catch(Exception e){
        	System.err.println("Error! "+e.toString());
        }
    }

    /**
     * This function sets up music to play within its own Thread environment
     * to save cpu time in the game
     * @param repeat Whether this music clip loops(T) or not(F)
     */
    private void playMusic(boolean repeat){
        ready = false;
        loop = repeat;
        looper = new Thread(this);
        looper.start();
    }

    /**
     * This sets up a MP3 player environment for MP3 music clips.
     * @throws FileNotFoundException if file isn't found
     * @throws JavaLayerException if something is wrong with the player
     * @throws IOException if something is wrong with the file
     */
    private void playMP3() throws FileNotFoundException,
            JavaLayerException, IOException{
        do{
            musicFile = new FileInputStream(finder.getFile(current.clip));
            player = new AdvancedPlayer(musicFile);
            player.setPlayBackListener(listener);
            player.play();
            musicFile.close();
        }while(loop);
    }

    /**
     * This sets up an OGG player environment for OGG music clips
     * @throws FileNotFoundException if file isn't found
     * @throws IOException if something is wrong with the file
     */
    private void playOGG() throws FileNotFoundException, IOException{
        musicFile = new FileInputStream(finder.getFile(current.clip));
        oggClip = new OggClip(musicFile);
        if(loop)
            oggClip.loop();
        else
            oggClip.play();
    }

    /**
     * This sets up a WAV player environment for playing sound effects
     * @param index The location in the array where the clip is held
     */
    private void playSound(int index){
        try {
            AudioInputStream stream = AudioSystem.getAudioInputStream(
                    finder.getFile(sortedClip[index].clip));
            clip = AudioSystem.getClip();
            clip.open(stream);

            if(clip.isRunning())
                clip.stop();

            clip.setFramePosition(0);
            clip.start();
        } catch (LineUnavailableException ex) {
        	System.err.println("Line Unavailable! "+ex.toString());
        } catch (UnsupportedAudioFileException ex) {
        	System.err.println("File Unsupported! "+ex.toString());
        } catch (IOException ex) {
        	System.err.println("File Not Found! "+ex.toString());
        }
    }

    /**
     * This sets up a MIDI player environment for playing MIDI files
     */
    private void playMidi(){
        try {
            midiPlayer = MidiSystem.getSequencer();
            midiPlayer.setSequence(MidiSystem.getSequence(
                    finder.getFile(current.clip)));
            midiPlayer.open();
            if(loop)
                midiPlayer.setLoopCount(midiPlayer.LOOP_CONTINUOUSLY);
            midiPlayer.start();
        } catch (MidiUnavailableException ex) {
        	System.err.println("Midi Unavailable! "+ex.toString());
        } catch (InvalidMidiDataException ex) {
        	System.err.println("Midi Invalid! "+ex.toString());
        } catch (IOException ex) {
        	System.err.println("File Not Found! "+ex.toString());
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