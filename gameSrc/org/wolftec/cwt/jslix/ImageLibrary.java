package org.wolftec.cwt.jslix;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.dom.Canvas;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.dom.Image;
import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;

public abstract class ImageLibrary {
	
	public static void store(String text){
		//Image img = JSObjectAdapter.$js("document.createElement('img')");
		Image img = (Image)Global.window.document.getElementById("image");
		if(img == null){
			img = (Image)Global.window.document.createElement("img");
			Global.window.document.body.appendChild(img);
		}
		img.setAttribute("id", "image");
		img.setAttribute("src", text);
		img.setAttribute("style", "display:none");
		
		img.onload = (image) -> {
			
			Canvas canvas = (Canvas)Global.window.document.getElementById("store");
			if(canvas == null){
				canvas = (Canvas)Global.window.document.createElement("canvas");
				Global.window.document.body.appendChild(canvas);
			}
			canvas.setAttribute("id", "store");
			canvas.setAttribute("style", "display:none");
			
			CanvasRenderingContext2D ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0);
			
			Global.console.log("("+canvas.width+","+canvas.height+")");
		};
		
	}
	

}
