package webpage;

import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.annotation.Namespace;
import org.stjs.javascript.dom.Element;
import org.stjs.javascript.functions.Callback0;

import webpage.datatypes.DialogDesc;
import bridge.DialogOption;
import bridge.DialogStateChangeOption;

@Namespace("cwt")
public class Dialog {

	public static final String SECTION_NAME = "#dialogs";
	
	private String id;
	
	public Dialog (DialogDesc desc) {
		Log.fine("Construct dialog "+desc.id);
		
		this.id = desc.id;
		DialogOption options = buildOptions(desc);
		bridge.Global.$(SECTION_NAME).append(buildContent(desc));
		bridge.Global.$("#"+id).dialog(options);
	}

	public Element buildContent (DialogDesc desc) {
		Element dialogDiv = Global.window.document.createElement("div");
		
		dialogDiv.id = desc.id;
		for (int i = 0; i < desc.text.$length(); i++) {
			bridge.Global.$(dialogDiv).append("<p>"+desc.text.$get(i)+"</p>");
    }
		
		return dialogDiv;
	}
	
	public DialogOption buildOptions (DialogDesc desc) {
		final Dialog that = this;
		
		DialogOption options = new DialogOption();
		
		options.modal = true;
		options.autoOpen = false;
		options.closeOnEscape = false;
		options.resizable = false;
		options.draggable = true;
		options.width = 500;
		
		options.title = desc.title;
		
		options.show = new DialogStateChangeOption();
		options.show.effect = "fade";
		options.show.duration = 250;
		options.hide = new DialogStateChangeOption();
		options.hide.effect = "fade";
		options.hide.duration = 250;
    
		options.buttons = JSCollections.$map();
		options.buttons.$put("Ok", new Callback0() {
			public void $invoke() {
				that.close();
			}
		});
		
		return options;
	}
	
	/**
	 * Shows the dialog
	 */
	public void show () {
		Log.fine("Opening dialog "+id);
		bridge.Global.$("#"+id).dialog("open");
	}
	
	/**
	 * Hides the dialog
	 */
	public void close () {
		Log.fine("Closing dialog "+id);
		bridge.Global.$("#"+id).dialog("close");
	}
}
