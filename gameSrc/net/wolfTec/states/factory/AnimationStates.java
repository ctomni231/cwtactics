package net.wolfTec.states.factory;

import net.wolfTec.CustomWarsTactics;
import net.wolfTec.input.InputData;
import net.wolfTec.states.State;
import net.wolfTec.states.Statemachine;

import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

public abstract class AnimationStates {
    public static void addToStateMachine (Statemachine statemachine) {

    }

    public static State addAnimationState (final State state) {
        State animationState = new State();
        state.init.$invoke();

        animationState.enter = new Callback0() {
            @Override
            public void $invoke() {
                state.enter.$invoke();
            }
        };

        animationState.exit = new Callback0() {
            @Override
            public void $invoke() {
                state.exit.$invoke();
            }
        };

        animationState.update = new Callback2<Integer, InputData>() {
            @Override
            public void $invoke(Integer delta, InputData inputData) {
                state.update.$invoke(delta, inputData);
                // TODO: move into state
                // state.currentSubState++;
                if (state.currentSubState == state.subStates) {
                    CustomWarsTactics.gameWorkflow.changeState(state.nextState);
                }
            }
        };

        animationState.render = new Callback1<Integer>() {
            @Override
            public void $invoke(Integer delta) {
                CustomWarsTactics.renderCtx.evaluateCycle(delta);
                if (state.render != null) {
                    state.render.$invoke(delta);
                }
            }
        };

        animationState.animationState = true;

        return animationState;
    }
}
