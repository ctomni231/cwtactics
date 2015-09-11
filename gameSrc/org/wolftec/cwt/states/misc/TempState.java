package org.wolftec.cwt.states.misc;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.renderer.GraphicManager;
import org.wolftec.cwt.states.AbstractState;

/* TempState.java
 * 
 * A temporary class made to test out the game without causing any damage to the existing classes.
 * This class will be used to understand the engine flow and how to use classes within the engine.
 * It may also be a dumping ground to experimental actions.
 * 
 * 2015.09.10
 */
public class TempState extends AbstractState{
	
	@Override
	  public void render(int delta, GraphicManager gfx) {
	    CanvasRenderingContext2D ctx = gfx.mainCtx;

	    ctx.font = "24pt Arial";

	    ctx.fillStyle = "#CEF6D8";
	    ctx.fillRect(0, 0, gfx.absoluteScreenWidth(), gfx.absoluteScreenHeight());

	    ctx.fillStyle = "#1C1C1C";
	    ctx.fillText("CustomWars: Tactics (" + Constants.VERSION + ")", 30, 60, 400);

	    ctx.fillStyle = "#610B0B";
	    ctx.fillText("- Development Version -", 40, 100, 400);
	  }
	
}
