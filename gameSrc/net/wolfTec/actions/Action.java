package net.wolfTec.actions;

import net.wolfTec.enums.Relationship;
import net.wolfTec.states.StateData;
import net.wolfTec.utility.Assert;
import net.wolfTec.utility.ObjectUtil;
import org.stjs.javascript.Array;
import org.stjs.javascript.Map;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.functions.Function2;

/**
 * Action class which represents an action which is usable by engine objects.
 */
public class Action {

    public static enum SourceToTarget {
        SOURCE_AND_TARGET,
        SOURCE_AND_SUBTARGET
    }

    public static enum ActionType {
        PROPERTY_ACTION,
        CLIENT_ACTION,
        ENGINE_ACTION,
        UNIT_ACTION,
        MAP_ACTION
    }

    public static enum MovingAction {
        SET_POSITION,
        PREVENT_CLEAR_OLD_POS,
        PREVENT_SET_NEW_POS
    }

    public static enum TargetSelectionType {
        BEFORE_SUB_ACTION,
        AFTER_SUB_ACTION
    }

    public static final Function1<StateData, Boolean> DEFAULT_CONDITION = new Function1<StateData, Boolean>() {
        @Override
        public Boolean $invoke(StateData data) {
            return false;
        }
    };

    /**
     * Key ID of the action.
     */
    public final String key;

    public boolean hasSubMenu;

    public Action.MovingAction positionUpdateMode;

    /**
     * Type of the action.
     */
    public Action.ActionType type;

    /**
     * Condition function which checks the availability of the action with the current
     * state data.
     */
    public Function1<StateData, Boolean> condition;

    /**
     * Prepares the menu for a given state data.
     */
    public Callback1<StateData> prepareMenu;

    /**
     * Checks the correctness of a given target position.
     */
    public Function1<StateData, Boolean> isTargetValid;

    /**
     * Adds all possible targets into the state selection.
     */
    public Callback2<StateData, Object> prepareTargets;

    /**
     * Prepares the selection.
     */
    private Callback2<StateData, Object> prepareSelection;

    /**
     * Marks the kind of the action. Multistep actions can flush more than one command into
     * the command stack.
     */
    private boolean multiStepAction;

    /**
     * Marks the target selection mode. Mode 'BEFORE_SUB_ACTION' will be done before the sub menu. Mode
     * 'AFTER_SUB_ACTION' will be done after the sub menu.
     */
    public TargetSelectionType targetSelectionType;

    /**
     * If true, then flusher won't push a 'wait' command. This is only usable for unit actions.
     */
    public boolean noAutoWait;

    /**
     *
     */
    public SourceToTarget mappingForUnit;

    /**
     *
     */
    public Array<Relationship> relationToUnit;

    /**
     *
     */
    public SourceToTarget mappingForProperty;

    /**
     *
     */
    public Array<Relationship> relationToProperty;

    /**
     *
     */
    public Callback2<StateData, ActionData> prepareActionData;

    /**
     * Invokes the action with a given set of arguments.
     */
    public Callback1<ActionData> invoke;

    public Action (String key) {
        Assert.notEmpty(key);

        this.key = key;
        this.positionUpdateMode = MovingAction.SET_POSITION;
        this.type = null;
        this.condition = DEFAULT_CONDITION;
        this.prepareMenu = null;
        this.isTargetValid = null;
        this.prepareTargets = null;
        this.multiStepAction = false;
        this.prepareSelection = null;
        this.targetSelectionType = TargetSelectionType.BEFORE_SUB_ACTION;
        this.relationToUnit = null;
        this.relationToProperty = null;
        this.mappingForProperty = null;
        this.mappingForUnit = null;
        this.noAutoWait = false;
        this.invoke = null;
        this.hasSubMenu = false;
    }
}
