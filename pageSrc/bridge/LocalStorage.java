package bridge;

import org.stjs.javascript.annotation.Template;

public class LocalStorage {

	@Template("get")
	public native <T> T $get(String name);

	@Template("set")
	public native <T> void $get(String name, T value);
}
