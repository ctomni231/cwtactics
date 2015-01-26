package net.wolfTec.action.factory;

import net.wolfTec.action.Action;
import net.wolfTec.cwt.Game;
import net.wolfTec.cwt.logic.ActionData;
import net.wolfTec.cwt.logic.ActionInvokerBean;
import net.wolfTec.cwt.logic.Relationship;
import net.wolfTec.cwt.model.Position;
import net.wolfTec.states.StateData;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.JSCollections;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Function1;
import org.stjs.javascript.functions.Function2;

public abstract class UnitActionFactory {

    public static void registerActions(ActionInvokerBean invoker) {
        invoker.registerAction(createUnitWaitAction());
    }

    private static Action createUnitWaitAction() {
        Action action = new Action("wait");
        action.type = Action.ActionType.UNIT_ACTION;

        action.mappingForUnit = Action.SourceToTarget.SOURCE_AND_TARGET;
        action.relationToUnit = JSCollections.$array(Relationship.RELATION_NONE, Relationship.RELATION_SAME_THING);

        action.condition = new Function1<StateData, Boolean>() {
            @Override public Boolean $invoke(StateData stateData) {
                return stateData.source.unit.isCanAct();
            }
        };

        action.prepareActionData = null;

        action.invoke = new Callback1<ActionData>() {
            @Override public void $invoke(ActionData actionData) {
                Debug.logInfo(null, "Send unit " + actionData.p1 + " into wait status");
                net.wolfTec.gameround.units.$get(actionData.p1).setActable(false);
                renderer.renderUnitsOnScreen();
            }
        };

        return action;
    }
}
