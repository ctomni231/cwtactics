package net.wolfTec.bridges.webAudio;

public class AudioBufferSource {

    public boolean loop;
    public AudioBuffer buffer;

    public native void connect(AudioDestination dest);

    public native void start(int position);
    public native void stop(int position);

    public native void noteOn(int position);
    public native void noteOff(int position);

    public native void disconnect(int position);
}
