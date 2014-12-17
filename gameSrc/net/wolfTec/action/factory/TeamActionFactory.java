package net.wolfTec.action.factory;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.action.Action;
import net.wolfTec.action.ActionData;
import net.wolfTec.action.ActionInvoker;
import net.wolfTec.enums.Relationship;
import net.wolfTec.model.Player;
import net.wolfTec.model.Property;
import net.wolfTec.states.StateData;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;
import org.stjs.javascript.functions.Function1;

public abstract class TeamActionFactory {

    /**
     * Different available money transfer steps.
     */
    public static Array<Integer> MONEY_TRANSFER_STEPS = JSCollections.$array(1000, 2500, 5000, 10000, 25000, 50000);

    public static void registerActions(ActionInvoker invoker) {
        invoker.registerAction(createShareMoneyAction());
        invoker.registerAction(createSharePropertyAction());
        invoker.registerAction(createShareUnitAction());
    }

    private static Action createShareMoneyAction() {
        final Action action = new Action("transferMoney");
        action.type = Action.ActionType.UNIT_ACTION;
        action.mappingForUnit = Action.SourceToTarget.SOURCE_AND_TARGET;
        action.relationToUnit = JSCollections.$array(Relationship.RELATION_NONE, Relationship.RELATION_SAME_THING);

        action.condition = new Function1<StateData, Boolean>() {
            @Override public Boolean $invoke(StateData data) {
                Player owner = net.wolfTec.gameround.turnOwner;
                int x = data.target.x;
                int y = data.target.y;

                if (owner.gold < MONEY_TRANSFER_STEPS.$get(0)) {
                    return false;
                }

                // only transfer money on headquarters
                Property property = net.wolfTec.gameround.map.getTile(x, y).property;
                return (property != null && property.type.looseAfterCaptured && property.owner != owner);
            }
        };

        action.prepareMenu = new Callback1<StateData>() {
            @Override
            public void $invoke(StateData stateData) {
                for (int i = 0, e = MONEY_TRANSFER_STEPS.$length(); i < e; i++) {
                    if (net.wolfTec.turnOwner.gold >= MONEY_TRANSFER_STEPS.$get(i)) {
                        stateData.menu.addEntry(""+MONEY_TRANSFER_STEPS.$get(i), true);
                    }
                }
            }
        };

        action.invoke = new Callback1<ActionData>() {
            @Override public void $invoke(ActionData actionData) {
                net.wolfTec.gameround.players.$get(actionData.p2).gold -= actionData.p1;
                net.wolfTec.gameround.players.$get(actionData.p3).gold += actionData.p1;

                // the amount of gold cannot be lower 0 after the transfer
                if(net.wolfTec.gameround.players.$get(actionData.p2).gold < 0) {
                    Debug.logCritical("", "IllegalGameState");
                }
            }
        };

        action.prepareActionData = new Callback2<StateData, ActionData>() {
            @Override
            public void $invoke(StateData stateData, ActionData actionData) {
                actionData.p1 = JSGlobal.parseInt(stateData.selectedSubEntry, 10);
                actionData.p2 = net.wolfTec.turnOwner.id;
                actionData.p3 = stateData.target.unit.owner.id;
            }
        };

        return action;
    }

    private static Action createShareUnitAction() {
        Action action = new Action("transferUnit");
        return action;
    }

    private static Action createSharePropertyAction() {
        Action action = new Action("transferProperty");
        return action;
    }
}
