package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.DOMEvent;
import org.stjs.javascript.functions.Callback0;
import org.wolftec.cwtactics.engine.playground.CanvasQuery.Atlas;

@STJSBridge
public class Playground {

  @STJSBridge
  public static class GamepadEvent {
    public String button;
    public int gamepad;
  }

  @STJSBridge
  public static class KeyboardEvent {
    public int key;
  }

  @STJSBridge
  public static class KeyboardKeys {
    public int a;
    public int ctrl;
  }

  @STJSBridge
  public static class KeyboardStatus {
    public KeyboardKeys keys;
  }

  @STJSBridge
  public static class MouseEvent {
    public DOMEvent original;
    public int x;
    public int y;
  }

  @STJSBridge
  public static class MouseStatus {
    public boolean left;
    public boolean middle;
    public boolean right;
    public int x;
    public int y;

    public native void lock();

    public native void unlock();
  }

  @STJSBridge
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

  @STJSBridge
  public static class ResourcePaths {
    public String atlases;
    public String base;
    public String images;
    public String sounds;
  }

  @STJSBridge
  public static class Sound {

  }

  @STJSBridge
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

  @STJSBridge
  public static class TouchEvent {
    public int id;
    public DOMEvent original;
    public int x;
    public int y;
  }

  @STJSBridge
  public static class TouchStatus {
    public int x;
    public int y;
    // TODO pressed
    // TODO touches
  }

  @STJSBridge
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

  @STJSBridge
  public static class Tweenable {
    public String background;
    public int height;
    public int rotation;
    public double scale;
    public int width;
    public int x;
    public int y;
  }

  @STJSBridge
  public static class TweenData extends Tweenable {
  }

  public Map<String, Atlas> atlases;

  public Map<String, Object> data;

  public int height;

  public Map<String, Canvas> images;

  public KeyboardStatus keyboard;

  public CanvasQuery layer;

  public int lifetime;

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

  public void create() {
  }

  public void createstate() {
  }

  public native double ease(double progress, String easing);

  public void gamepaddown(GamepadEvent ev) {
  }

  public void gamepadmove(GamepadEvent ev) {
  }

  public void gamepadup(GamepadEvent ev) {
  }

  public void keydown(KeyboardEvent ev) {
  }

  public void keyup(KeyboardEvent ev) {
  }

  public void leavestate() {
  }

  public native void loadAtlases(String... images);

  public native void loadData(String... images);

  public native void loadImages(String... images);

  public native void loadSounds(String... sounds);

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

  public native void setState(Playground state);

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
