package net.wolfTec.bridges.webAudio;

import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.functions.Callback;

@Namespace("window") public class AudioContext {
	public native AudioGainNode createGainNode();

	public native AudioGainNode createGain();

	public native AudioBufferSource createBufferSource();

	public native AudioBuffer createBuffer(int x, int y, int r);

	public native AudioBuffer decodeAudioData(Object arrayBuffer, Callback successCb, Callback errorCb);

	public AudioDestination	destination;
}
