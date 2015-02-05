package net.wolfTec.wtEngine.action;


public abstract class Action {

  public abstract String getId ();
  public abstract void call (ActionData data);
}
