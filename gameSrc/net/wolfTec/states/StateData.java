package net.wolfTec.states;

import net.wolfTec.Constants;
import net.wolfTec.CustomWarsTactics;
import net.wolfTec.actions.Action;
import net.wolfTec.database.CoType;
import net.wolfTec.enums.MoveCode;
import net.wolfTec.model.GameRound;
import net.wolfTec.model.PositionData;
import net.wolfTec.utility.CircularBuffer;
import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class StateData {

    public static final String LOG_HEADER = Constants.logHeader("statemachine.data");

    /**
     * Position object with rich information about the selected position by an action and some relations.
     */
    public final PositionData source;

    /**
     * Position object with rich information about the selected position by an action and some relations.
     */
    public final PositionData target;

    /**
     * Position object with rich information about the selected position by an action and some relations.
     */
    public final PositionData targetSelection;

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

    /** */
    public boolean fromIngameToOptions;

    /** */
    public boolean inGameRound;

    /** */
    public boolean multiStepActive;

    public boolean inMultiStep;

    public CircularBuffer<Integer> movePath = new CircularBuffer<Integer>(Constants.MAX_MOVE_LENGTH);

    public boolean preventMovePathGeneration;

    public Integer focusMode = Constants.INACTIVE_ID;

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

        setCursorPosition(x, y);
    }

    ;

    /**
     * Moves the cursor to a given position. The view will be moved as well with this function to make sure that the cursor is on the visible view.
     */
    public void setCursorPosition(int x, int y, boolean relativeToScreen) {
        if (relativeToScreen) {
            x = x + renderer.screenOffsetX;
            y = y + renderer.screenOffsetY;
        }

        // change illegal positions to prevent out of bounds
        GameRound game = CustomWarsTactics.gameround;
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x >= game.mapWidth) x = game.mapWidth - 1;
        if (y >= game.mapHeight) y = game.mapHeight - 1;

        if (x == cursorX && y == cursorY) {
            return;
        }

        renderer.eraseCursor(cursorX, cursorY);

        cursorX = x;
        cursorY = y;

        // convert to screen relative pos
        x = x - renderer.screenOffsetX;
        y = y - renderer.screenOffsetY;

        MoveCode moveCode = null;
        if (x <= 3) moveCode = MoveCode.RIGHT;
        if (y <= 3) moveCode = MoveCode.DOWN;
        if (x >= Constants.SCREEN_WIDTH - 3) moveCode = MoveCode.LEFT;
        if (y >= Constants.SCREEN_HEIGHT - 3) moveCode = MoveCode.UP;

        // do possible screen shift
        if (moveCode != null) {
            if (renderer.shiftScreen(moveCode)) {
                renderer.shiftMap(moveCode);
            }
        }

        renderer.renderCursor(cursorX, cursorY);
    }

    ;

    public final StateDataSelection selection = new StateDataSelection();

    var checkRelation = function(action, relationList, sMode, stMode)

    {
        var checkMode;

        switch (relationList[1]) {
            case "T":
                checkMode = sMode;
                break;

            case "ST":
                checkMode = stMode;
                break;

            default:
                checkMode = null;
        }

        for (var si = 2, se = relationList.length; si < se; si++) {
            if (relationList[si] == = checkMode) {
                return true;
            }
        }

        return false;
    }

    ;

    public Action selectedAction;

    public Action selectedSubAction;

    /**
     * Game menu.
     */
    public final StateDataMenu menu = new StateDataMenu(this);

    public void nextStep() {
        exports.movePath.clean();
        exports.menu.clean();
        exports.action.object.prepareMenu(exports.movePath);

        if (menu.getSize() == 0) {
            CustomWarsTactics.gameWorkflow.changeState("INGAME_IDLE");
        }

        menu.addEntry("done", true);
        inMultiStep = true;

        CustomWarsTactics.gameWorkflow.changeState("INGAME_SUBMENU");
    }

    public void nextStepBreak() {
        CustomWarsTactics.gameWorkflow.changeState("INGAME_IDLE");
    }

    public void generateTargetSelectionFocus() {
        prepareTargetsByData(exports.action.object);
    }

    /**
     * Builds several commands from collected action data.
     */
    public void buildFromData = function()

    {
        var trapped = false;

        // TODO check trap (move has to be stopped)
        if (exports.movePath.size > 0) {
            trapped = move.trapCheck(exports.movePath, exports.source, exports.target);

            actionsLib.sharedAction("moveStart", exports.source.unitId, exports.source.x, exports.source.y);

            for (var i = 0, e = exports.movePath.size; i < e; i += 5) {
                actionsLib.sharedAction("moveAppend",
                        exports.movePath.size > i ? exports.movePath.get(i) : constants.INACTIVE,
                        exports.movePath.size > i + 1 ? exports.movePath.get(i + 1) : constants.INACTIVE,
                        exports.movePath.size > i + 2 ? exports.movePath.get(i + 2) : constants.INACTIVE,
                        exports.movePath.size > i + 3 ? exports.movePath.get(i + 3) : constants.INACTIVE,
                        exports.movePath.size > i + 4 ? exports.movePath.get(i + 4) : constants.INACTIVE
                );
            }

            Action.MovingAction posUpdateMode = selectedAction.positionUpdateMode;
            actionsLib.sharedAction("moveEnd",
                    (posUpdateMode == Action.MovingAction.PREVENT_CLEAR_OLD_POS),
                    (posUpdateMode == Action.MovingAction.PREVENT_SET_NEW_POS));
        }

        if (!trapped) {
            invokeActionByData();
        }

        // all unit actions invokes automatically waiting
        if (trapped || exports.action.object.type == = actionsLib.UNIT_ACTION && !exports.action.object.noAutoWait) {
            actionsLib.sharedAction("wait", exports.source.unitId);
        }

        return trapped;
    }

    ;


    exports.CHANGE_TYPE=

    {
        CO_MAIN:
        0,
                CO_SIDE:1,
            GAME_TYPE:2,
            PLAYER_TYPE:3,
            TEAM:4
    }

    ;

    var map = null;

    /**
     * Data holder to remember selected commanders.
     */
    public Array<CoType> co = JSCollections.$array();

    /**
     * Data holder to remember selected player types.
     */
    public Array<Integer> type = JSCollections.$array();

    /**
     * Data holder to remember selected team settings.
     */
    public Array<Integer> team = JSCollections.$array();

    public StateData() {
        this.source = new PositionData();
        this.target = new PositionData();
        this.targetSelection = new PositionData();
    }

    /**
     * Changes a configuration parameter.
     *
     * @param pid
     * @param type
     * @param prev
     */
    public void changeParameter(int pid, int type, boolean prev) {
    }

    public void selectMap(Map<String, Object> sMap) {
    }

    public Map<String, Object> getSelectMap() {
    }

    /**
     * Does some preparations for the configuration screen.
     */
    public void preProcess() {
    }

    /**
     * Does some preparations for the game round initialization.
     */
    public void postProcess() {
    }
}
