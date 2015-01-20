package net.wolfTec.system.canvasQuery;

import org.stjs.javascript.Array;
import org.stjs.javascript.annotation.STJSBridge;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.canvas.CanvasGradient;
import org.stjs.javascript.dom.canvas.CanvasImageData;
import org.stjs.javascript.dom.canvas.CanvasPattern;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.dom.canvas.CanvasTextMetrics;

@STJSBridge public class Layer {

  public Canvas                   canvas;
  public CanvasRenderingContext2D context;

  public native Object fillStyle();

  public native void fillStyle(Object value);

  public native String font();

  public native void font(String value);

  public native double globalAlpha();

  public native void globalAlpha(double value);

  public native String globalCompositeOperation();

  public native void globalCompositeOperation(String value);

  public native String lineCap();

  public native void lineCap(String value);

  public native int lineDashOffset();

  public native void lineDashOffset(int value);

  public native String lineJoin();

  public native void lineJoin(String value);

  public native int lineWidth();

  public native void lineWidth(int value);

  public native double miterLimit();

  public native void miterLimit(double value);

  public native double shadowBlur();

  public native void shadowBlur(double value);

  public native String shadowColor();

  public native void shadowColor(String value);

  public native int shadowOffsetX();

  public native void shadowOffsetX(int value);

  public native int shadowOffsetY();

  public native void shadowOffsetY(int value);

  public native Object strokeStyle();

  public native void strokeStyle(Object value);

  public native String textAlign();

  public native void textAlign(String value);

  public native String textBaseline();

  public native void textBaseline(String value);

  public native Layer fillStyle(String color);

  public native Layer fillRect(int x, int y, int w, int h);

  public native Layer arc(int x, int y, double radius, double startAngle, double endAngle, boolean anticlockwise);

  public native Layer arcTo(int x1, int y1, int x2, int y2, double radius);

  public native Layer beginPath();

  public native Layer bezierCurveTo(int cp1x, int cp1y, int cp2x, int cp2y, int x, int y);

  public native Layer clearRect(int x, int y, int w, int h);

  /**
   * Clears the layer and sets a background color.
   * 
   * @param color
   * @return
   */
  public native Layer clear(String color);

  /**
   * Clears the layer.
   * 
   * @return
   */
  public native Layer clear();

  public native Layer clip();

  public native Layer clip(String fillRule);

  public native Layer closePath();

  public native CanvasImageData createImageData(int width, int height);

  public native CanvasGradient createLinearGradient(int x0, int y0, int x1, int y1);

  public native CanvasPattern createPattern(Object image, String repetition);

  public native CanvasGradient createRadialGradient(int x0, int y0, double r0, int x1, int y1, double r1);

  public native Layer drawImage(Object image, int dx, int dy);

  public native Layer drawImage(Object image, int sx, int sy, int dx, int dy);

  public native Layer drawImage(Object image, int sx, int sy, int sw, int sh, int dx, int dy, int dw, int dh);

  public native Layer fill();

  public native Layer fill(String fillRule);

  public native Layer fillText(String text, int x, int y, int maxWidth);

  public native CanvasImageData getImageData(int sx, int sy, int sw, int sh);

  public native Layer lineTo(int x, int y);

  public native CanvasTextMetrics measureText(String text);

  public native Layer moveTo(int x, int y);

  public native Layer putImageData(CanvasImageData imagedata, int dx, int dy, int dirtyX, int dirtyY, int dirtyWidth,
      int dirtyHeight);

  public native Layer putImageData(CanvasImageData imagedata, int dx, int dy);

  public native Layer quadraticCurveTo(int cp1x, int cp1y, int x, int y);

  public native Layer rect(int x, int y, int w, int h);

  public native Layer restore();

  public native Layer rotate(double angle);

  public native Layer save();

  public native Layer scale(double x, double y);

  public native Layer setLineDash(Array<Integer> dashList);

  public native Layer setTransform(double m11, double m12, double m21, double m22, double dx, double dy);

  public native Layer stroke();

  public native Layer strokeRect(int x, int y, int w, int h);

  public native Layer strokeText(String text, int x, int y, int maxWidth);

  public native Layer transform(double m11, double m12, double m21, double m22, double dx, double dy);

  public native Layer translate(int x, int y);

  public native Layer appendTo(Element element);

  /**
   * Makes new canvas out of layer's canvas.
   */
  public native Canvas cache();

  /**
   * Instead of creating a new layer each time I want to quickly manipulate
   * something I am reusing temp layer. It takes the same arguments as cq()
   * however always returns the same canvas.
   * 
   * @param width
   * @param height
   * @return
   */
  public native Layer temp(int width, int height);

  /**
   * Returns cq.color from selected pixel
   * 
   * @param x
   * @param y
   * @return
   */
  public native String getPixel(int x, int y);

  /**
   * Puts a pixel at desired location
   * 
   * @param color
   * @param x
   * @param y
   */
  public native void setPixel(String color, int x, int y);

  /**
   * 
   * @param width
   * @param height
   */
  public native Layer resize(int width, int height);

  /**
   * @param scale
   */
  public native Layer resize(float scale);

  /**
   * Clones the layer.
   */
  public native Layer clone();

  /**
   * Crop layer to desired size.
   * 
   * @param x
   * @param y
   * @param width
   * @param height
   * @return
   */
  public native Layer crop(int x, int y, int width, int height);

  /**
   * Creates a white outline on current canvas.
   * 
   * @param x
   * @param y
   * @param width
   * @param height
   * @return
   */
  public native Layer outline(int x, int y, int width, int height);

  public native int fontHeight();

  /**
   * Creates a rounded rectangle path.
   * 
   * @param x
   * @param y
   * @param width
   * @param height
   * @param radius
   * @return
   */
  public native Layer roundRect(int x, int y, int width, int height, int radius);

  /**
   * 
   * @param x
   * @param y
   * @param radius
   * @return
   */
  public native Layer fillCircle(int x, int y, int radius);

  /**
   * 
   * @param x
   * @param y
   * @param radius
   * @return
   */
  public native Layer strokeCircle(int x, int y, int radius);

  /**
   * Draw a line using an image
   * 
   * @param image
   *          Canvas source image for the line
   * @param region
   *          Array to copy a region or false to the copy whole image
   * @param x
   *          line start
   * @param y
   *          line start
   * @param ex
   *          line end
   * @param ey
   *          line end
   * @param scale
   *          line scale
   * @return
   */
  public native Layer imageLine(Object image, Array<Integer> region, int x, int y, int ex, int ey, float scale);

  /**
   * Draw a line using an image
   * 
   * @param image
   *          Canvas source image for the line
   * @param region
   *          Array to copy a region or false to the copy whole image
   * @param x
   *          line start
   * @param y
   *          line start
   * @param ex
   *          line end
   * @param ey
   *          line end
   * @param scale
   *          line scale
   * @return
   */
  public native Layer imageLine(Object image, boolean region, int x, int y, int ex, int ey, float scale);

  /**
   * 
   * @param source
   * @param region
   * @param x
   * @param y
   * @param scale
   * @return
   */
  public native Layer drawRegion(Object source, Array<Integer> region, int x, int y, float scale);

  /**
   * Fill word-wrapped text
   * 
   * @return
   */
  public native Layer wrappedText(String text, int x, int y, int maxWidth);

  /**
   * Adjust palette to match provided colors
   * 
   * @param palette
   * @return
   */
  public native Layer matchPalette(Array<String> palette);

  /**
   * 
   * @return all unique colors in layer
   */
  public native Array<String> getPalette();

  /**
   * Sets alpha. Shorthand method of globalAlpha.
   * 
   * @param value
   * @return
   */
  public native Layer a(float value);

  /**
   * Resets the alpha.
   * 
   * @return
   */
  public native Layer ra();

  /**
   * 
   * Example:
   * 
   * var colors = ["#08f", "#f08", "#af0", "#fa0"];
   * var ship = cq(this.images.ship).blend(colors[0], "hue", 1.0);
   * this.layer.drawImage(ship.canvas, ship.width * i, 0);
   * 
   * 
   * @param above
   *          Layer | Canvas | Image | String
   * @param mode
   *          normal | multiply | screen | overlay | darken | lighten |
   *          color-dodge | color-burn | hard-light | soft-light | difference |
   *          exclusion | hue | saturation | color | luminosity
   * @param amount
   *          0.0 - 1.0
   * @return
   */
  public native Layer blend(Object above, String mode, float amount);
}