package org.wolfTec.wolfTecEngine.statemachine;

public interface StateManager {

  /**
   * Changes the active state. The **exit event** will be fired during the
   * change process in the old state and the **enter event** in the new state.
   *
   * @param stateId
   */
  public abstract void changeState(String stateId);

  /**
   *
   * @param stateId
   */
  public abstract void changeToStateClass(Class<? extends State> stateId);

  public abstract void setState(String stateId, boolean fireEvent);

  /**
   * Starts the loop of the state machine and calls the gameLoop function in
   * every frame.
   */
  public abstract void startGameloop();

  /**
   * Stops the game loop of the state machine.
   */
  public abstract void stopGameloop();

}