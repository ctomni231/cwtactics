package org.wolftec.cwt.renderer.jslix;

import org.stjs.javascript.Array;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasImageData;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

/**
 * ImgLibrary.java
 * 
 * This is the one that will be used to render the images on the screen. Hoping for a very simple and
 * easy to use version that will just have the bare bones operations.
 *
 */
public class ImgLibrary {
	
	// Just getting started on transferring of jstest into here. Most likely, it'll be the first four
	// functions to start followed by some recoloring logic in the future. The class will try to keep
	// a very simplistic view on image storage, but also try to do really quick runtime manipulations.
	
	public static String buffer = null;
	public static int    lx     = 0;
	public static int    ly     = 0;
	
	public static Array<String> bufferArray = new Array<String>();
	public static Array<Integer> locxArray = new Array<Integer>();
	public static Array<Integer> locyArray = new Array<Integer>();
	
	public static void addImage(String text) {
	    Image img = (Image) Global.window.document.getElementById("image");
	    if (img == null) {
	      img = (Image) Global.window.document.createElement("img");
	      Global.window.document.body.appendChild(img);
	    }
	    img.setAttribute("id", "image");
	    img.setAttribute("src", text);
	    img.setAttribute("onload", "cwt.ImgLibrary.storeImage()");
	    img.setAttribute("style", "display:none");
	}
	
	public static void storeImage() {

	    Image img = (Image) Global.window.document.getElementById("image");
	    if (img == null) {
	      img = (Image) Global.window.document.createElement("img");
	      Global.window.document.body.appendChild(img);
	    }

	    Canvas canvas = (Canvas) Global.window.document.getElementById("store");
	    if (canvas == null) {
	      canvas = (Canvas) Global.window.document.createElement("canvas");
	      Global.window.document.body.appendChild(canvas);
	    }
	    canvas.setAttribute("id", "store");
	    canvas.setAttribute("height", "" + img.height);
	    canvas.setAttribute("width", "" + img.width);
	    canvas.setAttribute("style", "display:none");

	    CanvasRenderingContext2D ctx = canvas.getContext("2d");
	    ctx.drawImage(img, 0, 0);

	    Global.console.log("(" + canvas.width + "," + canvas.height + ")");

	    CanvasImageData imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
	    // We are going to use that JSObject Adapter to really make sure we obtain
	    // all the JS code
	    // Currently, it is working like intended
	    lx = img.width;
	    ly = img.height;
	    JSObjectAdapter.$js("this.buffer = new ArrayBuffer(imgData.data.length)");
	    JSObjectAdapter.$js("var view = new Uint8Array(this.buffer)");

	    for (int i = 0; i < imgData.data.$length(); i++) {
	      JSObjectAdapter.$js("view[i] = imgData.data[i]");
	    }
	    
	    // Push images onto the array here
	    bufferArray.push(buffer);
	    locxArray.push(lx);
	    locyArray.push(ly);
	    
	}
	
	public static Canvas displayImage(int num) {
		
		if(num >= 0 && num < bufferArray.$length()){
			buffer = bufferArray.$get(num);
			lx = locxArray.$get(num);
			ly = locyArray.$get(num);
		}else{
			buffer = null;
		}
		
	    Canvas canvas = (Canvas) Global.window.document.getElementById("store");
	    if (canvas == null) {
	      canvas = (Canvas) Global.window.document.createElement("canvas");
	      Global.window.document.body.appendChild(canvas);
	    }
	    canvas.setAttribute("id", "store");
	    if (buffer == null) {
	      canvas.setAttribute("width", "100");
	      canvas.setAttribute("height", "100");
	    } else {
	      canvas.setAttribute("width", "" + lx);
	      canvas.setAttribute("height", "" + ly);
	    }
	    canvas.setAttribute("style", "display:none");
	    CanvasRenderingContext2D ctx = canvas.getContext("2d");

	    if (buffer == null) {
	      CanvasImageData imgData = ctx.createImageData(100, 100);
	      for (int i = 0; i < imgData.data.$length(); i += 4) {
	        imgData.data.$set(i, 255);
	        imgData.data.$set(i + 1, 0);
	        imgData.data.$set(i + 2, 0);
	        imgData.data.$set(i + 3, 100);
	      }
	      ctx.putImageData(imgData, 0, 0);
	    } else {
	      CanvasImageData imgData = ctx.createImageData(lx, ly);
	      JSObjectAdapter.$js("var view = new Uint8Array(this.buffer)");

	      for (int i = 0; i < imgData.data.$length(); i++)
	        JSObjectAdapter.$js("imgData.data[i] = view[i]");

	      ctx.putImageData(imgData, 0, 0);
	    }
	    return canvas;
	    // Canvas c = (Canvas)Global.window.document.getElementById("gameCanvas");
	    // ctx = c.getContext("2d");

	    // ctx.drawImage(canvas, 100, 100);
	  }
}
