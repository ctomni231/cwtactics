package net.wolfTec.wtEngine.action;

import static org.stjs.javascript.JSObjectAdapter.$js;
import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.log.Logger;
import net.wolfTec.wtEngine.network.NetworkBean;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.Map;
import org.wolfTec.utility.Bean;
import org.wolfTec.utility.CircularBuffer;
import org.wolfTec.utility.Injected;
import org.wolfTec.utility.PostInitialization;

@Bean public class ActionInvokerBean {

  private Logger log;
  @Injected private NetworkBean network;

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

  @PostInitialization public void init() {
    this.backPool = new CircularBuffer<ActionData>(Constants.ACTION_POOL_SIZE);
    this.buffer = new CircularBuffer<ActionData>(Constants.ACTION_POOL_SIZE);

    actionIds = JSCollections.$map();
    actions = JSCollections.$array();
  }

  /**
   * 
   * @return
   */
  public boolean hasActions() {
    return false;
  }

  /**
   * Invokes the next command in the command stack.
   * 
   * @throws NullPointerException
   *           an error when the command stack is empty.
   */
  public void invokeNext() {
    ActionData data = buffer.popFirst();
    if (data == null) {
      log.error("NullPointerException");
    }

    Action action = actions.$get(data.actionId);

    // log.info("evaluating action data object " + data + "(" + actionObj.key +
    // ")");

    action.call(data);

    // cache used object
    data.reset();
    backPool.push(data);
  }

  /**
   * Adds the action with a given set of arguments to the action stack.
   * <p/>
   * Every parameter of the call will be submitted beginning from index 1 of the
   * arguments. The maximum amount of parameters are controlled by the
   * controller.commandStack_MAX_PARAMETERS property. Anyway every parameter
   * should be an integer to support intelligent JIT compiling. The function
   * throws a warning if a parameter type does not match, but it will be
   * accepted anyway ** ( for now! ) **.
   *
   * @param key
   * @param p1
   * @param p2
   * @param p3
   * @param p4
   * @param p5
   * @param asHead
   *          the action will be inserted as head (called as next command) if
   *          true, else as tail (called at last)
   */
  public void localAction(String key, int p1, int p2, int p3, int p4, int p5, boolean asHead) {
    ActionData actionData = backPool.popLast();

    // insert data into the action object
    actionData.actionId = getActionId(key);
    actionData.p1 = p1;
    actionData.p2 = p2;
    actionData.p3 = p3;
    actionData.p4 = p4;
    actionData.p5 = p5;

    log.info("append action " + actionData + " as " + (asHead ? "head" : "tail")
        + " into the stack");

    if (asHead) {
      buffer.pushInFront(actionData);
    } else {
      buffer.push(actionData);
    }
  }

  public void localActionLIFO(String key, int p1, int p2, int p3, int p4, int p5) {
    localAction(key, p1, p2, p3, p4, p5, true);
  }

  /**
   * Adds the action with a given set of arguments to the action stack and
   * shares the the call with all other clients.
   */
  public void sharedAction(String key, int p1, int p2, int p3, int p4, int p5) {
    if (network.isConnected()) {
      // $netMessageRouter.sendMessage(Global.JSON.stringify(JSCollections.$array(actionIds.$get(key),
      // p1, p2, p3, p4, p5)));
    }

    localAction(key, p1, p2, p3, p4, p5, false);
  }

  /**
   * Parses an action message and pushes it into the command stack.
   * 
   * @throws IllegalActionFormatException
   *           when the message is not a correct action message
   */
  public void parseActionMessage(String msg) {
    Array<Integer> data = $js("JSON.parse(msg)");

    if (data.$length() == 0) {
      throw new Error("IllegalActionFormatException");
    }

    localAction(actions.$get(data.$get(0)).getId(), data.$get(1), data.$get(2), data.$get(3),
        data.$get(4), data.$get(5), false);
  }

  /**
   * Returns a list of all registered actions.
   */
  public Array<Action> getActions() {
    return actions;
  }

  /**
   * Returns the action which has the given key ID.
   */
  public Action getAction(String key) {
    return actions.$get(actionIds.$get(key));
  }

  /**
   * Gets the numeric ID of an action object.
   */
  public int getActionId(String key) {
    return actionIds.$get(key);
  }

  /**
   * Resets the buffer object.
   */
  public void resetData() {
    while (hasData()) {
      backPool.push(buffer.popLast());
    }
  }

  /**
   * Returns true when the buffer has elements else false.
   */
  public boolean hasData() {
    return !buffer.isEmpty();
  }

  /**
   * Registers an action object.
   *
   * @param action
   */
  public void registerAction(Action action) {
    actions.push(action);
    actionIds.$put(action.getId(), actions.$length() - 1);
  }
}
