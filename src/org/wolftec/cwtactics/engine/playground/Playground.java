package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.wolftec.cwtactics.engine.playground.CanvasQuery.Atlas;

@SyntheticType
public class Playground {

  @SyntheticType
  public static class AssetEntry {

    /**
     * extension matched from key - otherwise defaultExtension
     */
    public String ext;

    /**
     * normalized key that you can use to store the asset
     */
    public String key;

    /**
     * if it requires more than one file - here is url without extension for
     * example texture atlas consists of atlas.png + atlas.json
     */
    public String path;

    /**
     * by a rule of thumb is to use the url to load a file
     */
    public String url;
  }

  @SyntheticType
  public static class ChangeStateEvent {
    public PlaygroundState next;
    public PlaygroundState prev;
    public PlaygroundState state;
  }

  @SyntheticType
  public static class GamepadEvent {
    public String button;
    public int gamepad;
  }

  @SyntheticType
  public static class KeyboardEvent {
    public int key;
  }

  @SyntheticType
  public static class KeyboardKeys {
    public int a;
    public int ctrl;
  }

  @SyntheticType
  public static class KeyboardStatus {
    public KeyboardKeys keys;
  }

  @SyntheticType
  public static class Loader {

    /**
     * tell the loader that we are adding another item to the queue
     * 
     * @param entryId
     */
    public native void add(String entryId);

    /**
     * 
     * @param entryId
     */
    public native void error(String entryId);

    /**
     * 
     * @param entryId
     */
    public native void success(String entryId);

    public native Loader on(String event, Callback1<String> cb);

    public native Loader off(String event, Callback1<String> cb);

    public native Loader once(String event, Callback1<String> cb);
  }

  @SyntheticType
  public static class MouseEvent {
    public DOMEvent original;
    public int x;
    public int y;
  }

  @SyntheticType
  public static class MouseStatus {
    public boolean left;
    public boolean middle;
    public boolean right;
    public int x;
    public int y;

    public native void lock();

    public native void unlock();
  }

  @SyntheticType
  public static class PointerEvent {
    public String button;
    public int delta;
    public int id;
    public boolean mouse;
    public DOMEvent original;

    public boolean touch;

    public int x;
    public int y;
  }

  @SyntheticType
  public static class ResourcePaths {
    public String atlases;
    public String base;
    public String images;
    public String sounds;
  }

  @SyntheticType
  public static class Sound {

  }

  @SyntheticType
  public static class SoundActions {

    public native void alias(String alias, String source, double volume, double rate);

    public native void fadeIn(Sound sound);

    public native void fadeOut(Sound sound);

    public native void play(String key, boolean loop);

    public native void setMaster(double volume);

    public native void setPlaybackRate(boolean loop, double rate);

    public native void setVolume(Sound sound, double volume);

    public native void stop(String key);
  }

  @SyntheticType
  public static class TouchEvent {
    public int id;
    public DOMEvent original;
    public int x;
    public int y;
  }

  @SyntheticType
  public static class TouchStatus {
    public int x;
    public int y;
    // TODO pressed
    // TODO touches
  }

  @SyntheticType
  public static class Tween {

    public native Tween delay(double time);

    public native Tween discard();

    public native Tween end();

    public native Tween loop();

    public native Tween on(String event, Callback0 cb);

    public native Tween on(String event, Callback0 cb, Object context);

    public native Tween once(String event, Callback0 cb);

    public native Tween once(String event, Callback0 cb, Object context);

    public native Tween play();

    public native Tween rewind();

    public native Tween stop();

    public native Tween to(TweenData data, double time, String effect);

    public native Tween wait(double time);
  }

  @SyntheticType
  public static class Tweenable {
    public String background;
    public int height;
    public int rotation;
    public double scale;
    public int width;
    public int x;
    public int y;
  }

  @SyntheticType
  public static class TweenData extends Tweenable {
  }

  public Map<String, Atlas> atlases;

  public Element container;

  public Map<String, Object> data;

  public int height;

  public Map<String, Canvas> images;

  public KeyboardStatus keyboard;

  public CanvasQuery layer;

  public int lifetime;

  public Loader loader;

  public MouseStatus mouse;

  public SoundActions music;

  public ResourcePaths paths;

  public Array<PointerEvent> pointers;

  public String preferedAudioFormat;

  public double scale;

  public boolean smoothing;

  public SoundActions sound;

  public TouchStatus touch;

  public int width;

  public PlaygroundState state;

  public void create() {
  }

  public void createstate() {
  }

  public native double ease(double progress, String easing);

  public void enterstate(ChangeStateEvent event) {
  }

  public void gamepaddown(GamepadEvent ev) {
  }

  public void gamepadmove(GamepadEvent ev) {
  }

  public void gamepadup(GamepadEvent ev) {
  }

  /** get asset key and url */
  public native AssetEntry getAssetEntry(String path, String folder, String defaultExtension);

  public void keydown(KeyboardEvent ev) {
  }

  public void keyup(KeyboardEvent ev) {
  }

  public void leavestate(ChangeStateEvent event) {
  }

  public native void loadAtlases(String... arguments);

  public native void loadData(String... arguments);

  public native void loadImages(String... arguments);

  public native void loadSounds(String... arguments);

  public void mousedown(MouseEvent ev) {
  }

  public void mousemove(MouseEvent ev) {
  }

  public void mouseup(MouseEvent ev) {
  }

  public void pointerdown(PointerEvent ev) {
  }

  public void pointermove(PointerEvent ev) {
  }

  public void pointerup(PointerEvent ev) {
  }

  public void pointerwheel(PointerEvent ev) {
  }

  public void preload() {
  }

  public void ready() {
  }

  public void render() {
  }

  public void resize() {
  }

  public native void setState(PlaygroundState state);

  public void step(int delta) {
  }

  public void touchend(TouchEvent ev) {
  }

  public void touchmove(TouchEvent ev) {
  }

  public void touchstart(TouchEvent ev) {
  }

  public native Tween tween(Tweenable target);
}