package net.wolfTec.states;

import net.wolfTec.Constants;
import net.wolfTec.bridges.Globals;
import net.wolfTec.input.InputData;
import net.wolfTec.input.InputHandler;
import net.wolfTec.system.ActionInvoker;
import net.wolfTec.utility.Debug;

import org.stjs.javascript.Date;
import org.stjs.javascript.JSCollections;
import org.stjs.javascript.JSObjectAdapter;
import org.stjs.javascript.Map;
import org.stjs.javascript.annotation.Template;
import org.stjs.javascript.functions.Callback0;

/**
 *
 */
public class Statemachine {

	public static final String	LOG_HEADER	= Constants.LOG_STATEMACHINE;

	private ActionInvoker				$actionInvoker;
	private InputHandler				$inputHandler;

	/**
	 * Holds all registered game states.
	 */
	private Map<String, State>	states;

	/**
	 * The active game state.
	 */
	private State								activeState;

	/**
	 * The id of the active game state.
	 */
	private String							activeStateId;

	@Template("toProperty") public String getActiveStateId() {
		return activeStateId;
	}

	private boolean	started;

	public Statemachine() {
		states = JSCollections.$map();
	}

	private int	timestamp;

	public void addState(String id, State state) {
		if (JSObjectAdapter.hasOwnProperty(states, id)) {
			Debug.logCritical(LOG_HEADER, "StateAlreadyRegistered");
		}

		states.$put(id, state);
	}

	/**
	 * The central game loop which calls the update function every frame ofa 60
	 * fps loop.
	 */
	private final Callback0	gameLoop	= new Callback0() {
																			@Override public void $invoke() {

																				// update timer
																				int newTimestamp = (int) (new Date()).getTime();
																				int delta = newTimestamp - timestamp;
																				timestamp = newTimestamp;

																				update(delta);

																				// acquire next frame
																				Globals.requestAnimationFrame(gameLoop);
																			}
																		};

	/**
	 * Central update method that invokes the active state and calls the action
	 * invoker to evaluate buffered commands. Furthermore it grabs the user input
	 * from the input system to forward them to the update method of the active
	 * state.
	 *
	 * @param delta
	 */
	public void update(int delta) {

		if (activeState.animationState) {
			activeState.update.$invoke(delta, null);
			activeState.render.$invoke(delta);
		}

		// try to evaluate commands asap
		if ($actionInvoker.hasData()) {
			$actionInvoker.invokeNext();
			return;
		}

		// update game-pad controls
		// if (features.gamePad && gamePad.update) {
		// gamePad.update();
		// }

		// state update
		InputData inp = $inputHandler.popAction();
		activeState.update.$invoke(delta, inp);
		activeState.render.$invoke(delta);

		// release input data object
		if (inp != null) $inputHandler.releaseAction(inp);
	}

	/**
	 * Changes the active state. The **exit event** will be fired during the
	 * change process in the old state and the **enter event** in the new state.
	 *
	 * @param stateId
	 */
	public void changeState(String stateId) {
		if (activeState != null) activeState.exit.$invoke();
		setState(stateId, true);
	}

	public void setState(String stateId, boolean fireEvent) {
		activeState = states.$get(stateId);
		activeStateId = stateId;

		if (fireEvent) activeState.enter.$invoke();
	}

	/**
	 * Starts the loop of the state machine and calls the gameLoop function in
	 * every frame.
	 */
	public void startLoop() {
		if (started) throw new IllegalStateException("Already started");
		started = true;

		Debug.logInfo(LOG_HEADER, "Starting CW:T state machine");

		// prepare and invoke game loop
		timestamp = (int) (new Date()).getTime();
		Globals.requestAnimationFrame(gameLoop);
	}
}
