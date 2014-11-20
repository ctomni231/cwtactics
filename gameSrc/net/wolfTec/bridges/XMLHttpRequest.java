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

import org.stjs.javascript.functions.Callback0;

public class XMLHttpRequest {

	public Callback0 onreadystatechange;
	public int readyState;
	public String responseText;
	public Element responseXML;
	public int status;
	public String statusText;
	public native void abort();
	public native String getAllResponseHeaders();
	public native String getResponseHeader(String name);
	public native void open(String method, String url);
	public native void open(String method, String url, boolean async, String uname, String pswd);
	public native void open(String method, String url, boolean async);
	public native void send();
	public native void send(String data);
	public native void setRequestHeader(String name, Object value);
}
