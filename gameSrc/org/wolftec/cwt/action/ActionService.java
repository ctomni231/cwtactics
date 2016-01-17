package org.wolftec.cwt.action;

import org.stjs.javascript.Array;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSGlobal;
import org.stjs.javascript.Map;
import org.wolftec.cwt.Constants;
import org.wolftec.cwt.collection.ListUtil;
import org.wolftec.cwt.collection.RingList;
import org.wolftec.cwt.log.Log;
import org.wolftec.cwt.managed.ManagedClass;
import org.wolftec.cwt.net.NetworkManager;
import org.wolftec.cwt.util.JsUtil;
import org.wolftec.cwt.util.NullUtil;
import org.wolftec.cwt.util.StringUtil;

//FIXME
public class ActionService implements ManagedClass
{

  public static final int BUFFER_SIZE = 200;

  private Log log;
  private NetworkManager network;

  /**
   * Pool for holding ActionData objects when they aren't in the buffer.
   */
  private RingList<ActionData> pool;

  private RingList<ActionData> buffer;

  /**
   * List of all available actions.
   */
  private Array<Action> actions;

  /**
   * Action -> ActionID<numeric> mapping
   */
  Map<String, Integer> actionIds;

  @Override
  public void onConstruction()
  {
    actionIds = JSCollections.$map();

    pool = new RingList<ActionData>(BUFFER_SIZE);
    buffer = new RingList<ActionData>(BUFFER_SIZE);

    pool.fillByProvider((i) -> new ActionData());

    /*
     * we sort the actions by their hash values. This results into same order of
     * the actions in the actions array in every environment.
     */
    actions.sort((a, b) ->
    {
      int aHash = StringUtil.stringToHash(a.key());
      int bHash = StringUtil.stringToHash(b.key());

      if (aHash < bHash)
      {
        return -1;
      }
      else if (aHash > bHash)
      {
        return 1;
      }
      else
      {
        return 0;
      }
    });

    ListUtil.forEachArrayValue(actions, (index, action) ->
    {
      actionIds.$put(action.key(), index);
    });
  }

  /**
   * Returns a list of all registered actions.
   */
  public Array<Action> getActions()
  {
    return actions;
  }

  /**
   * Returns the action which has the given key ID.
   */
  public Action getAction(String key)
  {
    return actions.$get(actionIds.$get(key));
  }

  /**
   * Returns the action which has the given numeric ID.
   * 
   * @param id
   * @return
   */
  public Action getActionByNumericId(int id)
  {
    return actions.$get(id);
  }

  /**
   * Gets the numeric ID of an action object.
   */
  public int getActionId(String key)
  {
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
  private void insertLocalAction(String key, int p1, int p2, int p3, int p4, int p5, boolean asHead)
  {
    ActionData actionData = pool.popLast();

    // insert data into the action object
    actionData.id = getActionId(key);
    actionData.p1 = NullUtil.getOrElse(p1, Constants.INACTIVE);
    actionData.p2 = NullUtil.getOrElse(p2, Constants.INACTIVE);
    actionData.p3 = NullUtil.getOrElse(p3, Constants.INACTIVE);
    actionData.p4 = NullUtil.getOrElse(p4, Constants.INACTIVE);
    actionData.p5 = NullUtil.getOrElse(p5, Constants.INACTIVE);

    log.info("append action " + actionData + " as " + (asHead ? "head" : "tail") + " into the stack");

    if (asHead)
    {
      buffer.pushInFront(actionData);
    }
    else
    {
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
  public void localAction(String key, int p1, int p2, int p3, int p4, int p5)
  {
    insertLocalAction(key, p1, p2, p3, p4, p5, false);
  }

  public void localActionData(String key, ActionData data, boolean asHead)
  {
    data.id = getActionId(key);
    if (asHead)
    {
      buffer.pushInFront(data);
    }
    else
    {
      buffer.push(data);
    }
    log.info("pushed action " + data.toString() + " (" + key + ") into the stack");
  }

  public void localActionLIFO(String key, int p1, int p2, int p3, int p4, int p5)
  {
    insertLocalAction(key, p1, p2, p3, p4, p5, true);
  }

  /**
   * Adds the action with a given set of arguments to the action stack and
   * shares the the call with all other clients.
   */
  public void sharedAction(String key, int p1, int p2, int p3, int p4, int p5)
  {
    if (network.isActive())
    {
      network.sendMessage(JSGlobal.JSON.stringify(JSCollections.$array(key, p1, p2, p3, p4, p5)));
    }

    localAction(key, p1, p2, p3, p4, p5);
  }

  /**
   * Parses an action message and pushes it into the command stack.
   */
  public void parseActionMessage(String msg)
  {
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
  public void resetData()
  {
    while (hasData())
    {
      pool.push(buffer.popLast());
    }
  }

  /**
   * Returns true when the buffer has elements else false.
   */
  public boolean hasData()
  {
    return !buffer.isEmpty();
  }

  public ActionData popData()
  {
    if (!hasData())
    {
      return JsUtil.throwError("CannotPullFromEmptyBuffer");
    }
    return buffer.popFirst();
  }

  /**
   * Invokes the next command in the command stack. Throws an error when the
   * command stack is empty.
   */
  public void invokeNext()
  {
    ActionData data = buffer.popFirst();

    NullUtil.getOrThrow(data);
    log.info("evaluating action data object " + data);

    Action actionObj = actions.$get(data.id);
    // actionObj.evaluateByData(data);
    // TODO

    releaseData(data);
  }

  public void releaseData(ActionData data)
  {
    data.reset();
    pool.push(data);
  }

  public ActionData acquireData()
  {
    return pool.popLast();
  }

  /**
   * Converts an action data object to JSON.
   */
  public String serializeActionData(ActionData data)
  {
    return data.toString();
  }

  /**
   * Converts a JSON string to an action data object.
   */
  public ActionData deSerializeActionData(String data)
  {
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
