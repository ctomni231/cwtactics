package net.wolfTec.input;

import org.stjs.javascript.Map;

public abstract class InputBackend {
    public Map<String, Integer> getKeyMap(){ return null; }
    public void update(int delta){}
    public abstract void enable();
    public abstract void disable();
}
