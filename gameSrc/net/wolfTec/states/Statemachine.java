package net.wolfTec.states;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.bridges.Window;
import net.wolfTec.input.InputData;
import net.wolfTec.utility.Debug;
import org.stjs.javascript.Global;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Template;
import org.stjs.javascript.functions.Callback0;

/**
 *
 */
public class Statemachine {

    public static final String LOG_HEADER = "statemachine";

    /**
     * Holds all registered game states.
     */
    private Map<String, State> states;

    /**
     * The active game state.
     */
    private State activeState;

    /**
     * The id of the active game state.
     */
    private String activeStateId;

    @Template("toProperty")
    public String getActiveStateId() {
        return activeStateId;
    }

    private boolean started;

    public Statemachine(){
        states = JSCollections.$map();
    }

    private int timestamp;

    void addState (String id, State state) {
        if (JSObjectAdapter.hasOwnProperty(states, id)) {
            CustomWarsTactics.logCritical(LOG_HEADER, "StateAlreadyRegistered");
        }

        states.$put(id, state);
    }

    /**
     * The central game loop which calls the update function every frame ofa 60 fps loop.
     */
    private final Callback0 gameLoop = new Callback0() {
        @Override public void $invoke() {

            // update timer
            int newTimestamp = (Global.Date()).getTime();
            int delta = newTimestamp - timestamp;
            timestamp = newTimestamp;

            update(delta);

            // acquire next frame
            Window.requestAnimationFrame(gameLoop);
        }
    };

    /**
     * Central update method that invokes the active state and calls the action invoker to evaluate
     * buffered commands. Furthermore it grabs the user input from the input system to forward them
     * to the update method of the active state.
     *
     * @param delta
     */
    public void update(int delta) {

        if(activeState.isAnimationState()){
            activeState.update(delta, null);
            activeState.render(delta);
        }

        // try to evaluate commands asop
        if (CustomWarsTactics.actionInvoker.hasData()) {
            CustomWarsTactics.actionInvoker.invokeNext();
            return;
        }

        // update game-pad controls
       // if (features.gamePad && gamePad.update) {
            //gamePad.update();
       // }

        // state update
        InputData inp = CustomWarsTactics.inputHandler.popAction();
        activeState.update(delta, inp);
        activeState.render(delta);

        // release input data object
        if (inp != null) CustomWarsTactics.inputHandler.releaseAction(inp);
    }

    /**
     * Changes the active state. The **exit event** will be fired during the change process in the old state and the
     * **enter event** in the new state.
     *
     * @param stateId
     */
    public void changeState (String stateId) {
        if (activeState != null) activeState.exit();
        setState(stateId, true);
    }

    public void setState(String stateId, boolean fireEvent){
        activeState = states.$get(stateId);
        activeStateId = stateId;

        if (fireEvent) activeState.enter();
    }

    public void startLoop (){
        if (started) throw new IllegalStateException("Already started");
        started = true;

        CustomWarsTactics.logInfo("Starting CW:T state machine");

        // prepare and invoke game loop
        timestamp = (new Date()).getTime();
        Window.requestAnimationFrame(gameLoop);
    }
}
