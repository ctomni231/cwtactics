package org.wolftec.cwt.jslix;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Document;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasImageData;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public abstract class ImageLibrary {
	
	public String buffer = null;
	
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
		//JSObjectAdapter.$js(code);
		
		
	}
	
	
	

}
