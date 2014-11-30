package net.wolfTec.actions;

import net.wolfTec.bridges.Globals;
import net.wolfTec.utility.CircularBuffer;
import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;

public class ActionInvoker {

    /**
     * List of all available actions.
     */
    private Array<Action> actions;

    /**
     * Action -> ActionID<numeric> mapping.
     */
    private Map<String, Integer> actionIds;

    /**
     * Pool for holding ActionData objects when they aren't in the buffer.
     */
    private CircularBuffer<ActionData> buffer;

    /**
     * Buffer object.
     */
    private CircularBuffer<ActionData> backPool;

    public ActionInvoker(int bufferSize) {
        this.backPool = new CircularBuffer<ActionData>(bufferSize);
        this.buffer = new CircularBuffer<ActionData>(bufferSize);

        actionIds = JSCollections.$map();
        actions = JSCollections.$array();
    }

    /**
     *
     * @param json
     * @return
     */
    public ActionData fromJSON(String json) {
        Map<String, ?> action = Globals.JSON.parse(json);
        ActionData data = backPool.popLast();

        // copy data
        data.reset();
        data.key = (Integer) action.$get("key");
        data.p1 = (Integer) action.$get("p1");
        data.p2 = (Integer) action.$get("p2");
        data.p3 = (Integer) action.$get("p3");
        data.p4 = (Integer) action.$get("p4");
        data.p5 = (Integer) action.$get("p5");
        data.pStr = (String) action.$get("pStr");

        return data;
    }

    /**
     *
     * @param data
     * @return
     */
    public String toJSON(ActionData data) {
        Array<?> toBeSerialized = JSCollections.$array( data.key,
                data.p1, data.p2, data.p3, data.p4, data.p5, data.pStr);

        return Globals.JSON.stringify(toBeSerialized);
    }


    /**
     * @param key
     * @param p1
     * @param p2
     * @param p3
     * @param p4
     * @param p5
     * @param asHead the action will be inserted as head (called as next command) if true,
     *               else as tail (called at last)
     */
    public void localAction(key, p1, p2, p3, p4, p5, asHead) {
        if (arguments.length > 6) debug.logCritical("IllegalNumberOfArgumentsException");

        var actionData = pool.popLast();

        // insert data into the action object
        actionData.id = exports.getActionId(key);
        actionData.p1 = p1 != = undefined ? p1 : constants.INACTIVE;
        actionData.p2 = p2 != = undefined ? p2 : constants.INACTIVE;
        actionData.p3 = p3 != = undefined ? p3 : constants.INACTIVE;
        actionData.p4 = p4 != = undefined ? p4 : constants.INACTIVE;
        actionData.p5 = p5 != = undefined ? p5 : constants.INACTIVE;

        debug.logInfo("append action " + actionData + " as " + (asHead ? "head" : "tail") + " into the stack");

        buffer[asHead ? "pushInFront" : "push"] (actionData);
    }

    /**
     * Adds the action with a given set of arguments to the action stack.
     * <p/>
     * Every parameter of the call will be submitted beginning from index 1 of the
     * arguments. The maximum amount of parameters are controlled by the controller.commandStack_MAX_PARAMETERS property.
     * Anyway every parameter should be an integer to support intelligent JIT compiling. The function throws a warning if
     * a parameter type does not match, but it will be accepted anyway ** ( for now! ) **.
     */
    public void localAction(key, p1, p2, p3, p4, p5) {
        localAction(key, p1, p2, p3, p4, p5, false);
    }

    public void localActionLIFO = function(key, p1, p2, p3, p4, p5)

    {
        localAction(key, p1, p2, p3, p4, p5, true);
    }

    /**
     * Adds the action with a given set of arguments to the action stack and
     * shares the the call with all other clients.
     */
    public void sharedAction() {
        if (network.isActive()) {
            network.sendMessage(JSON.stringify(Array.prototype.slice.call(arguments)));
        }

        exports.localAction.apply(null, arguments);
    }

    /**
     * Parses an action message and pushes it into the command stack.
     */
    public void parseActionMessage(String msg) {
        var data = JSON.parse(msg);

        if (!Array.isArray(data) || !data.length) {
            throw new Error("IllegalActionFormatException");
        }

        exports.localAction.apply(null, data);
    }

    /**
     * Returns a list of all registered actions.
     */
    public void getActions = function()

    {
        return actions;
    }

    /**
     * Returns the action which has the given key ID.
     */
    public void getAction(key) {
        return actions[actionIds[key]];
    }

    /**
     * Gets the numeric ID of an action object.
     */
    public int getActionId(key) {
        return actionIds[key];
    }

    /**
     * Resets the buffer object.
     */
    public void resetData() {
        while (exports.hasData()) {
            pool.push(buffer.pop());
        }
    }

    /**
     * Returns true when the buffer has elements else false.
     */
    public boolean hasData() {
        return !buffer.isEmpty();
    }

    /**
     * Invokes the next command in the command stack. Throws an error when the command stack is empty.
     */
    public void invokeNext() {
        var data = buffer.popFirst();
        if (!data) debug.logCritical("NullPointerException");

        var actionObj = actions[data.id];

        debug.logInfo("evaluating action data object " + data + "(" + actionObj.key + ")");

        actionObj.invoke(data.p1, data.p2, data.p3, data.p4, data.p5);

        // cache used object
        data.reset();
        pool.push(data);
    }

    /**
     * Registers an action object.
     *
     * @param action
     */
    public void registerAction(Action action) {
        actions.push(action);
        actionIds.$put(action.key, actions.$length() - 1);
    }
}
