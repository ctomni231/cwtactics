package net.wolfTec.bridges;

import org.stjs.javascript.Array;

public final class CanvasRenderingContext2D {

	public Canvas canvas;

	public Object fillStyle;

	public String font;

	public double globalAlpha;

	public String globalCompositeOperation;

	public String lineCap;

	public int lineDashOffset;

	public String lineJoin;

	public int lineWidth;

	public double miterLimit;

	public String msFillRule;

	// public boolean msImageSmoothingEnabled;

	public double shadowBlur;

	public String shadowColor;

	public int shadowOffsetX;

	public int shadowOffsetY;

	public Object strokeStyle;

	public String textAlign;

	public String textBaseline;

	public native void arc(int x, int y, double radius, double startAngle, double endAngle, boolean anticlockwise);

	public native void arcTo(int x1, int y1, int x2, int y2, double radius);

	public native void beginPath();

	public native void bezierCurveTo(int cp1x, int cp1y, int cp2x, int cp2y, int x, int y);

	public native void clearRect(int x, int y, int w, int h);

	public native void clip();

	public native void clip(String fillRule);

	public native void closePath();

	public native CanvasImageData createImageData(int width, int height);

	public native CanvasGradient createLinearGradient(int x0, int y0, int x1, int y1);

	public native CanvasPattern createPattern(Object image, String repetition);

	public native CanvasGradient createRadialGradient(int x0, int y0, double r0, int x1, int y1, double r1);

	public native void drawImage(Object image, int dx, int dy);

	public native void drawImage(Object image, int sx, int sy, int dx, int dy);

	public native void drawImage(Object image, int sx, int sy, int sw, int sh, int dx, int dy, int dw, int dh);

	public native void fill();

	public native void fill(String fillRule);

	public native void fillRect(int x, int y, int w, int h);

	public native void fillText(String text, int x, int y, int maxWidth);

	public native CanvasImageData getImageData(int sx, int sy, int sw, int sh);

	public native void getLineDash(Array<Integer> dashList);

	public native boolean isPointInPath(int x, int y, String fillRule);

	public native boolean isPointInPath(int x, int y);

	public native void lineTo(int x, int y);

	public native CanvasTextMetrics measureText(String text);

	public native void moveTo(int x, int y);

	public native void putImageData(CanvasImageData imagedata, int dx, int dy, int dirtyX, int dirtyY, int dirtyWidth,
			int dirtyHeight);

	public native void putImageData(CanvasImageData imagedata, int dx, int dy);

	public native void quadraticCurveTo(int cp1x, int cp1y, int x, int y);

	public native void rect(int x, int y, int w, int h);

	public native void restore();

	public native void rotate(double angle);

	public native void save();

	public native void scale(double x, double y);

	public native void setLineDash(Array<Integer> dashList);

	public native void setTransform(double m11, double m12, double m21, double m22, double dx, double dy);

	public native void stroke();

	public native void strokeRect(int x, int y, int w, int h);

	public native void strokeText(String text, int x, int y, int maxWidth);

	public native void transform(double m11, double m12, double m21, double m22, double dx, double dy);

	public native void translate(int x, int y);
}
