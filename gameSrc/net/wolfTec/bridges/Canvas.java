package net.wolfTec.bridges;

abstract public class Canvas extends Element {
	public int height;
	public int width;

	public native CanvasRenderingContext2D getContext  (String type);
}
