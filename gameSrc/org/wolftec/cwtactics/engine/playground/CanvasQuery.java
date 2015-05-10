package org.wolftec.cwtactics.engine.playground;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.GlobalScope;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasImageData;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

@GlobalScope
@STJSBridge
public class CanvasQuery {

  @STJSBridge
  public static class Atlas {
    public Array<AtlasFrame> frames;
    public Canvas images;
  }

  @STJSBridge
  public static class AtlasFrame {
    public int height;
    public Array<Integer> offset;
    public Array<Integer> region;
    public int width;
  }

  @STJSBridge
  public static class BordersData {
    public Array<Object> bottom; // x,y,w,h,mode
    public Array<Object> bottomLeft; // x,y,w,h,mode
    public Array<Object> bottomRight; // x,y,w,h,mode
    public Array<Object> left; // x,y,w,h,mode
    public Array<Object> right; // x,y,w,h,mode
    public Array<Object> top; // x,y,w,h,mode
    public Array<Object> topLeft; // x,y,w,h,mode
    public Array<Object> topRight; // x,y,w,h,mode
  }

  @STJSBridge
  public static class Position {
    public int x;
    public int y;
  }

  @STJSBridge
  public static class TextBoundaries {
    public int height;
    public int lineHeight;
    public int lines;
    public int width;
  }

  @STJSBridge
  public static class TrimChanges {
    public int bottom;
    public int left;
    public int right;
    public int top;
  }

  public Canvas canvas;

  public CanvasRenderingContext2D context;

  public native CanvasQuery a(double value);

  public native CanvasQuery align(double align);

  public native CanvasQuery align(double x, double y);

  public native void appendTo(Element domElement);

  public native CanvasQuery applyMask(Array<Double> mask);

  public native CanvasQuery beginPath();

  public native CanvasQuery blend(Object above, String mode, double amount);

  public native CanvasQuery borderImage(Canvas image, Array<Integer> region, int x, int y, int ex, int ey, double scale);

  public native CanvasQuery borderImage(Canvas image, boolean region, int x, int y, int ex, int ey, double scale);

  public native CanvasQuery borderImage(Canvas image, int x, int y, int width, int height, BordersData border);

  public native CanvasQuery borderImage(Canvas image, int x, int y, int width, int height, int top, int right, int bottom, int left, String fill);

  public native CanvasQuery borderImage(Image image, Array<Integer> region, int x, int y, int ex, int ey, double scale);

  public native CanvasQuery borderImage(Image image, boolean region, int x, int y, int ex, int ey, double scale);

  public native CanvasQuery borderImage(Image image, int x, int y, int width, int height, BordersData border);

  public native CanvasQuery borderImage(Image image, int x, int y, int width, int height, int top, int right, int bottom, int left, String fill);

  public native Canvas cache();

  public native CanvasQuery circle(int x, int y, int radius);

  public native void clear();

  public native void clear(String color);

  public native CanvasQuery clip();

  @Override
  public native CanvasQuery clone();

  public native CanvasQuery closePath();

  public native CanvasQuery drawAtlasFrame(Atlas atlas, int frame, int x, int y);

  public native CanvasQuery drawRegion(Canvas source, Array<Integer> region, int x, int y, double scale);

  public native CanvasQuery drawRegion(Image source, Array<Integer> region, int x, int y, double scale);

  public native CanvasQuery fill();

  public native CanvasQuery fillCircle(int x, int y, int radius);

  public native String fillStyle();

  public native CanvasQuery fillStyle(String color);

  public native CanvasQuery fillText(String text, int x, int y);

  public native String font();

  public native CanvasQuery font(String font);

  public native int fontHeight();

  public native CanvasImageData getImageData(int x, int y, int width, int height);

  public native Array<String> getPalette();

  public native String getPixel(int x, int y);

  public native String globalCompositeOperation();

  public native CanvasQuery globalCompositeOperation(String operation);

  public native Array<Double> grayscaleToMask();

  public native String lineCap();

  public native CanvasQuery lineCap(String lineCap);

  public native CanvasQuery lineTo(int x, int y);

  public native int lineWidth();

  public native CanvasQuery lineWidth(int width);

  public native CanvasQuery matchPalette(Array<String> colors);

  public native CanvasQuery moveTo(int x, int y);

  public native CanvasQuery negative();

  public native CanvasQuery outline();

  public native CanvasQuery ra();

  public native CanvasQuery realign();

  public native CanvasQuery rect(int x, int y, int width, int height);

  public native CanvasQuery resize(double scale);

  public native CanvasQuery resize(int width, int height);

  public native CanvasQuery restore();

  public native CanvasQuery roundRect(int x, int y, int width, int height, int radius);

  public native CanvasQuery save();

  public native CanvasQuery setHsl(boolean h, boolean s, double l);

  public native CanvasQuery setHsl(boolean h, double s, boolean l);

  public native CanvasQuery setHsl(boolean h, double s, double l);

  public native CanvasQuery setHsl(double h, boolean s, boolean l);

  public native CanvasQuery setHsl(double h, boolean s, double l);

  public native CanvasQuery setHsl(double h, double s, boolean l);

  public native CanvasQuery setHsl(double h, double s, double l);

  public native CanvasQuery setPixel(String color, int x, int y);

  public native int shadowBlur();

  public native CanvasQuery shadowBlur(int blur);

  public native String shadowColor();

  public native CanvasQuery shadowColor(String color);

  public native int shadowOffsetX();

  public native CanvasQuery shadowOffsetX(int x);

  public native int shadowOffsetY();

  public native CanvasQuery shadowOffsetY(int blyur);

  public native CanvasQuery shiftHsl(boolean h, boolean s, double l);

  public native CanvasQuery shiftHsl(boolean h, double s, boolean l);

  public native CanvasQuery shiftHsl(boolean h, double s, double l);

  public native CanvasQuery shiftHsl(double h, boolean s, boolean l);

  public native CanvasQuery shiftHsl(double h, boolean s, double l);

  public native CanvasQuery shiftHsl(double h, double s, boolean l);

  public native CanvasQuery shiftHsl(double h, double s, double l);

  public native CanvasQuery stars(int x, int y, double alignX, double alignY, int rotation, double scale);

  public native CanvasQuery stroke();

  public native CanvasQuery strokeCircle(int x, int y, int radius);

  public native CanvasQuery strokeLine(int x, int y, int tx, int ty);

  public native CanvasQuery strokeLine(Position p1, Position p2);

  public native String strokeStyle();

  public native CanvasQuery strokeStyle(String color);

  public native CanvasQuery strokeText(String text, int x, int y);

  public native CanvasQuery tars(int x, int y, double alignX, double alignY, int rotation, double scale);

  public native String textAlign();

  public native CanvasQuery textAlign(String align);

  public native TextBoundaries textBoundaries(String text);

  public native TextBoundaries textBoundaries(String text, int maxWidth);

  public native String toDataURL();

  public native CanvasQuery trim();

  public native CanvasQuery trim(int x, int y, int width, int height);

  public native CanvasQuery trim(String color);

  public native CanvasQuery trim(String color, TrimChanges changes);

  public native int wrappedText(String text, int x, int y, int maxWidth);

  public native int wrappedText(String text, int x, int y, int maxWidth, int lineHeight);

}
