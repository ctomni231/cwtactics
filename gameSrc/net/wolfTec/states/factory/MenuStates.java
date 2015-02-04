package net.wolfTec.states.factory;

import net.wolfTec.input.InputData;
import net.wolfTec.states.State;
import net.wolfTec.states.StatemachineBean;
import net.wolfTec.wtEngine.Constants;
import net.wolfTec.wtEngine.Game;
import net.wolfTec.wtEngine.uiWidgets.UiField;

import org.stjs.javascript.dom.canvas.CanvasRenderingContext2D;
import org.stjs.javascript.functions.Callback0;
import org.stjs.javascript.functions.Callback1;
import org.stjs.javascript.functions.Callback2;

public abstract class MenuStates {
    public static void addToStateMachine (StatemachineBean statemachine) {

    }

    /**
     * Adds a menu state (normally this means all states that aren't inGame plus have input connection). Every menu
     * state will be designed with a **cwt.UIScreenLayout** which can be configured by the **doLayout(layout)**
     * function property in the state description.
     */
    public static State addMenuState (final State state) {
        final State animationState = new State();
        state.init.$invoke();

        animationState.inputMove = new Callback2<Integer, Integer>() {
            @Override
            public void $invoke(Integer x, Integer y) {
                if (state.layout.updateIndex(x, y)) {
                    state.currentSubState = 0;
                }
            }
        };

        animationState.init = new Callback0() {
            @Override
            public void $invoke() {
                state.init.$invoke();
                state.doLayout.$invoke(state.layout);

                if (state.GENERIC_INPUT != null) {
                    animationState.GENERIC_INPUT = new Callback2<Integer, Integer>() {
                        @Override
                        public void $invoke(Integer x, Integer y) {
                            state.GENERIC_INPUT.$invoke(x, y);
                        }
                    };
                }
            }
        };

        animationState.enter = new Callback0() {
            @Override
            public void $invoke() {
                state.currentSubState = 0;
                state.enter.$invoke();
            }
        };

        animationState.exit = new Callback0() {
            @Override
            public void $invoke() {
                state.exit.$invoke();
            }
        };

        animationState.render = new Callback1<Integer>() {
            @Override
            public void $invoke(Integer delta) {
                if (state.currentSubState == 0) {
                    CanvasRenderingContext2D ctx = net.wolfTec.renderCtx.layerUI.getContext(Constants.INACTIVE_ID);
                    state.layout.draw(ctx);
                    state.currentSubState = 1;
                }
            }
        };

        return animationState;
    }
}
