package net.temp.wolfTecEngine.statemachine;

public interface ActionQueueHandler<T> {

  /**
   * Enqueues an action from a remote source (e.g. network interface).
   * 
   * @param message
   */
  void queueRemoteAction(String message);
  
  /**
   * Enqueues an action.
   * 
   * @param message
   */
  void queueAction(T message);

  /**
   * Enqueues an action and invokes it immediately in the next invokeNextAction() call.
   * 
   * @param message
   */
  void queueImmediateAction(T message);

  /**
   * 
   * @return true when the action handler contains action objects which aren't
   *         invoked yet, else false
   */
  boolean hasQueuedActions();

  /**
   * Invokes the next action object in the queue
   */
  void invokeNextAction();
}
