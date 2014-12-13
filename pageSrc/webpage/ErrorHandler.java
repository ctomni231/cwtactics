package webpage;

import org.stjs.javascript.Global;

public class ErrorHandler {

	/**
	 * Writes an error message to the document body.
	 * 
	 * @param e
	 */
	public static void doErrorHandling(Exception e) {
		Global.window.document.writeln("An error occurred.<br/><br/>" + e + "<br/><br/><br/>Please contact us about this fault (<a href='mailto:ctomni231@gmail.com'>ctomni231@gmail.com</a>).");
	}

}
