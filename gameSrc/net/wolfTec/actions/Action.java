package net.wolfTec.actions;

import org.stjs.javascript.Map;

/**
 * Action class which represents an action which is usable by engine objects.
 */
public abstract class Action {

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

    /**
     * Key ID of the action.
     */
    private String key;

    private Action.MovingAction positionUpdateMode;

    /**
     * Type of the action.
     */
    private Action.ActionType type;

    /**
     * ???
     */
    // this.action = impl.action;

    /**
     * Condition function which checks the availability of the action with the current
     * state data.
     */
    this.condition = impl.condition || func.trueReturner;

    /**
     * Prepares the menu for a given state data.
     */
    this.prepareMenu = impl.prepareMenu || null;

    /**
     * Checks the correctness of a given target position.
     */
    this.isTargetValid = impl.isTargetValid || null;

    /**
     * Adds all possible targets into the state selection.
     */
    this.prepareTargets = impl.prepareTargets || null;

    /**
     * Marks the kind of the action. Multistep actions can flush more than one command into
     * the command stack.
     */
    this.multiStepAction = impl.multiStepAction || null;

    /**
     * Prepares the selection.
     */
    this.prepareSelection = impl.prepareSelection || null;

    /**
     * Marks the target selection mode. Mode 'A' will be done before the sub menu. Mode 'B'
     * will be done after the sub menu.
     */
    this.targetSelectionType = impl.targetSelectionType || "A";

    /**
     * If true, then flusher won't push a 'wait' command. This is only usable for unit actions.
     */
    this.noAutoWait = impl.noAutoWait || false;

    /**
     * Shows the needed unit to unit relation mode.
     */
    this.relation = impl.relation || null;

    /**
     * Shows the needed unit to property relation mode.
     */
    this.relationToProp = impl.relationToProp || null;

    /**
     * Invokes the action with a given set of arguments.
     */
    this.invoke = impl.invoke;







    /*
    private String key = impl.key;
    this.positionUpdateMode = (impl.positionUpdateMode || exports.SET_POSITION);
    this.type = impl.type;
    this.action = impl.action;
    this.condition = impl.condition || func.trueReturner;
    this.prepareMenu = impl.prepareMenu || null;
    this.isTargetValid = impl.isTargetValid || null;
    this.prepareTargets = impl.prepareTargets || null;
    this.multiStepAction = impl.multiStepAction || null;
    this.prepareSelection = impl.prepareSelection || null;
    this.targetSelectionType = impl.targetSelectionType || "A";
    this.noAutoWait = impl.noAutoWait || false;
    this.relation = impl.relation || null;
    this.relationToProp = impl.relationToProp || null;
    this.invoke = impl.invoke;
    */
}
