package org.wolftec.cwtactics.gameold.state;

import org.wolftec.cwtactics.game.domain.menu.ActionMenu;
import org.wolftec.cwtactics.game.domain.model.GameManager;
import org.wolftec.cwtactics.game.domain.model.Tile;
import org.wolftec.cwtactics.game.logic.MoveCode;
import org.wolftec.cwtactics.game.renderer.UserInterfaceLayerBean;
import org.wolftec.cwtactics.gameold.EngineGlobals;
import org.wolftec.wCore.core.ComponentManager;
import org.wolftec.wCore.core.Injected;
import org.wolftec.wCore.core.ManagedComponent;
import org.wolftec.wCore.core.ManagedComponentInitialization;
import org.wolftec.wCore.core.ManagedConstruction;
import org.wolftec.wCore.log.Logger;
import org.wolftec.wPlay.layergfx.ScreenManager;

@ManagedComponent
public class StateDataBean implements ManagedComponentInitialization {

  @ManagedConstruction
  private Logger log;

  @Injected
  private ScreenManager screen;

  @Injected
  private GameManager gameround;

  @Injected
  private UserInterfaceLayerBean uiLayer;

  @Injected
  private StateManager stateMachine;

  @Injected
  private ActionMenu menu;

  /**
   * Position object with rich information about the selected position by an
   * action and some relations.
   */
  public final Tile source;

  /**
   * Position object with rich information about the selected position by an
   * action and some relations.
   */
  public final Tile target;

  /**
   * Position object with rich information about the selected position by an
   * action and some relations.
   */
  public final Tile targetSelection;

  /**
   * X coordinate of the cursor.
   *
   * @type {number}
   */
  public int cursorX;

  /**
   * Y coordinate of the cursor.
   *
   * @type {number}
   */
  public int cursorY;

  public boolean fromIngameToOptions;

  public boolean isGameRoundActive() {
    return false;
  };

  public boolean multiStepActive;

  public boolean inMultiStep;

  public Integer focusMode = EngineGlobals.INACTIVE_ID;

  @Override
  public void onComponentConstruction(ComponentManager manager) {
    log.info("Initializing..");
  }

  /**
   *
   */
  public void resetCursor() {
    cursorX = 0;
    cursorY = 0;
  }

  /**
   * Moves the cursor into a given direction.
   */
  public void moveCursor(MoveCode dir) {
    int len = 1;
    int x = cursorX;
    int y = cursorY;

    switch (dir) {

      case UP:
        y -= len;
        break;

      case RIGHT:
        x += len;
        break;

      case DOWN:
        y += len;
        break;

      case LEFT:
        x -= len;
        break;
    }

    setCursorPosition(x, y, false);
  }

  /**
   * Moves the cursor to a given position. The view will be moved as well with
   * this function to make sure that the cursor is on the visible view.
   */
  public void setCursorPosition(int x, int y, boolean relativeToScreen) {
    if (relativeToScreen) {
      x = x + screen.offsetX;
      y = y + screen.offsetY;
    }

    // change illegal positions to prevent out of bounds
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x >= gameround.mapWidth) x = gameround.mapWidth - 1;
    if (y >= gameround.mapHeight) y = gameround.mapHeight - 1;

    if (x == cursorX && y == cursorY) {
      return;
    }

    uiLayer.eraseCursor();

    cursorX = x;
    cursorY = y;

    // convert to screen relative pos
    x = x - screen.offsetX;
    y = y - screen.offsetY;

    MoveCode moveCode = null;
    if (x <= 3) moveCode = MoveCode.RIGHT;
    if (y <= 3) moveCode = MoveCode.DOWN;
    if (x >= screen.width - 3) moveCode = MoveCode.LEFT;
    if (y >= screen.height - 3) moveCode = MoveCode.UP;

    // do possible screen shift
    if (moveCode != null) {
      if (CustomWarsTactics.renderCtx.shiftScreen(moveCode)) {
        CustomWarsTactics.renderCtx.shiftMap(moveCode);
      }
    }

    uiLayer.renderCursor(cursorX, cursorY);
  }

  public final StateDataSelection selection = new StateDataSelection();

  public String selectedAction;

  public String selectedSubEntry;

  public void nextStep() {
    movePath.clear();
    menu.clean();
    selectedAction.prepareMenu.$invoke(this);

    if (menu.getSize() == 0) {
      stateMachine.changeState("INGAME_IDLE");
    }

    menu.addEntry("done", true);
    inMultiStep = true;

    stateMachine.changeState("INGAME_SUBMENU");
  }

  public void nextStepBreak() {
    stateMachine.changeState("INGAME_IDLE");
  }

  public void generateTargetSelectionFocus() {
    selectedAction.prepareTargets.$invoke(this, null);
  }

  /**
   * Builds several commands from collected action data.
   */
  public boolean buildFromData() {
      boolean trapped = false;

      // TODO check trap (move has to be stopped)
      if (movePath.getSize() > 0) {
          trapped = move.trapCheck(movePath, source, target);

          CustomWarsTactics.actionInvoker.sharedAction("moveStart", source.unitId, source.x, source.y,
                  Constants.INACTIVE_ID, Constants.INACTIVE_ID );

          for (int i = 0, e = movePath.getSize(); i < e; i += 5) {
              CustomWarsTactics.actionInvoker.sharedAction(
                      "moveAppend",
                      movePath.getSize() > i ? MoveCode.toInt(movePath.get(i)) : Constants.INACTIVE_ID,
                      movePath.getSize() > i + 1 ? MoveCode.toInt(movePath.get(i + 1)) : Constants.INACTIVE_ID,
                      movePath.getSize() > i + 2 ? MoveCode.toInt(movePath.get(i + 2)) : Constants.INACTIVE_ID,
                      movePath.getSize() > i + 3 ? MoveCode.toInt(movePath.get(i + 3)) : Constants.INACTIVE_ID,
                      movePath.getSize() > i + 4 ? MoveCode.toInt(movePath.get(i + 4)) : Constants.INACTIVE_ID
              );
          }

          Action.MovingAction posUpdateMode = selectedAction.positionUpdateMode;
          CustomWarsTactics.actionInvoker.sharedAction("moveEnd",
                  posUpdateMode == Action.MovingAction.PREVENT_CLEAR_OLD_POS ? 1 : 0,
                  posUpdateMode == Action.MovingAction.PREVENT_SET_NEW_POS ? 1 : 0,
                  Constants.INACTIVE_ID, Constants.INACTIVE_ID, Constants.INACTIVE_ID );
      }

      if (!trapped) {
          selectedAction.prepareActionData.$invoke(this, );
      }

      // all unit actions invokes automatically waiting
      if (trapped || selectedAction.type == Action.ActionType.UNIT_ACTION && !selectedAction.noAutoWait) {
          CustomWarsTactics.actionInvoker.sharedAction("wait", source.unitId,
                  Constants.INACTIVE_ID, Constants.INACTIVE_ID, Constants.INACTIVE_ID ,Constants.INACTIVE_ID);
      }

      return trapped;
  }
}
