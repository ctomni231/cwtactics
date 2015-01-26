package net.wolfTec.wtEngine.utility;

import org.stjs.javascript.annotation.SyntheticType;
import org.stjs.javascript.functions.Callback1;

@SyntheticType
public class ExternalRequestOptions {
    public String path;
    public boolean json;
    public Callback1<Object> success;
    public Callback1<Object> error;
}