package org.wolftec.cwt.core;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.core.ioc.Injectable;
import org.wolftec.cwt.network.NetworkManager;
import org.wolftec.cwt.system.CircularBuffer;
import org.wolftec.cwt.system.Functions;
import org.wolftec.cwt.system.Log;
import org.wolftec.cwt.system.Nullable;

public class ActionManager implements Injectable {

  public static final int            BUFFER_SIZE = 200;

  private Log                        log;
  private NetworkManager             network;

  /**
   * Pool for holding ActionData objects when they aren't in the buffer.
   */
  private CircularBuffer<ActionData> pool;

  private CircularBuffer<ActionData> buffer;

  /**
   * List of all available actions.
   */
  private Array<Action>              actions;

  /**
   * Action -> ActionID<numeric> mapping
   */
  Map<String, Integer>               actionIds;

  @Override
  public void onConstruction() {
    actionIds = JSCollections.$map();

    pool = new CircularBuffer<ActionData>(BUFFER_SIZE);
    buffer = new CircularBuffer<ActionData>(BUFFER_SIZE);

    Functions.repeat(BUFFER_SIZE, (i) -> pool.push(new ActionData()));
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
   * Returns the action which has the given numeric ID.
   * 
   * @param id
   * @return
   */
  public Action getActionByNumericId(int id) {
    return actions.$get(id);
  }

  /**
   * Gets the numeric ID of an action object.
   */
  public int getActionId(String key) {
    return actionIds.$get(key);
  }

  /**
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
  private void insertLocalAction(String key, int p1, int p2, int p3, int p4, int p5, boolean asHead) {
    ActionData actionData = pool.popLast();

    // insert data into the action object
    actionData.id = getActionId(key);
    actionData.p1 = Nullable.getOrElse(p1, Constants.INACTIVE);
    actionData.p2 = Nullable.getOrElse(p2, Constants.INACTIVE);
    actionData.p3 = Nullable.getOrElse(p3, Constants.INACTIVE);
    actionData.p4 = Nullable.getOrElse(p4, Constants.INACTIVE);
    actionData.p5 = Nullable.getOrElse(p5, Constants.INACTIVE);

    log.info("append action " + actionData + " as " + (asHead ? "head" : "tail") + " into the stack");

    if (asHead) {
      buffer.pushInFront(actionData);
    } else {
      buffer.push(actionData);
    }
  };

  /**
   * Adds the action with a given set of arguments to the action stack.
   *
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
   */
  public void localAction(String key, int p1, int p2, int p3, int p4, int p5) {
    insertLocalAction(key, p1, p2, p3, p4, p5, false);
  }

  public void localActionLIFO(String key, int p1, int p2, int p3, int p4, int p5) {
    insertLocalAction(key, p1, p2, p3, p4, p5, true);
  }

  /**
   * Adds the action with a given set of arguments to the action stack and
   * shares the the call with all other clients.
   */
  public void sharedAction(String key, int p1, int p2, int p3, int p4, int p5) {
    if (network.isActive()) {
      network.sendMessage(JSGlobal.JSON.stringify(JSCollections.$array(key, p1, p2, p3, p4, p5)));
    }

    localAction(key, p1, p2, p3, p4, p5);
  }

  /**
   * Parses an action message and pushes it into the command stack.
   */
  public void parseActionMessage(String msg) {
    Object data = JSGlobal.JSON.parse(msg);

    JsUtil.throwError("NotImplementedYet");
    // if (!Array.isArray(data) || !data.length) {
    // throw new Error("IllegalActionFormatException");
    // }
    //
    // exports.localAction.apply(null, data);
  }

  /**
   * Resets the buffer object.
   */
  public void resetData() {
    while (hasData()) {
      pool.push(buffer.popLast());
    }
  }

  /**
   * Returns true when the buffer has elements else false.
   */
  public boolean hasData() {
    return !buffer.isEmpty();
  }

  public ActionData popData() {
    if (!hasData()) {
      return JsUtil.throwError("CannotPullFromEmptyBuffer");
    }
    return buffer.popFirst();
  }

  /**
   * Invokes the next command in the command stack. Throws an error when the
   * command stack is empty.
   */
  public void invokeNext() {
    ActionData data = buffer.popFirst();

    Nullable.getOrThrow(data, "NoAction");
    log.info("evaluating action data object " + data);

    Action actionObj = actions.$get(data.id);
    // actionObj.evaluateByData(data);

    releaseData(data);
  }

  public void releaseData(ActionData data) {
    data.reset();
    pool.push(data);
  }

  /**
   * Converts an action data object to JSON.
   */
  public String serializeActionData(ActionData data) {
    return data.toString();
  }

  /**
   * Converts a JSON string to an action data object.
   */
  public ActionData deSerializeActionData(String data) {
    Array<Integer> adata = (Array<Integer>) JSGlobal.JSON.parse(data);

    ActionData actData = pool.popLast();
    actData.id = adata.$get(0);
    actData.p1 = adata.$get(1);
    actData.p2 = adata.$get(2);
    actData.p3 = adata.$get(3);
    actData.p4 = adata.$get(4);
    actData.p5 = adata.$get(5);

    return actData;
  }
}
