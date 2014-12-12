package net.wolfTec.states.factory;

import net.wolfTec.application.CustomWarsTactics;
import net.wolfTec.input.InputData;
import net.wolfTec.model.MoveCode;
import net.wolfTec.states.State;
import net.wolfTec.states.Statemachine;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

public abstract class IngameStates {
	public static void addToStateMachine(Statemachine statemachine) {
		statemachine.addState("XYZ", addInGameState(null));
	}

	/**
	 * Creates an inGame state which means this state is considered to be used in
	 * an active game round. As result this state contains cursor handling,
	 * rendering logic and transfers the calls to the implemented state if
	 * necessary.
	 *
	 * @param state
	 */
	public static State addInGameState(final State state) {
		State ingameState = new State();

		state.init.$invoke();

		ingameState.enter = new Callback0() {
			@Override public void $invoke() {
				state.enter.$invoke();
			}
		};

		ingameState.exit = new Callback0() {
			@Override public void $invoke() {
				state.exit.$invoke();
			}
		};

		ingameState.update = new Callback2<Integer, InputData>() {
			@SuppressWarnings("incomplete-switch") @Override public void $invoke(Integer delta, InputData inputData) {
				if (inputData != null) {
					MoveCode code = null;

					// extract input data
					Callback1<Integer> fn = null;
					switch (inputData.key) {
					case LEFT:
						fn = state.LEFT;
						code = MoveCode.LEFT;
						break;

					case UP:
						fn = state.UP;
						code = MoveCode.UP;
						break;

					case RIGHT:
						fn = state.RIGHT;
						code = MoveCode.RIGHT;
						break;

					case DOWN:
						fn = state.DOWN;
						code = MoveCode.DOWN;
						break;

					case ACTION:
						fn = state.ACTION;
						break;

					case CANCEL:
						fn = state.CANCEL;
						break;
					}

					if (fn != null) {
						fn.$invoke(delta);

					} else if (code != null) {
						CustomWarsTactics.gameWorkflowData.moveCursor(code);
					}
				}
			}
		};

		ingameState.render = new Callback1<Integer>() {
			@Override public void $invoke(Integer delta) {
			}
		};

		ingameState.render = new Callback1<Integer>() {
			@Override public void $invoke(Integer delta) {
				CustomWarsTactics.renderCtx.evaluateCycle(delta);
				if (state.render != null) {
					state.render.$invoke(delta);
				}
			}
		};

		ingameState.inputMove = new Callback2<Integer, Integer>() {
			@Override public void $invoke(Integer x, Integer y) {
				if (state.inputMove != null) {
					state.inputMove.$invoke(x, y);

				} else {
					CustomWarsTactics.gameWorkflowData.setCursorPosition(CustomWarsTactics.renderCtx.convertToTilePos(x), CustomWarsTactics.renderCtx.convertToTilePos(y), true);
				}
			}
		};

		return ingameState;
	}
}
