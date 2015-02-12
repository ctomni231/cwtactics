package org.wolfTec.cwt.game.statemachine.gameStates;

import org.wolfTec.cwt.game.gamelogic.MoveCode;
import org.wolfTec.cwt.game.renderer.AnimationManagerBean;
import org.wolfTec.cwt.game.statemachine.State;
import org.wolfTec.cwt.game.statemachine.StateDataBean;
import org.wolfTec.cwt.utility.beans.Injected;

/**
 * An inGame state is a state which is considered to be used in an active game
 * round. As result this state contains cursor handling, rendering logic and
 * transfers the calls to the implemented state if necessary.
 * 
 */
public abstract class InGameState extends State {

  @Injected
  private StateDataBean stateData;

  @Override
  public void keyLeft() {
    stateData.moveCursor(MoveCode.LEFT);
  }

  @Override
  public void keyRight() {
    stateData.moveCursor(MoveCode.RIGHT);
  }

  @Override
  public void keyUp() {
    stateData.moveCursor(MoveCode.UP);
  }

  @Override
  public void keyDown() {
    stateData.moveCursor(MoveCode.DOWN);
  }

  private AnimationManagerBean animation;

  @Override
  public void render(int delta) {
    animation.update(delta);
  }

}
