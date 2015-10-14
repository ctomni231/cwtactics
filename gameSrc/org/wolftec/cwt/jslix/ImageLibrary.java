package org.wolftec.cwt.jslix;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Document;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasImageData;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public abstract class ImageLibrary {
	
	public static String buffer = null;
	public static int lx = 0;
	public static int ly = 0;
	
	public static void store(String text){
		Document doc = Global.window.document;
		//Image img = JSObjectAdapter.$js("document.createElement('img')");
		Image img = (Image)Global.window.document.getElementById("image");
		if(img == null){
			img = (Image)Global.window.document.createElement("img");
			Global.window.document.body.appendChild(img);
		}
		img.setAttribute("id", "image");
		img.setAttribute("src", text);
		img.setAttribute("onload", "cwt.ImageLibrary.push()");
		img.setAttribute("style", "display:none");
	}
	
	public static void push(){
		
		Image img = (Image)Global.window.document.getElementById("image");
		if(img == null){
			img = (Image)Global.window.document.createElement("img");
			Global.window.document.body.appendChild(img);
		}
		
		Canvas canvas = (Canvas)Global.window.document.getElementById("store");
		if(canvas == null){
			canvas = (Canvas)Global.window.document.createElement("canvas");
			Global.window.document.body.appendChild(canvas);
		}
		canvas.setAttribute("id", "store");
		canvas.setAttribute("height", ""+img.width);
		canvas.setAttribute("width", ""+img.height);
		canvas.setAttribute("style", "display:none");
		
		CanvasRenderingContext2D ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		
		Global.console.log("("+canvas.width+","+canvas.height+")");
		
		CanvasImageData imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		//We are going to use that JSObject Adapter to really make sure we obtain all the JS code
		//Currently, it is working like intended
		lx = img.width;
		ly = img.height;
		JSObjectAdapter.$js("this.buffer = new ArrayBuffer(imgData.data.length)");
		JSObjectAdapter.$js("var view = new Uint8Array(this.buffer)");
		
		for(int i = 0; i < imgData.data.$length(); i++){
			JSObjectAdapter.$js("view[i] = imgData.data[i]");
			JSObjectAdapter.$js("if(view[i] != 0) console.log('Color '+i+': '+view[i])");
		}
	}
	
	public static Canvas pull(){
		Canvas canvas = (Canvas)Global.window.document.getElementById("store");
		if(canvas == null){
			canvas = (Canvas)Global.window.document.createElement("canvas");
			Global.window.document.body.appendChild(canvas);
		}
		canvas.setAttribute("id", "store");
		if(buffer == null){
			canvas.setAttribute("width", "100");
			canvas.setAttribute("height", "100");
		}else{
			canvas.setAttribute("width", ""+lx);
			canvas.setAttribute("height", ""+ly);
		}
		canvas.setAttribute("style", "display:none");
		CanvasRenderingContext2D ctx = canvas.getContext("2d");
		
		if(buffer == null){
			CanvasImageData imgData = ctx.createImageData(100, 100);
			for(int i = 0; i < imgData.data.$length(); i += 4){
				imgData.data.$set(i, 255);
				imgData.data.$set(i+1, 0);
				imgData.data.$set(i+2, 0);
				imgData.data.$set(i+3, 100);
			}
			ctx.putImageData(imgData, 0, 0);
		}else{
			CanvasImageData imgData = ctx.createImageData(lx, ly);
			JSObjectAdapter.$js("var view = new Uint8Array(this.buffer)");
			
			for(int i = 0; i < imgData.data.$length(); i++)
				JSObjectAdapter.$js("imgData.data[i] = view[i]");
			
			ctx.putImageData(imgData, 0, 0);
		}
		return canvas;
		//Canvas c = (Canvas)Global.window.document.getElementById("gameCanvas");
		//ctx = c.getContext("2d");

		//ctx.drawImage(canvas, 100, 100);
	}
}
