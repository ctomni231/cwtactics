package net.wolfTec.bridges;

import net.wolfTec.bridges.webAudio.AudioBuffer;

public abstract class Base64Helper {
    public native AudioBuffer decodeBuffer(Object buffer);
}
