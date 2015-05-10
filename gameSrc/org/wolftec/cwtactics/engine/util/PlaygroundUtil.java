package org.wolftec.cwtactics.engine.util;

import org.stjs.javascript.JSObjectAdapter;
import org.wolftec.cwtactics.engine.playground.Playground;
import org.wolftec.cwtactics.engine.playground.Playground.ResourcePaths;

public class PlaygroundUtil {

  public static void setBasePath(Playground instance, String path) {
    if (instance.paths == null) {
      instance.paths = (ResourcePaths) JSObjectAdapter.$js("{}");
    }
    instance.paths.base = path;
  }
}
