/**
 *  Copyright 2011 Alexandru Craciun, Eyal Kaspi
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */
package net.wolfTec.bridges;

import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;

abstract public class Element {

	public String id;
	public String innerHTML;

	public int height;
	public int width;
	public int clientHeight;
	public int clientWidth;
	public int offsetHeight;
	public int offsetWidth;

	public Function1<DOMEvent, Boolean> onkeydown;
	public Function1<DOMEvent, Boolean> onkeypress;
	public Function1<DOMEvent, Boolean> onkeyup;

	public Function1<DOMEvent, Boolean> onmousedown;
	public Function1<DOMEvent, Boolean> onmousemove;

	public Function1<DOMEvent, Boolean> oncontextmenu;

	public Function1<DOMEvent, Boolean> onmousewheel;
	public Function1<DOMEvent, Boolean> onscroll;

	public Function1<DOMEvent, Boolean> onreadystatechange;

	public native void addEventListener(String type, Callback1<DOMEvent> listener);

	public native void addEventListener(String type, Callback1<DOMEvent> listener, boolean useCapture);

	public native void removeEventListener(String type, Callback1<DOMEvent> listener);

	public native void removeEventListener(String type, Callback1<DOMEvent> listener, boolean useCapture);

	public native boolean dispatchEvent(DOMEvent event);
}
