package net.wolfTec.bridges;

import org.stjs.javascript.functions.Callback1;

public class Image extends Element {

	public boolean isMap;
	public String alt;
	public String lowSrc;
	public String crossOrigin;
	public String name;
	public String src;
	public String useMap;

	public Callback1<DOMEvent> onload;

}
