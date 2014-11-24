package net.wolfTec.bridges.webAudio;

public class AudioGainNode implements AudioDestination {
    public native void connect (AudioDestination destination);
    public AudioGain gain;
}
