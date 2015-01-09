package net.wolfTec.utility;

import net.wolfTec.Constants;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.XMLHttpRequest;
import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;

/**
 *
 */
public abstract class ExternalRequest {
	
    @SyntheticType
    public static class ExternalRequestOptions {
        public String path;
        public boolean json;
        public Callback1<Object> success;
        public Callback1<Object> error;
    }

    /**
     *
     * @param options
     */
    public static void doHttpRequest (final ExternalRequestOptions options) {

        final XMLHttpRequest request = new XMLHttpRequest();
        request.onreadystatechange = new Callback0() {
            @Override public void $invoke() {
                if (request.readyState == 4) {
                    if (request.readyState == 4 && request.status == 200) {
                                              if (options.json) {
                            Object arg = null;
                            try {
                                arg = JSGlobal.JSON.parse(request.responseText);
                            } catch (Exception e) {
                                options.error.$invoke(e);
                            }
                            options.success.$invoke(arg);
                        } else {
                            options.success.$invoke(request.responseText);
                        }
                    } else {
                        options.error.$invoke(request.statusText);
                    }
                }
            }
        };

        // create a randomized parameter for the url to make sure it won't be cached
        request.open("get", options.path + "?_cwtR=" + JSGlobal.parseInt(10000 * Math.random(), 10), true);

        request.send();
    }
}
