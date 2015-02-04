package net.wolfTec.wtEngine.action;

import org.stjs.javascript.annotation.Namespace;

@Namespace("cwt") public abstract class Action {

  public abstract String getId ();
  public abstract void call (ActionData data);
}
